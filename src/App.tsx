import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import About from "./components/About";
import Services from "./components/Services";
import Experience from "./components/Experience";
import Gallery from "./components/Gallery";
import Why from "./components/Why";
import Bilingual from "./components/Bilingual";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import StickyBooking from "./components/StickyBooking";
import BookPage from "./components/BookPage";

import AdminLoginPage from "./admin/AdminLoginPage";
import AdminPage from "./admin/AdminPage";

import { site } from "./data/site";

export default function App() {
  const path = window.location.pathname;

  if (path === "/book" || path === "/book/") {
    return <BookPage />;
  }

  if (path === "/admin/login" || path === "/admin/login/") {
    return <AdminLoginPage />;
  }

  if (path === "/admin" || path === "/admin/") {
    return <AdminPage />;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: site.businessName,
    areaServed: `${site.city}, ${site.province}`,
    telephone: site.phoneHref,
    openingHours: ["Mo-Sa 09:00-16:00"],
    availableLanguage: ["English", "Korean"],
    description:
      "Private hair salon in St. Catharines offering haircuts, perms, straightening and colour with over 20 years of experience.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <Navbar />

      <main>
        <Hero />
        <TrustBar />
        <About />
        <Services />
        <Experience />
        <Gallery />
        <Why />
        <Bilingual />
        <Contact />
      </main>

      <Footer />

      <StickyBooking />
    </>
  );
}
