import React from 'react';
import ProductCard, { type Product } from '../ProductCard/ProductCard';
import './DualCarousel.css';

interface DualCarouselProps {
  products: Product[];
}

const DualCarousel: React.FC<DualCarouselProps> = ({ products }) => {
  // To ensure the marquee has enough content to scroll seamlessly, 
  // we duplicate the products a few times.
  const duplicatedProducts = [...products, ...products, ...products, ...products];

  return (
    <div className="dual-carousel-wrapper">
      <div className="dual-carousel-vignette top"></div>
      <div className="dual-carousel-vignette bottom"></div>
      
      <div className="dual-carousel-container">
        {/* Left Column - Scrolling Up */}
        <div className="carousel-column column-up">
          <div className="carousel-track track-up">
            {duplicatedProducts.map((product, index) => (
              <div className="carousel-item" key={`up-${product.id}-${index}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Scrolling Down */}
        <div className="carousel-column column-down">
          <div className="carousel-track track-down">
            {duplicatedProducts.map((product, index) => (
              <div className="carousel-item" key={`down-${product.id}-${index}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualCarousel;
