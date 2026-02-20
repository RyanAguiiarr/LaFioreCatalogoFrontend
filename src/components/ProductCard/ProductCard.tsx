import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './ProductCard.css';

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Use a placeholder if no image
  const displayImage = product.imageUrl || 'https://images.unsplash.com/photo-1599643478514-4a884e9c700e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';

  return (
    <motion.div 
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
    >
      <Link to={`/product/${product.id}`} className="product-card-link">
        <div className="product-image-container">
          <img 
            src={displayImage} 
            alt={product.name} 
            className="product-image"
            loading="lazy"
          />
          <div className="product-overlay">
            <span className="view-details-text">Ver Detalhes</span>
          </div>
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category}</p>
          <p className="product-price">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
