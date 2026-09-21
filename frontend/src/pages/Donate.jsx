import React, {useCallback, useEffect, useState} from 'react';
import {Heart, HandHeart, Hammer, Utensils, Accessibility, Copy, Check, Smartphone, ShieldCheck, ArrowUpRight, Sparkles, RefreshCw, Share2} from 'lucide-react';
import {QRCodeSVG} from 'qrcode.react';
import {toast} from 'sonner';
import {motion} from 'framer-motion';
import {useApp, API, tone} from '../context';
import {PageIntro, Eyebrow, Reveal, Action} from '../components/shared';
import {Button} from '../components/ui/button';
import './Donate.css';

const tiers = [101, 501, 1001, 5001];
const purposes = [
  ['general', HandHeart, 'Keep Mahamaya free', 'মহামায়া বিনামূল্যে রাখুন', 'Servers, maps, the live storyteller and translations for every traveller who arrives with no guide.', 'সার্ভার, মানচিত্র, জীবন্ত কাহিনিকার ও অনুবাদ — নির্দেশিকা ছাড়া আসা প্রতিটি পর্যটকের জন্য।'],
  ['artisans', Hammer, 'Artisans of Kumartuli', 'কুমোরটুলির শিল্পী', 'A stipend fund for the sculptors, lighting crews and alpona painters whose hands shape the festival.', 'প্রতিমাশিল্পী, আলোকশিল্পী ও আলপনা আঁকিয়েদের জন্য সহায়তা তহবিল।'],
  ['bhog', Utensils, 'Bhog for everyone', 'সবার জন্য ভোগ', 'Community khichuri bhog served without a ticket, so no visitor eats alone on Ashtami.', 'টিকিট ছাড়া খিচুড়ি ভোগ, যাতে অষ্টমীতে কেউ একা না খায়।'],
  ['access', Accessibility, 'Safe, open pandals', 'সুরক্ষিত, উন্মুক্ত মণ্ডপ', 'Volunteer marshals, step-free ramps, water points and lost-and-found desks at busy circuits.', 'স্বেচ্ছাসেবক, র‍্যাম্প, পানীয় জল ও হারানো-প্রাপ্তি কাউন্টার।'],
];
const inr = n => '₹' + Number(n).toLocaleString('en-IN');
const timeAgo = (iso, t) => {const d = Math.max(0, Math.round((Date.now() - new Date(iso)) / 864e5)); return d === 0 ? t('today', 'আজ') : d === 1 ? t('yesterday', 'গতকাল') : t(`${d} days ago`, `${d} দিন আগে`);};

const Impact = ({wall, t}) => {
  const pct = wall ? Math.min(100, Math.round(wall.total / wall.goal * 100)) : 0;
  return <section className="impact-strip" data-testid="impact-strip"><div><span>{t('RAISED SO FAR', 'এ পর্যন্ত সংগৃহীত')}</span><strong data-testid="impact-total">{wall ? inr(wall.total) : '—'}</strong></div><div><span>{t('SUPPORTERS', 'সহায়তাকারী')}</span><strong data-testid="impact-count">{wall ? wall.count : '—'}</strong></div><div><span>{t('2026 GOAL', '২০২৬ লক্ষ্য')}</span><strong data-testid="impact-goal">{wall ? inr(wall.goal) : '—'}</strong></div><div className="impact-progress"><span>{pct}% {t('of the way there', 'পথ পেরিয়ে')}</span><div><motion.i initial={{width: 0}} animate={{width: pct + '%'}} transition={{duration: 1.4, ease: [.2, .7, .2, 1]}} data-testid="impact-progress-bar"/></div></div></section>;
};

const Purposes = ({value, onChange, t}) => <div className="purpose-grid" data-testid="purpose-grid">{purposes.map(([id, Icon, en, bn, den, dbn], i) => <button type="button" key={id} className={value === id ? 'purpose-card active' : 'purpose-card'} data-testid={`purpose-${id}`} onClick={() => onChange(id)} aria-pressed={value === id}><span className="purpose-idx">0{i + 1}</span><Icon size={26}/><h3>{t(en, bn)}</h3><p>{t(den, dbn)}</p></button>)}</div>;

