import os
import uuid
from pathlib import Path

import pytest
import requests


def _read_backend_url_from_frontend_env() -> str | None:
    env_path = Path('/app/frontend/.env')
    if not env_path.exists():
        return None
    for line in env_path.read_text().splitlines():
        if line.startswith('REACT_APP_BACKEND_URL='):
            value = line.split('=', 1)[1].strip()
            return value or None
    return None


BASE_URL = os.environ.get('REACT_APP_BACKEND_URL') or _read_backend_url_from_frontend_env()


@pytest.fixture(scope='session')
def base_url():
    if not BASE_URL:
        pytest.skip('REACT_APP_BACKEND_URL not available for API tests')
    return BASE_URL.rstrip('/')


@pytest.fixture()
def api_client():
    session = requests.Session()
    session.headers.update({'Content-Type': 'application/json'})
    return session


# Core health/content APIs
def test_health_ok(api_client, base_url):
    response = api_client.get(f'{base_url}/api/')
    assert response.status_code == 200
    body = response.json()
    assert body.get('status') == 'ok'
    assert body.get('name') == 'Mahamaya'


def test_pandals_count_and_shape(api_client, base_url):
    response = api_client.get(f'{base_url}/api/pandals')
    assert response.status_code == 200
    body = response.json()
    assert isinstance(body, list)
    assert len(body) == 12
    first = body[0]
    assert isinstance(first.get('id'), str)
    assert isinstance(first.get('name'), str)
    assert isinstance(first.get('name_bn'), str)


def test_dates_count_and_shape(api_client, base_url):
    response = api_client.get(f'{base_url}/api/dates')
    assert response.status_code == 200
    body = response.json()
    assert isinstance(body, list)
    assert len(body) == 6
    names = [item.get('name') for item in body]
    assert 'Mahalaya' in names
    assert 'Vijaya Dashami' in names


# Itinerary persistence and validation
def test_itinerary_create_get_update_remove_persisted(api_client, base_url):
    visitor_id = str(uuid.uuid4())

    initial = api_client.get(f'{base_url}/api/itinerary/{visitor_id}')
    assert initial.status_code == 200
    initial_body = initial.json()
    assert initial_body['visitor_id'] == visitor_id
    assert initial_body['pandal_ids'] == []

    save_payload = {'visitor_id': visitor_id, 'pandal_ids': ['bagbazar', 'kumartuli']}
    saved = api_client.put(f'{base_url}/api/itinerary/{visitor_id}', json=save_payload)
    assert saved.status_code == 200
    saved_body = saved.json()
    assert saved_body['visitor_id'] == visitor_id
    assert saved_body['pandal_ids'] == ['bagbazar', 'kumartuli']

    fetched = api_client.get(f'{base_url}/api/itinerary/{visitor_id}')
    assert fetched.status_code == 200
    fetched_body = fetched.json()
    assert fetched_body['pandal_ids'] == ['bagbazar', 'kumartuli']

    remove_payload = {'visitor_id': visitor_id, 'pandal_ids': ['bagbazar']}
    removed = api_client.put(f'{base_url}/api/itinerary/{visitor_id}', json=remove_payload)
    assert removed.status_code == 200
    removed_body = removed.json()
    assert removed_body['pandal_ids'] == ['bagbazar']

    fetched_after_remove = api_client.get(f'{base_url}/api/itinerary/{visitor_id}')
    assert fetched_after_remove.status_code == 200
    assert fetched_after_remove.json()['pandal_ids'] == ['bagbazar']


def test_itinerary_rejects_unknown_pandal(api_client, base_url):
    visitor_id = str(uuid.uuid4())
    payload = {'visitor_id': visitor_id, 'pandal_ids': ['bagbazar', 'unknown-pandal-id']}
    response = api_client.put(f'{base_url}/api/itinerary/{visitor_id}', json=payload)
    assert response.status_code == 400
    assert 'Unknown pandal' in response.text


def test_itinerary_rejects_visitor_mismatch(api_client, base_url):
    path_visitor_id = str(uuid.uuid4())
    payload = {'visitor_id': str(uuid.uuid4()), 'pandal_ids': ['bagbazar']}
    response = api_client.put(f'{base_url}/api/itinerary/{path_visitor_id}', json=payload)
    assert response.status_code == 400
    assert 'Visitor mismatch' in response.text


def test_itinerary_invalid_uuid_rejected(api_client, base_url):
    response = api_client.get(f'{base_url}/api/itinerary/not-a-uuid')
    assert response.status_code == 422
    body = response.json()
    assert body['detail'][0]['type'] == 'uuid_parsing'


# Story generation and persisted history
@pytest.mark.parametrize('language,prompt', [
    ('en', 'Tell me a short Durga Puja story for a first-time visitor to Kolkata.'),
    ('bn', 'কলকাতার দুর্গাপুজো নিয়ে একটি ছোট গল্প বলুন।'),
])
def test_story_sse_stream_and_history_persist(api_client, base_url, language, prompt):
    visitor_id = str(uuid.uuid4())
    payload = {'visitor_id': visitor_id, 'prompt': prompt, 'language': language}

    response = api_client.post(f'{base_url}/api/stories', json=payload, stream=True, timeout=140)
    assert response.status_code == 200
    assert 'text/event-stream' in response.headers.get('content-type', '')

    got_delta = False
    got_done = False
    got_error = False
    for raw_line in response.iter_lines(decode_unicode=True):
        if not raw_line:
            continue
        if not raw_line.startswith('data: '):
            continue
        chunk = raw_line[6:]
        if '"delta"' in chunk:
            got_delta = True
        if '"done"' in chunk:
            got_done = True
            break
        if '"error"' in chunk:
            got_error = True
            break

    assert got_delta or got_done
    assert not got_error

    history = api_client.get(f'{base_url}/api/stories/{visitor_id}', timeout=30)
    assert history.status_code == 200
    history_body = history.json()
    assert isinstance(history_body, list)
    assert len(history_body) >= 1
    latest = history_body[0]
    assert latest['prompt'] == prompt
    assert latest['language'] == language
    assert isinstance(latest['text'], str)
    assert len(latest['text'].strip()) > 0
