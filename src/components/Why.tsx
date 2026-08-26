export default function Why() {
  const items = [
    ['01','Experienced','Over 20 years of professional hairstyling experience.'],
    ['02','Personal','One-on-one appointments with individualized attention.'],
    ['03','Comfortable','A calm private salon experience without the rush of a busy salon.'],
  ]
  return <section className="section why"><p className="eyebrow">WHY BLING BLING</p><div className="whyGrid">{items.map(([n,t,d]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>
}
