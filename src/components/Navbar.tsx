import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
    }

    onScroll()

    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
    >

      <a
        className="brand"
        href="/#top"
        aria-label="Bling Bling Hair Salon home"
      >
        <span>BLING BLING</span>
        <small>HAIR SALON</small>
      </a>

      <nav
        className="navlinks"
        aria-label="Main navigation"
      >
        <a href="/#about">About</a>

        <a href="/#services">Services</a>

        <a href="/#work">Gallery</a>

        <a href="/#contact">Contact</a>

        <a
          className="button button--small"
          href="/book"
        >
          Book
        </a>
      </nav>

      <button
        className="menuButton"
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? (
          <X size={22} />
        ) : (
          <Menu size={22} />
        )}
      </button>

      {open && (
        <div className="mobileMenu">

          <a
            href="/#about"
            onClick={() => setOpen(false)}
          >
            About
          </a>

          <a
            href="/#services"
            onClick={() => setOpen(false)}
          >
            Services
          </a>

          <a
            href="/#work"
            onClick={() => setOpen(false)}
          >
            Gallery
          </a>

          <a
            href="/#contact"
            onClick={() => setOpen(false)}
          >
            Contact
          </a>

          <a
            className="button button--small"
            href="/book"
            onClick={() => setOpen(false)}
          >
            Book
          </a>

        </div>
      )}

    </header>
  )
}