const GiftForm = ({onCreate, busy, t}) => {
  const [amount, setAmount] = useState(501), [custom, setCustom] = useState(''), [purpose, setPurpose] = useState('general'), [name, setName] = useState(''), [message, setMessage] = useState(''), [pub, setPub] = useState(true);
  const value = custom ? Number(custom) : amount, valid = value >= 10 && value <= 500000;
  return <form className="gift-form" data-testid="gift-form" onSubmit={e => {e.preventDefault(); if (valid) onCreate({amount: value, purpose, name, message, public: pub});}}>
    <Eyebrow id="gift-step-1">{t('STEP 01 · CHOOSE WHERE YOUR GIFT GOES', 'ধাপ ০১ · আপনার দান কোথায় যাবে')}</Eyebrow>
    <Purposes value={purpose} onChange={setPurpose} t={t}/>
    <Eyebrow id="gift-step-2">{t('STEP 02 · CHOOSE AN AMOUNT', 'ধাপ ০২ · পরিমাণ বেছে নিন')}</Eyebrow>
    <div className="tier-row">{tiers.map(v => <button type="button" key={v} data-testid={`tier-${v}`} className={!custom && amount === v ? 'active' : ''} onClick={() => {setAmount(v); setCustom('');}}>{inr(v)}</button>)}<label className={custom ? 'custom-amount active' : 'custom-amount'}><span>₹</span><input data-testid="custom-amount-input" inputMode="numeric" placeholder={t('Custom', 'অন্য')} value={custom} onChange={e => setCustom(e.target.value.replace(/\D/g, '').slice(0, 6))}/></label></div>
    <p className="tier-hint" data-testid="tier-hint">{t('Odd numbers ending in 1 are a Bengali blessing — a gift that is never “complete”, so the giving continues.', 'শেষে ১ থাকা বিজোড় সংখ্যা বাঙালি রীতিতে শুভ — দান কখনও “সম্পূর্ণ” হয় না, তাই চলতেই থাকে।')}</p>
    <Eyebrow id="gift-step-3">{t('STEP 03 · LEAVE YOUR NAME (OPTIONAL)', 'ধাপ ০৩ · আপনার নাম (ঐচ্ছিক)')}</Eyebrow>
    <div className="gift-fields"><input data-testid="donor-name-input" maxLength={40} placeholder={t('Name or “Anonymous”', 'নাম বা “অজ্ঞাতনামা”')} value={name} onChange={e => setName(e.target.value)}/><input data-testid="donor-message-input" maxLength={160} placeholder={t('A short message for the wall', 'দেয়ালের জন্য ছোট বার্তা')} value={message} onChange={e => setMessage(e.target.value)}/></div>
    <label className="gift-public"><input type="checkbox" data-testid="donor-public-toggle" checked={pub} onChange={e => setPub(e.target.checked)}/><span>{t('Show my name and message on the supporters wall', 'সহায়তাকারীদের দেয়ালে আমার নাম ও বার্তা দেখান')}</span></label>
    <div className="gift-submit"><Button type="submit" className="action" data-testid="create-donation-button" disabled={!valid || busy}>{busy ? <RefreshCw size={16} className="spin"/> : <Heart size={16}/>}{t(`Give ${valid ? inr(value) : ''} via UPI`, `UPI-এ ${valid ? inr(value) : ''} দিন`)}</Button><small data-testid="gift-limits">{t('₹10 – ₹5,00,000 · UPI QR · No account needed', '₹১০ – ₹৫,০০,০০০ · UPI QR · অ্যাকাউন্ট লাগবে না')}</small></div>
  </form>;
};

