// Public product information only, from the student's confirmed Mission 3 export.
const product = {
  name: 'Smart Ball Starter Pack',
  price: 65.20,
  currency: 'USD',
  pricingUnit: 'per 3-ball pack',
  description: 'Proposed three-ball locator pack with basic companion app.',
  features: ['Proposed app pairing', 'Proposed audible cue', 'Basic locator app included'],
}

export default function Pricing() {
  return <section className="section pricing-section" id="pricing" aria-labelledby="pricing-title">
    <div className="pricing-intro"><p className="eyebrow">THE STARTER PACK / PRODUCT & PRICING</p><h2 id="pricing-title">Three balls.<br/><em>One simpler search.</em></h2><p>A locator pack and its companion app, brought together in one proposed bundle.</p><a className="text-link" href="#demo">Explore the locator concept ↗</a><p className="note">Student venture concept · Product in development</p></div>
    <article className="glass pricing-card" aria-labelledby="pack-title">
      <div className="pack-top"><span className="eyebrow">SMART BALL + COMPANION APP</span><span className="concept-badge">CONCEPT</span></div>
      <div className="pack-art" role="img" aria-label="Illustration of the proposed three-ball pack"><span className="pack-orbit"/>{[1,2,3].map(n=><span className="pack-ball" key={n}><span>◎</span></span>)}</div>
      <h3 id="pack-title">{product.name}</h3><p className="pack-description">{product.description}</p>
      <div className="pack-price"><strong>{new Intl.NumberFormat('en-US',{style:'currency',currency:product.currency}).format(product.price)}</strong><span>{product.currency}<br/>{product.pricingUnit}</span></div>
      <p className="price-context">Selected price for the proposed bundle.</p>
      <ul className="pack-features">{product.features.map(feature=><li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}</ul>
      <a className="button primary" href="#demo">Try the locator demo <span aria-hidden="true">↗</span></a>
      <p className="pack-availability">Not available to purchase. Features are proposed and have not been validated.</p>
      <details><summary>What does the pack include?</summary><p>Three proposed locator golf balls and the basic companion app. No optional add-ons are selected for this bundle.</p></details>
      <details><summary>Can I order it now?</summary><p>This is a venture concept in development. There is no checkout or live app download. You can explore the simulated locator experience to see the idea.</p></details>
    </article>
  </section>
}
