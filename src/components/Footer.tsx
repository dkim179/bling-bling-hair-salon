export default function Footer() {
  return (
    <footer className="footer">

      <div className="brand brand--footer">
        <span>BLING BLING</span>
        <small>HAIR SALON</small>
      </div>

      <div>
        <p>St. Catharines, Ontario</p>
        <p>English & Korean</p>
      </div>

      <div>
        <p>Monday–Saturday</p>
        <p>9 AM–4 PM</p>

        <a
          className="footerBook"
          href="/book"
        >
          Book
        </a>
      </div>

      <div className="footer__bottom">
        <span>
          © 2026 Bling Bling Hair Salon
        </span>

        <span>
          Website by Daniel Kim
        </span>
      </div>

    </footer>
  )
}