const QrStep = ({donation, onConfirm, onBack, busy, t}) => {
  const [copied, setCopied] = useState('');
  const copy = async (text, key) => {try {await navigator.clipboard.writeText(text); setCopied(key); toast.success(t('Copied', 'কপি হয়েছে'));} catch {toast.error(t('Please copy manually.', 'নিজে কপি করুন।'));}};
  return <div className="qr-step" data-testid="qr-step">
    <div className="qr-card"><div className="qr-frame"><QRCodeSVG value={donation.upi_uri} size={220} level="M" bgColor="#faf7f0" fgColor="#2a1a10" data-testid="upi-qr"/></div><strong data-testid="qr-amount">{inr(donation.amount)}</strong><span data-testid="qr-reference">{t('Reference', 'রেফারেন্স')} · {donation.reference}</span><a className="upi-open" href={donation.upi_uri} data-testid="open-upi-app"><Smartphone size={16}/>{t('Open in a UPI app', 'UPI অ্যাপে খুলুন')}</a></div>
    <div className="qr-copy"><Eyebrow id="qr-eyebrow">{t('STEP 04 · SCAN & PAY', 'ধাপ ০৪ · স্ক্যান করে দিন')}</Eyebrow><h2 className="editorial-title">{t('Scan with any', 'কোনো UPI অ্যাপে')} <em>{t('UPI app.', 'স্ক্যান করুন।')}</em></h2><p>{t('GPay, PhonePe, Paytm, BHIM or your bank app. The amount and reference are pre-filled so your gift lands in the right place.', 'GPay, PhonePe, Paytm, BHIM বা ব্যাংক অ্যাপ। পরিমাণ ও রেফারেন্স আগে থেকেই ভরা থাকে।')}</p>
      <dl className="upi-details"><div><dt>{t('UPI ID', 'UPI আইডি')}</dt><dd data-testid="upi-id">{donation.upi_id}<button type="button" data-testid="copy-upi-id" onClick={() => copy(donation.upi_id, 'id')} aria-label="Copy UPI ID">{copied === 'id' ? <Check size={15}/> : <Copy size={15}/>}</button></dd></div><div><dt>{t('Payee', 'প্রাপক')}</dt><dd data-testid="upi-payee">{donation.payee}</dd></div><div><dt>{t('Note', 'নোট')}</dt><dd>Mahamaya {donation.reference}<button type="button" data-testid="copy-reference" onClick={() => copy('Mahamaya ' + donation.reference, 'ref')} aria-label="Copy reference">{copied === 'ref' ? <Check size={15}/> : <Copy size={15}/>}</button></dd></div></dl>
      <div className="qr-actions"><Button className="action" data-testid="confirm-donation-button" disabled={busy} onClick={onConfirm}>{busy ? <RefreshCw size={16} className="spin"/> : <Check size={16}/>}{t('I have completed the payment', 'আমি টাকা পাঠিয়েছি')}</Button><button type="button" className="text-link" data-testid="change-amount-button" onClick={onBack}>{t('Change amount', 'পরিমাণ বদলান')}</button></div>
      <p className="demo-note" data-testid="demo-note"><ShieldCheck size={15}/>{t('Demo mode: this UPI ID is a placeholder and no money moves. Confirming simply records your pledge. Live verification via Razorpay or Stripe is switched on once payment keys are added.', 'ডেমো মোড: এই UPI আইডি একটি নমুনা, কোনো টাকা যায় না। নিশ্চিত করলে শুধু আপনার প্রতিশ্রুতি লিপিবদ্ধ হয়। পেমেন্ট কী যুক্ত হলে Razorpay/Stripe যাচাই চালু হবে।')}</p>
    </div>
  </div>;
};

