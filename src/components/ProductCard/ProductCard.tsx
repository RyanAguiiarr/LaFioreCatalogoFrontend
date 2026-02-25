import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
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
  const displayImage = product.imageUrl || 'https://images.unsplash.com/photo-1599643478514-4a884e9c700e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';

  const formattedPrice = new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    maximumFractionDigits: 0 
  }).format(product.price);

  return (
    <motion.div 
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
    >
      <Link to={`/product/${product.id}`} className="product-card-link">
        
        <div className="modern-image-wrapper">
          <div className="modern-image-box">
            <img 
              src={displayImage} 
              alt={product.name} 
              loading="lazy"
            />
            <div className="modern-price-tag">
              {formattedPrice}
            </div>
          </div>
          <div className="modern-delivery-banner">
            Frete Grátis para todo Brasil
          </div>
        </div>
        
        <div className="modern-info-box">
          <div className="modern-title-row">
            <h3 className="modern-product-name" title={product.name}>{product.name}</h3>
            <span className="modern-order-link">Detalhes <ArrowUpRight size={16} /></span>
          </div>
          <div className="modern-tags-row">
            <span className="modern-tag">{product.category}</span>
            <span className="modern-tag">Ouro 18k</span>
          </div>
        </div>

      </Link>
    </motion.div>
  );
};

export default ProductCard;
