import { services } from "../data/site";

export default function Services() {
  const groupedServices = services.reduce(
    (groups, service) => {
      if (!groups[service.group]) {
        groups[service.group] = [];
      }

      groups[service.group].push(service);

      return groups;
    },
    {} as Record<string, typeof services>,
  );

  return (
    <section className="section services" id="services">
      <div className="sectionHead">
        <p className="eyebrow">OUR SERVICES</p>

        <h2>
          Care for every
          <br />
          <em>style.</em>
        </h2>
      </div>

      <div className="serviceGroups">
        {Object.entries(groupedServices).map(([groupName, groupServices]) => (
          <div className="serviceGroup" key={groupName}>
            <h3>{groupName}</h3>

            {groupServices.map((service) => (
              <div className="serviceRow" key={service.name}>
                <div>
                  <strong>{service.name}</strong>

                  <p>{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