const ThankYou = ({donation, onAgain, t}) => {
  const share = async () => {const text = t(`I just supported Mahamaya, a free Durga Puja guide for travellers to Bengal. Join me: ${window.location.origin}/donate`, `আমি মহামায়াকে সহায়তা করলাম — বাংলায় আসা পর্যটকদের জন্য বিনামূল্যের দুর্গাপুজো নির্দেশিকা। আপনিও যোগ দিন: ${window.location.origin}/donate`); try {if (navigator.share) await navigator.share({text}); else {await navigator.clipboard.writeText(text); toast.success(t('Message copied to share', 'বার্তা কপি হয়েছে'));}} catch {}};
  return <motion.div className="thank-you" data-testid="thank-you" initial={{opacity: 0, scale: .97}} animate={{opacity: 1, scale: 1}} transition={{duration: .6}}><Sparkles size={30}/><Eyebrow id="thank-eyebrow">{t('PRANAM · YOUR GIFT IS RECORDED', 'প্রণাম · আপনার দান লিপিবদ্ধ')}</Eyebrow><h2 data-testid="thank-you-title">{t('Thank you,', 'ধন্যবাদ,')} <em>{donation.name || t('kind traveller.', 'সহৃদয় পথিক।')}</em></h2><p>{t(`${inr(donation.amount)} towards “${t(...purposes.find(p => p[0] === donation.purpose).slice(2, 4))}”. Reference ${donation.reference}. ${donation.public ? 'Your name now glows on the supporters wall below.' : 'You chose to stay private, and we honour that.'}`, `“${t(...purposes.find(p => p[0] === donation.purpose).slice(2, 4))}”-এর জন্য ${inr(donation.amount)}। রেফারেন্স ${donation.reference}। ${donation.public ? 'আপনার নাম এখন নিচের দেয়ালে আলো ছড়াচ্ছে।' : 'আপনি গোপন থাকতে চেয়েছেন, আমরা সম্মান করি।'}`)}</p><div className="thank-actions"><Button className="action" data-testid="share-donation-button" onClick={share}><Share2 size={16}/>{t('Invite a friend', 'বন্ধুকে আমন্ত্রণ')}</Button><button type="button" className="text-link" data-testid="donate-again-button" onClick={onAgain}>{t('Give again', 'আবার দিন')}</button></div></motion.div>;
};

const WallSection = ({wall, t}) => <section className="wall-section" data-testid="supporters-wall"><div className="section-heading"><div><Eyebrow id="wall-eyebrow">{t('THE SUPPORTERS WALL', 'সহায়তাকারীদের দেয়াল')}</Eyebrow><h2 className="editorial-title">{t('Names that light', 'যাঁদের নামে জ্বলে')} <em>{t('the lamps.', 'প্রদীপ।')}</em></h2></div><p>{t('Every gift, however small, is a diya in this pandal. Names appear only with permission.', 'ছোট-বড় প্রতিটি দান এই মণ্ডপের একটি প্রদীপ। অনুমতি নিয়েই নাম দেখানো হয়।')}</p></div>{wall && wall.demo_total > 0 && <p className="fine-print" data-testid="wall-demo-note">{t('Some entries are illustrative demo supporters so the wall is never empty on day one.', 'দেয়াল যাতে প্রথম দিনে ফাঁকা না থাকে, কিছু নমুনা সহায়তাকারী দেখানো হয়েছে।')}</p>}<div className="wall-grid">{wall ? wall.supporters.map((s, i) => <Reveal key={s.created_at + i} delay={Math.min(i, 6) * .05}><article className="wall-card" data-testid={`supporter-${i}`}><div><strong>{s.name}</strong><span>{inr(s.amount)}</span></div>{s.message && <p>“{s.message}”</p>}<small>{t(...purposes.find(p => p[0] === s.purpose).slice(2, 4))} · {timeAgo(s.created_at, t)}{s.demo && <i> · {t('demo', 'ডেমো')}</i>}</small></article></Reveal>) : <div className="loading-state" data-testid="wall-loading">{t('Lighting the lamps…', 'প্রদীপ জ্বালানো হচ্ছে…')}</div>}</div></section>;

const faqs = [
  ['Where does the money go?', 'টাকা কোথায় যায়?', 'Into the four funds above, in the proportion supporters choose. A simple ledger is published after each festival season.', 'উপরের চারটি তহবিলে, সহায়তাকারীদের পছন্দ অনুসারে। প্রতি উৎসবের পরে একটি সহজ হিসাব প্রকাশ করা হয়।'],
  ['Is my donation tax-deductible?', 'কর ছাড় পাব?', 'Not at the moment. Mahamaya is an independent cultural project, not a registered charity. Please treat gifts as goodwill support.', 'এখন নয়। মহামায়া একটি স্বতন্ত্র সাংস্কৃতিক প্রকল্প, নিবন্ধিত দাতব্য সংস্থা নয়।'],
  ['Can I give from outside India?', 'ভারতের বাইরে থেকে দিতে পারি?', 'UPI works for Indian bank accounts. International card checkout arrives with the payment-gateway launch; until then, reach us and we will share a way.', 'UPI ভারতীয় ব্যাংকের জন্য। আন্তর্জাতিক কার্ড পেমেন্ট গেটওয়ে চালু হলে আসবে।'],
  ['Are refunds possible?', 'ফেরত পাওয়া যায়?', 'Write to us within 7 days with your reference number and we will make it right.', 'রেফারেন্স নম্বর সহ ৭ দিনের মধ্যে লিখুন, আমরা সমাধান করব।'],
];

