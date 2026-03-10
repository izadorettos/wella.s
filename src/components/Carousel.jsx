import { useState, useEffect } from 'react';

export const ProductCarousel = ({ items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="premium-carousel">
            <div className="carousel-inner" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {items.map((item, index) => (
                    <div key={index} className="carousel-item">
                        <div className="carousel-offer-badge">OFERTA IMPERDÍVEL</div>
                        <img src={item.image} alt={item.title} className="carousel-img" />
                        <div className="carousel-info">
                            <h4>{item.title}</h4>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="carousel-controls">
                <button onClick={prevSlide} className="carousel-nav">‹</button>
                <div className="carousel-dots">
                    {items.map((_, index) => (
                        <div
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        ></div>
                    ))}
                </div>
                <button onClick={nextSlide} className="carousel-nav">›</button>
            </div>
        </div>
    );
};
