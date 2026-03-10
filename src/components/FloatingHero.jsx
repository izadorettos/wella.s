import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    })

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth })
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return windowSize
}

export const FloatingHero = () => {
    const { width } = useWindowSize()
    const isMobile = width < 600
    const isTablet = width >= 600 && width < 1024

    const products = [
        {
            src: '/product-shampoo.png',
            alt: 'Invigo Nutri-Enrich Shampoo',
            label: 'SHAMPOO 1L',
            delay: 0,
            x: isMobile ? -85 : isTablet ? -180 : -350,
            size: isMobile ? 120 : isTablet ? 220 : 320,
            rotate: -8,
            zIndex: 2
        },
        {
            src: '/product-mask.png',
            alt: 'Invigo Nutri-Enrich Máscara',
            label: 'MÁSCARA 500ML',
            delay: 0.15,
            x: isMobile ? 0 : isTablet ? -50 : -86,
            size: isMobile ? 80 : isTablet ? 120 : 160,
            rotate: 4,
            zIndex: 3
        },
        {
            src: '/product-oil.png',
            alt: 'Oil Reflections',
            label: 'OIL REFLECTIONS',
            delay: 0.3,
            x: isMobile ? 85 : isTablet ? 80 : 180,
            size: isMobile ? 60 : isTablet ? 100 : 140,
            rotate: -4,
            zIndex: 2
        }
    ]

    const floatVariants = (delay = 0) => ({
        animate: {
            y: [0, -18, 0, -10, 0],
            rotate: [0, 1.5, 0, -1.5, 0],
            transition: {
                duration: 5.5 + delay * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay,
                times: [0, 0.25, 0.5, 0.75, 1]
            }
        }
    })

    return (
        <div className="floating-hero">
            {/* Background glow circles */}
            <motion.div
                className="hero-glow hero-glow-1"
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.65, 0.4] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="hero-glow hero-glow-2"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            {/* Floating product images */}
            <div className="hero-products-row">
                {products.map((p, i) => (
                    <motion.div
                        key={i}
                        className="hero-product-item"
                        style={{ zIndex: p.zIndex }}
                        initial={{ opacity: 0, y: 60, x: p.x, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, x: p.x, scale: 1 }}
                        transition={{
                            duration: 0.9,
                            delay: p.delay + 0.2,
                            ease: [0.2, 0.8, 0.2, 1]
                        }}
                    >
                        <motion.div
                            variants={floatVariants(p.delay)}
                            animate="animate"
                        >
                            <motion.img
                                src={p.src}
                                alt={p.alt}
                                style={{ width: p.size, maxWidth: '100%' }}
                                whileHover={{
                                    scale: 1.1,
                                    rotate: 0,
                                    filter: 'drop-shadow(0 30px 40px rgba(218, 41, 28, 0.2))',
                                    transition: { duration: 0.35, ease: 'easeOut' }
                                }}
                                className="hero-product-img"
                            />
                        </motion.div>
                        <motion.span
                            className="hero-product-label"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: p.delay + 0.6 }}
                        >
                            {p.label}
                        </motion.span>
                    </motion.div>
                ))}
            </div>

            {/* Decorative particles */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={`p-${i}`}
                    className="hero-particle"
                    style={{
                        left: `${10 + i * 11}%`,
                        top: `${20 + (i % 3) * 20}%`,
                        width: 4 + (i % 3) * 3,
                        height: 4 + (i % 3) * 3,
                        animationDelay: `${i * 0.4}s`
                    }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.3, 1]
                    }}
                    transition={{
                        duration: 3 + i * 0.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.3
                    }}
                />
            ))}
        </div>
    )
}
