import { galleryItems } from '../data/site'

export default function Gallery() {
  return (
    <section className="section gallery" id="work">
      <div className="sectionHead sectionHead--row"><div><p className="eyebrow">OUR WORK</p><h2>Cuts, colour,<br/><em>texture & transformations.</em></h2></div><p className="muted">Use only real work photos once available. Client permission recommended if faces are identifiable.</p></div>
      <div className="galleryGrid">
        {galleryItems.map((item, i) => <figure className={`galleryItem galleryItem--${i+1}`} key={item.src}><img src={item.src} alt={item.alt}/><figcaption>{item.category}</figcaption></figure>)}
      </div>
    </section>
  )
}
