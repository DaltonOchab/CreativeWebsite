import { useRef, useState } from 'react'
import { useScroll, useMotionValueEvent, useReducedMotion } from 'motion/react'
import { ramp } from './scroll'
import Footer from './Footer'

const steps = [
  { title: 'Pair your ball.', text: 'The concept connects a compatible golf ball with an intuitive mobile app before your round.' },
  { title: 'Follow the signal.', text: 'Open the locator after your shot. The proposed app guides your search, then an audible signal helps with the final few steps.' },
  { title: 'Get back to golf.', text: 'Less frustration in the rough. More time enjoying the game. Real-world range, durability, and playing performance still need testing.' },
]
const markets = [
  { name: 'New York', count: 625, idea: 'Test demonstrations with club professionals and pro shops.' },
  { name: 'Florida', count: 624, idea: 'Invite course managers to a small on-course pilot.' },
  { name: 'California', count: 606, idea: 'Collect golfer feedback on convenience, feel, and price.' },
  { name: 'Midwest', count: null, idea: 'Include a regional pilot: the Midwest leads in mean establishments per state (268.25).' },
]

function Ball() {
  return <svg className="ball-art" viewBox="0 0 400 400" role="img" aria-label="Concept golf ball with a locator mark">
    <defs><radialGradient id="ball"><stop stopColor="#fff" offset="0"/><stop stopColor="#cbd1c5" offset=".7"/><stop stopColor="#647565" offset="1"/></radialGradient><pattern id="dimples" width="24" height="21" patternUnits="userSpaceOnUse"><circle cx="12" cy="10" r="6" fill="none" stroke="#6e7d6b" strokeOpacity=".23"/><path d="M7 9a5 5 0 0 1 9-2" fill="none" stroke="#fff" strokeOpacity=".8"/></pattern><clipPath id="round"><circle cx="200" cy="200" r="155"/></clipPath></defs>
    <ellipse cx="200" cy="365" rx="119" ry="15" fill="#000" opacity=".3"/><circle cx="200" cy="200" r="155" fill="url(#ball)"/><circle cx="200" cy="200" r="155" fill="url(#dimples)" clipPath="url(#round)"/><g fill="none" stroke="#35492e" strokeWidth="5"><circle cx="240" cy="190" r="20"/><circle cx="240" cy="190" r="8"/><path d="M240 160v-12m0 84v-12m-30-30h-12m84 0h-12"/></g><text x="200" y="258" textAnchor="middle" fill="#32462e" fontSize="12" letterSpacing="4">GOLF BALL LOCATOR</text>
  </svg>
}

function Demo() {
  const [distance, setDistance] = useState(24)
  const [active, setActive] = useState(false)
  const [sound, setSound] = useState('')
  const audio = useRef<AudioContext | null>(null)
  async function ping() {
    try {
      const context = audio.current ?? new AudioContext(); audio.current = context
      await context.resume()
      const oscillator = context.createOscillator(); const gain = context.createGain()
      oscillator.connect(gain); gain.connect(context.destination); oscillator.frequency.value = 880
      gain.gain.setValueAtTime(.07, context.currentTime); gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .65)
      oscillator.start(); oscillator.stop(context.currentTime + .65)
      setSound('Sample ping played. The real concept would sound from the ball.')
    } catch { setSound('Audio is unavailable in this browser. The flashing ring shows the sample signal.') }
  }
  return <section className="section demo-section" id="demo"><div><p className="eyebrow">02 / TRY THE IDEA</p><h2>Your next shot<br/>starts with<br/><em>finding this one.</em></h2><p>A mobile app and an audible signal, designed to make the search feel simple. Try the proposed experience here.</p><p className="note">Interactive simulation only. No real ball tracking, GPS connection, or measured range.</p></div>
    <div className="locator glass"><div className="locator-top"><span className="eyebrow">LOCATOR / DEMO</span><span className="status">{active ? '● SIGNAL FOUND' : '○ READY TO SEARCH'}</span></div><div className={`radar ${active ? 'active' : ''}`}><div className="radar-ring"/><div className="radar-ring inner"/><span className="radar-center">+</span><span className="target" style={{ transform: `translate(${active ? distance * 2 : 48}px, ${active ? -distance : -24}px)` }}>●</span></div><div className="readout" aria-live="polite">{active ? distance === 0 ? 'Ball found!' : `${distance} m` : 'Let’s find it.'}<small>{active ? 'Simulated distance' : 'Start the sample search below'}</small></div>
      <button className="button primary" onClick={()=>{setActive(!active);setDistance(24);setSound('')}}>{active ? 'Reset demo' : 'Locate my ball'} <span>↗</span></button>
      <label className="distance-label" htmlFor="distance">Move closer <span>{distance} m</span></label><input id="distance" type="range" min="0" max="40" value={distance} disabled={!active} onChange={e=>setDistance(Number(e.target.value))}/><button className="button outline" disabled={!active} onClick={ping}>Play sample ping ♫</button><p className="audio-status" role="status">{sound || 'Sound plays only when you press the ping button.'}</p>
    </div></section>
}

