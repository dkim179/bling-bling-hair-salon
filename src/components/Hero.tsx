import { ArrowDownRight } from 'lucide-react'
import { site } from '../data/site'

export default function Hero() {
  return (
    <section
      className="hero"
      id="top"
    >

      <div className="hero__copy reveal">

        <p className="eyebrow">
          PRIVATE HAIR SALON · {site.city}
        </p>

        <h1>
          Beautiful hair,
          <br />
          <em>personal care.</em>
        </h1>

        <p className="hero__lead">
          Professional hair services backed by over {site.experience} years
          of experience in {site.city}.
        </p>

        <div className="hero__actions">

          <a
            className="button"
            href="/book"
          >
            Book an appointment
            <ArrowDownRight size={17} />
          </a>

          <span>
            {site.languages}
          </span>

        </div>

        <p className="hero__meta">
          Haircuts · Perms · Straightening · Colour
        </p>

      </div>

      <div
        className="hero__visual reveal reveal--delay"
        aria-label="Gallery preview placeholder"
      >
        <img
          src="/images/hero-placeholder.svg"
          alt="Placeholder for a featured hairstyle result"
        />

        <span className="imageNote">
          Replace with a real client hair result
        </span>
      </div>

    </section>
  )
}