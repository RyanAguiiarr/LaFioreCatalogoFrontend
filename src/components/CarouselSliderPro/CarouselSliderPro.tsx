import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CarouselSliderPro.css';
import type { Product } from '../ProductCard/ProductCard';

interface CarouselSliderProProps {
  products: Product[];
}

export const CarouselSliderPro: React.FC<CarouselSliderProProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="carousel-pro-container">
      <div className="carousel-pro-controls">
        <button onClick={prevSlide} className="carousel-pro-btn" aria-label="Anterior">
          <ChevronLeft size={20} color="var(--color-deep-olive)" />
        </button>
        <button onClick={nextSlide} className="carousel-pro-btn" aria-label="Próximo">
          <ChevronRight size={20} color="var(--color-deep-olive)" />
        </button>
      </div>

      <div className="carousel-pro-track">
        <AnimatePresence initial={false}>
          {products.map((product, i) => {
            let distance = i - currentIndex;
            
            // Adjust for wrap-around to make it infinite
            if (distance < -Math.floor(products.length / 2)) {
              distance += products.length;
            }
            if (distance > Math.floor(products.length / 2)) {
              distance -= products.length;
            }

            // Only render items that are close to the center to improve performance
            if (Math.abs(distance) > 2) {
              return null;
            }

            const isCenter = distance === 0;
            // The magic numbers to match the image:
            // Center is scale 1, x: 0
            // Sides are scale 0.8, x: +/- 75%
            const xOffset = distance * 75; // percentage
            const scale = isCenter ? 1 : 0.8;
            const zIndex = isCenter ? 10 : 10 - Math.abs(distance);
            const opacity = isCenter ? 1 : Math.max(0, 1 - Math.abs(distance) * 0.4);

            return (
              <motion.div
                key={product.id}
                className="carousel-pro-card"
                initial={false}
                animate={{
                  x: `${xOffset}%`,
                  scale: scale,
                  zIndex: zIndex,
                  opacity: opacity,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  left: 0,
                  top: 0
                }}
              >
                <div className="carousel-pro-image-wrapper">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="carousel-pro-image"
                  />
                  {!isCenter && <div className="carousel-pro-overlay"></div>}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CarouselSliderPro;
