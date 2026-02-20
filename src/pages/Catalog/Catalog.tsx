import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabase/client';
import ProductCard, { type Product } from '../../components/ProductCard/ProductCard';
import './Catalog.css';

const Catalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  useEffect(() => {
    fetchProducts();
  }, [filterCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from('joias')
      .select('id, nome, preco, categoria, imagens_url, ativo')
      .eq('ativo', true);

    if (filterCategory !== 'ALL') {
      query = query.eq('categoria', filterCategory);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
    } else if (data) {
      const formattedProducts: Product[] = data.map((item: any) => ({
        id: item.id,
        name: item.nome,
        price: item.preco,
        category: item.categoria,
        imageUrl: item.imagens_url && item.imagens_url.length > 0 ? item.imagens_url[0] : undefined
      }));
      setProducts(formattedProducts);
    }
    setLoading(false);
  };

  const categories = ['ALL', 'ANEL', 'COLAR', 'PULSEIRA', 'BRINCO'];

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <div className="container">
          <motion.h1 
            className="catalog-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Nosso Acervo
          </motion.h1>
          <motion.p
            className="catalog-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explore nossa coleção atemporal de joias com design exclusivo e artesanato excepcional.
          </motion.p>
        </div>
      </div>

      <div className="catalog-controls container">
        <div className="filter-group">
          <div className="filter-buttons">
            {categories.map((cat) => (
              <button 
                key={cat}
                className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat === 'ALL' ? 'Tudo' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="catalog-grid container">
        {loading ? (
          <div className="loading-state">Carregando coleções...</div>
        ) : products.length > 0 ? (
          products.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))
        ) : (
          <div className="empty-state">
            <p>Nenhuma joia encontrada nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
