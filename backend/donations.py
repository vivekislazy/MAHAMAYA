import os
import uuid
import secrets
from datetime import datetime, timezone, timedelta
from typing import Literal, Optional
from urllib.parse import quote
from collections import defaultdict, deque
from time import monotonic
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field, field_validator

router = APIRouter(prefix='/donations')

UPI_ID = os.environ.get('DONATION_UPI_ID', 'mahamaya.demo@upi')
UPI_NAME = os.environ.get('DONATION_UPI_NAME', 'Mahamaya Cultural Guide')
GOAL = int(os.environ.get('DONATION_GOAL_INR', '500000'))
PURPOSES = ('general', 'artisans', 'bhog', 'access')
MIN_AMOUNT, MAX_AMOUNT = 10, 500000

DEMO_SUPPORTERS = [
    ('Ananya', 'For the artisans of Kumartuli, who give Maa her face every year.', 1001, 'artisans', 26),
    ('Rohan & Priya', 'Visiting from Pune. This guide made our first Pujo unforgettable.', 501, 'general', 22),
    ('Sourav', 'Bhog for everyone. Joy Maa Durga!', 2001, 'bhog', 19),
    ('Meera', '', 101, 'general', 15),
    ('The Bhattacharya family', 'In memory of Dadu, who took us pandal-hopping every Ashtami.', 5001, 'access', 12),
    ('Lukas', 'From Berlin with love. Thank you for the stories.', 1001, 'artisans', 8),
    ('Ishita', 'Keep this free for every traveller.', 501, 'general', 4),
    ('Anonymous', 'Dhaaker taal, hriday e jaal.', 251, 'bhog', 1),
]

class DonationCreate(BaseModel):
    visitor_id: uuid.UUID
    amount: int = Field(ge=MIN_AMOUNT, le=MAX_AMOUNT)
    purpose: Literal['general', 'artisans', 'bhog', 'access'] = 'general'
    name: str = Field('', max_length=40)
    message: str = Field('', max_length=160)
    public: bool = True

    @field_validator('name', 'message')
    @classmethod
    def clean(cls, value):
        return ' '.join(value.split())

class DonationConfirm(BaseModel):
    visitor_id: uuid.UUID

class Donation(BaseModel):
    id: str
    reference: str
    amount: int
    purpose: str
    name: str
    message: str
    public: bool
    status: str
    method: str
    upi_uri: str
    upi_id: str
    payee: str
    created_at: str
    confirmed_at: Optional[str] = None

class Supporter(BaseModel):
    name: str
    message: str
    amount: int
    purpose: str
    created_at: str
    demo: bool = False

class Wall(BaseModel):
    total: int
    count: int
    goal: int
    demo_total: int
    supporters: list[Supporter]

def upi_uri(amount, reference):
    return f'upi://pay?pa={quote(UPI_ID)}&pn={quote(UPI_NAME)}&am={amount}.00&cu=INR&tn={quote("Mahamaya " + reference)}'

def public_view(doc):
    fields = {k: doc.get(k) for k in Donation.model_fields if k not in ('upi_uri', 'upi_id', 'payee')}
    return Donation(**fields, upi_uri=upi_uri(doc['amount'], doc['reference']), upi_id=UPI_ID, payee=UPI_NAME)

async def seed_demo_supporters(db):
    await db.donations.create_index('id', unique=True)
    await db.donations.create_index([('status', 1), ('public', 1), ('confirmed_at', -1)])
    if await db.donations.count_documents({'demo': True}):
        return
    now = datetime.now(timezone.utc)
    for name, message, amount, purpose, days in DEMO_SUPPORTERS:
        when = (now - timedelta(days=days, hours=days % 5)).isoformat()
        await db.donations.insert_one({'id': str(uuid.uuid4()), 'reference': 'MM-DEMO' + secrets.token_hex(2).upper(), 'visitor_id': 'demo', 'amount': amount, 'purpose': purpose, 'name': name, 'message': message, 'public': True, 'status': 'confirmed', 'method': 'demo', 'demo': True, 'created_at': when, 'confirmed_at': when})

requests_by_ip = defaultdict(deque)

def throttle(request, limit=12):
    queue = requests_by_ip[request.client.host]
    now = monotonic()
    while queue and queue[0] < now - 60:
        queue.popleft()
    if len(queue) >= limit:
        raise HTTPException(429, 'Too many requests. Please wait a minute.')
    queue.append(now)

@router.get('/wall', response_model=Wall)
async def wall(request: Request):
    db = request.app.state.db
    confirmed = {'status': 'confirmed'}
    totals = await db.donations.aggregate([{'$match': confirmed}, {'$group': {'_id': '$demo', 'total': {'$sum': '$amount'}, 'count': {'$sum': 1}}}]).to_list(4)
    total = sum(t['total'] for t in totals)
    count = sum(t['count'] for t in totals)
    demo_total = sum(t['total'] for t in totals if t['_id'])
    docs = await db.donations.find({**confirmed, 'public': True}, {'_id': 0}).sort('confirmed_at', -1).limit(24).to_list(24)
    supporters = [Supporter(name=d['name'] or 'Anonymous', message=d['message'], amount=d['amount'], purpose=d['purpose'], created_at=d['confirmed_at'], demo=bool(d.get('demo'))) for d in docs]
    return Wall(total=total, count=count, goal=GOAL, demo_total=demo_total, supporters=supporters)

@router.get('/mine/{visitor_id}', response_model=list[Donation])
async def mine(visitor_id: uuid.UUID, request: Request):
    db = request.app.state.db
    docs = await db.donations.find({'visitor_id': str(visitor_id)}, {'_id': 0}).sort('created_at', -1).limit(10).to_list(10)
    return [public_view(d) for d in docs]

@router.post('', response_model=Donation, status_code=201)
async def create(data: DonationCreate, request: Request):
    throttle(request)
    db = request.app.state.db
    now = datetime.now(timezone.utc).isoformat()
    reference = 'MM-' + secrets.token_hex(3).upper()
    doc = {'id': str(uuid.uuid4()), 'reference': reference, 'visitor_id': str(data.visitor_id), 'amount': data.amount, 'purpose': data.purpose, 'name': data.name, 'message': data.message, 'public': data.public, 'status': 'pending', 'method': 'upi', 'demo': False, 'created_at': now, 'confirmed_at': None}
    await db.donations.insert_one(doc.copy())
    return public_view(doc)

@router.post('/{donation_id}/confirm', response_model=Donation)
async def confirm(donation_id: uuid.UUID, data: DonationConfirm, request: Request):
    throttle(request)
    db = request.app.state.db
    doc = await db.donations.find_one({'id': str(donation_id)}, {'_id': 0})
    if not doc or doc['visitor_id'] != str(data.visitor_id):
        raise HTTPException(404, 'Donation not found')
    if doc['status'] != 'confirmed':
        confirmed_at = datetime.now(timezone.utc).isoformat()
        await db.donations.update_one({'id': doc['id'], 'status': {'$ne': 'confirmed'}}, {'$set': {'status': 'confirmed', 'confirmed_at': confirmed_at, 'method': 'upi_self_reported'}})
        doc = await db.donations.find_one({'id': doc['id']}, {'_id': 0})
    return public_view(doc)
