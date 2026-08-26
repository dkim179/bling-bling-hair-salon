import { services } from '../data/site'

export default function Services() {
  const groups = ['Haircuts', 'Colour', 'Texture']
  return (
    <section className="section services" id="services">
      <div className="sectionHead"><p className="eyebrow">OUR SERVICES</p><h2>Simple, personal,<br/><em>experienced.</em></h2><p className="muted">Pricing can be added later as “From $XX” or kept consultation-based.</p></div>
      <div className="serviceGroups">
        {groups.map(group => (
          <div className="serviceGroup" key={group}>
            <h3>{group}</h3>
            {services.filter(s => s.group === group).map(s => (
              <div className="serviceRow" key={s.name}>
                <div><strong>{s.name}</strong><p>{s.description}</p></div><span>↗</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
