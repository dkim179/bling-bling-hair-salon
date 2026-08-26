import { ArrowUpRight } from 'lucide-react'
import { site } from '../data/site'

export default function Contact() {
  return (
    <section
      className="contact"
      id="contact"
    >

      <div>

        <p className="eyebrow eyebrow--light">
          BOOKING
        </p>

        <h2>
          Ready for your
          <br />
          <em>next look?</em>
        </h2>

      </div>

      <div className="contact__details">

        <p>
          Appointments are available Monday through Saturday.
        </p>

        <h3>
          9:00 AM — 4:00 PM
        </h3>

        <p>
          Sunday · Closed
        </p>

        <div className="contact__buttons">

          <a
            className="button button--light"
            href="/book"
          >
            Book
            <ArrowUpRight size={17} />
          </a>

        </div>

        <p className="contact__location">
          Private salon located in {site.city}, {site.province}.
          <br />
          {site.locationNote}
        </p>

      </div>

    </section>
  )
}