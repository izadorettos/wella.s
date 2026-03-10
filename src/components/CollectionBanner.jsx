import { useState, useEffect } from 'react'

const slides = [
    {
        src: '/banner-1.jpg',
        alt: 'Wella Professionals — Coleção'
    },
    {
        src: '/banner-3.jpg',
        alt: 'Wella Professionals — Ultimate Repair'
    }
]

export const CollectionBanner = () => {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % slides.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [])

    const goTo = (idx) => setCurrent(idx)
    const prev = () => setCurrent(p => (p - 1 + slides.length) % slides.length)
    const next = () => setCurrent(p => (p + 1) % slides.length)

    return (
        <div className="collection-banner">
            <div
                className="collection-track"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {slides.map((slide, i) => (
                    <div key={i} className="collection-slide">
                        <img src={slide.src} alt={slide.alt} className="collection-img" />
                    </div>
                ))}
            </div>

            <button className="cbn-arrow cbn-prev" onClick={prev} aria-label="Anterior">‹</button>
            <button className="cbn-arrow cbn-next" onClick={next} aria-label="Próximo">›</button>

            <div className="cbn-dots">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        className={`cbn-dot${i === current ? ' active' : ''}`}
                        onClick={() => goTo(i)}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