export default function App() {
  const wrap = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [market, setMarket] = useState(0)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start','end end'] })
  useMotionValueEvent(scrollYProgress, 'change', setProgress)
  const phase = Math.min(2, Math.floor(progress * 3))
  return <><a className="skip" href="#main">Skip to content</a><header><a className="brand" href="#main"><span className="brand-icon">◎</span> Golf Ball Locator</a><nav aria-label="Main navigation"><a href="#how">The idea</a><a href="#demo">Try the locator</a><a href="#research">Our research</a></nav><a className="nav-cta" href="#strategy">The venture ↗</a></header>
    <main id="main"><div className="scroll-story" ref={wrap}><section className="hero"><img className="course-background" src={`${import.meta.env.BASE_URL}assets/course.svg`} alt="Illustrated aerial view of a golf fairway, bunkers, and putting green" style={{transform:reduced ? undefined : `scale(${1 + progress*.15}) translateY(${-progress*2}%)`}}/><div className="hero-shade"/><div className="hero-copy" style={{opacity:1-ramp(progress,[.24,.38]),transform:reduced ? undefined : `translateY(${-ramp(progress,[.24,.38])*60}px)`,visibility:phase>0?'hidden':'visible'}}><p className="eyebrow">A SMARTER SEARCH. A BETTER ROUND.</p><h1>Less searching.<br/>More <em>golf.</em></h1><p>Find your ball. Keep your rhythm. A smart golf ball and mobile app concept for golfers who would rather play than search.</p><div className="actions"><a className="button primary" href="#demo">Try the locator <span>↗</span></a><a className="button outline" href="#how">Explore the idea <span>↓</span></a></div><p className="note">Student venture concept · Product in development</p></div>
    <div className="product-visual" style={{opacity:1-ramp(progress,[.26,.4]),visibility:phase>0?'hidden':'visible'}}><div className="orbital"/><Ball/><div className="signal-tag glass"><span className="dot"/> MADE TO BE FOUND <small>Concept visualization</small></div></div>
    <div className="story-panel" style={{opacity:ramp(progress,[.33,.42])*(1-ramp(progress,[.60,.70])),visibility:phase===1?'visible':'hidden'}}><p className="eyebrow">THE MOMENT AFTER THE SHOT</p><h2>Into the rough.<br/><em>Not out of reach.</em></h2><p>Follow the proposed app signal. Trigger an audible cue. Spend less of your round wondering where the ball went.</p><a className="text-link" href="#demo">Experience the simulation ↗</a></div>
    <div className="story-panel" style={{opacity:ramp(progress,[.69,.8]),visibility:phase===2?'visible':'hidden'}}><p className="eyebrow">THE MISSION</p><h2>Keep the game.<br/><em>Lose the frustration.</em></h2><p>Our mission is to make finding lost golf balls easier through smart technology and an intuitive app—so golfers can spend more time enjoying the game.</p><a className="text-link" href="#how">See how the concept works ↓</a></div>
    <div className="scene-index" aria-label={`Scene ${phase+1} of 3`}>{['THE BALL','THE SEARCH','THE GAME'].map((s,i)=><span className={phase===i?'current':''} key={s}>0{i+1} <small>{s}</small></span>)}</div><div className="hero-bottom"><span>DESIGNED AROUND YOUR NEXT ROUND</span><span>SCROLL TO EXPLORE ↓</span></div></section></div>
    <section className="section how-section" id="how"><div className="section-heading"><p className="eyebrow">01 / FROM LOST TO LOCATED</p><h2>Three steps.<br/><em>One less distraction.</em></h2><p>For recreational golfers across the United States: teens through older adults, all genders, and players who value convenience without a premium-only price tag.</p></div><div className="cards">{steps.map((step,i)=><article className="glass feature" key={step.title}><span className="step-number">0{i+1}</span><div className="feature-icon" aria-hidden="true">{['◎','⌁','⚑'][i]}</div><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></section>
    <Demo/>
    <section className="section research-section" id="research"><div className="section-heading"><p className="eyebrow">03 / LISTEN BEFORE YOU BUILD</p><h2>A ball worth finding.<br/><em>And worth playing.</em></h2><p>The assignment’s analysis of golf ball reviews at Dick’s Sporting Goods points to three priorities. Better locating should complement the game, not compromise it.</p></div><div className="research-grid"><div className="glass findings"><p className="eyebrow">THEMES IN THE ANALYZED SAMPLE</p>{[['Feel & performance',22],['Visibility & finding',12],['Price & value',12]].map(([label,n])=><div className="theme" key={label}><div><span>{label}</span><strong>{n}/38</strong></div><div className="bar"><span style={{width:`${Number(n)/38*100}%`}}/></div></div>)}<p className="note">Source: supplied class assignment. 39 reviews collected; reported theme analysis uses 38 comments. Themes overlap. This small sample does not represent all golfers.</p></div><div className="priorities"><h3>What we’ll test</h3><p><b>Playing feel.</b> Validate ball feel and performance alongside the locating technology.</p><p><b>Everyday value.</b> Test willingness to pay before setting a price. Affordability is a goal, not a confirmed claim.</p><p><b>A simpler search.</b> Test the app and audible cue with golfers on real courses.</p></div></div></section>
    <section className="section strategy-section" id="strategy"><div className="section-heading"><p className="eyebrow">04 / START LOCAL. LEARN FAST.</p><h2>Meet golfers<br/><em>where they play.</em></h2><p>Begin with U.S. course managers, club professionals, and pro shops. Run demonstrations, collect feedback, and measure partner responses, participation, and eventual purchases before scaling.</p></div><div className="market-layout"><div className="market-options" role="group" aria-label="Explore proposed pilot markets">{markets.map((m,i)=><button key={m.name} aria-pressed={market===i} onClick={()=>setMarket(i)}><span>0{i+1}</span>{m.name}<span>↗</span></button>)}</div><div className="glass market-detail" aria-live="polite"><p className="eyebrow">PROPOSED PILOT / {markets[market].name.toUpperCase()}</p><strong>{markets[market].count ?? '268.25'}</strong><p>{market===3?'Mean establishments per state in the Midwest':'Recorded golf course & country club establishments'}</p><hr/><p>{markets[market].idea}</p><span className="note">2023 Census CBP · NAICS 713910</span></div></div><p className="source-note">Figures reproduced from the supplied assignment’s analysis of 50 states. Establishments are outreach leads, not confirmed customers or demand. CBP covers businesses with paid employees; figures are not adjusted for population or area. <a href="https://www.census.gov/data/developers/data-sets/cbp-zbp.html" target="_blank" rel="noreferrer">Official Census source ↗</a></p></section>
    <section className="section faq-section" id="questions"><p className="eyebrow">BEFORE THE FIRST TEE</p><h2>A few good questions.</h2><details><summary>Can I buy it or download the app?</summary><p>Not yet. This is a marketing venture concept for Fairfield University’s MKTG 1101 course. There is no live product, app download, checkout, or waitlist.</p></details><details><summary>How far can it track a ball?</summary><p>Range, battery life, connectivity, and water resistance have not been validated. The locator above uses simulated distances to demonstrate the idea, not product specifications.</p></details><details><summary>Will it play like a regular golf ball?</summary><p>Feel, flight performance, durability, and compliance with golf equipment rules need testing before any such claim can be made.</p></details><details><summary>Who is the initial target customer?</summary><p>U.S. recreational golfers of all genders, from teenagers to older adults, especially value-conscious players seeking convenience. Europe and Asia are possible future markets, after validating the U.S. concept.</p></details></section>
    </main><Footer/></>
}