export default function Donate() {
  const {t, visitor} = useApp();
  const [wall, setWall] = useState(null), [donation, setDonation] = useState(null), [busy, setBusy] = useState(false), [open, setOpen] = useState(0);
  const loadWall = useCallback(async () => {try {const r = await fetch(`${API}/donations/wall`); if (r.ok) setWall(await r.json());} catch {}}, []);
  useEffect(() => {loadWall();}, [loadWall]);
  const create = async body => {
    setBusy(true);
    try {const r = await fetch(`${API}/donations`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...body, visitor_id: visitor})}); if (!r.ok) throw new Error(); setDonation(await r.json()); tone('bell'); document.getElementById('gift-panel')?.scrollIntoView({behavior: 'smooth', block: 'start'});}
    catch {toast.error(t('Could not prepare your gift. Please try again.', 'দান প্রস্তুত হয়নি। আবার চেষ্টা করুন।'));}
    finally {setBusy(false);}
  };
  const confirm = async () => {
    setBusy(true);
    try {const r = await fetch(`${API}/donations/${donation.id}/confirm`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({visitor_id: visitor})}); if (!r.ok) throw new Error(); setDonation(await r.json()); tone('bell'); setTimeout(() => tone('drum'), 300); toast.success(t('Pranam. Your gift is recorded.', 'প্রণাম। আপনার দান লিপিবদ্ধ হয়েছে।')); loadWall();}
    catch {toast.error(t('Could not confirm. Please try again.', 'নিশ্চিত হয়নি। আবার চেষ্টা করুন।'));}
    finally {setBusy(false);}
  };
  return <div className="donate-page"><PageIntro chapter={t('06 / A GIFT FOR THE GODDESS’S CITY', '০৬ / দেবীর শহরের জন্য উপহার')} title={t('Give a little.', 'একটু দিন।')} italic={t('Light a lot.', 'অনেক আলো জ্বালুন।')} description={t('Mahamaya is free for every traveller. Your gift keeps it that way — and sends something real back to the artisans, kitchens and volunteers who make Pujo possible.', 'মহামায়া প্রতিটি পর্যটকের জন্য বিনামূল্যে। আপনার দান তা বজায় রাখে — এবং শিল্পী, রান্নাঘর ও স্বেচ্ছাসেবকদের কাছে সত্যিকারের কিছু ফিরিয়ে দেয়।')}/>
    <Impact wall={wall} t={t}/>
    <section className="gift-panel" id="gift-panel" data-testid="gift-panel">{donation?.status === 'confirmed' ? <ThankYou donation={donation} t={t} onAgain={() => setDonation(null)}/> : donation ? <QrStep donation={donation} busy={busy} t={t} onConfirm={confirm} onBack={() => setDonation(null)}/> : <GiftForm onCreate={create} busy={busy} t={t}/>}</section>
    <WallSection wall={wall} t={t}/>
    <section className="donate-faq" data-testid="donate-faq"><div><Eyebrow id="faq-eyebrow">{t('GOOD TO KNOW', 'জেনে রাখুন')}</Eyebrow><h2 className="editorial-title">{t('Honest answers,', 'সরল উত্তর,')} <em>{t('before you give.', 'দেওয়ার আগে।')}</em></h2><Action to="/explore" id="donate-explore">{t('Or simply explore the pandals', 'অথবা মণ্ডপ ঘুরে দেখুন')}</Action></div><div className="faq-list">{faqs.map(([q, qb, a, ab], i) => <div key={q} className={open === i ? 'faq-item open' : 'faq-item'}><button type="button" data-testid={`faq-${i}`} onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>{t(q, qb)}<ArrowUpRight size={18}/></button><p>{t(a, ab)}</p></div>)}</div></section>
  </div>;
}
