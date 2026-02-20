import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../../components/Button/Button';
import ProductCard, { type Product } from '../../components/ProductCard/ProductCard';
import DualCarousel from '../../components/DualCarousel/DualCarousel';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import './Home.css';
import { Link } from 'react-router-dom';

// Placeholder data based on the requested aesthetic
const featuredProducts: Product[] = [
  { id: '1', name: 'Colar Lumina', price: 1250.00, category: 'Colar', imageUrl: 'https://images.unsplash.com/photo-1599643478514-4a884e9c700e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '2', name: 'Anel Éternité', price: 3400.00, category: 'Anel', imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f66150ce8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '3', name: 'Brincos Gota d\'Or', price: 980.00, category: 'Brinco', imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '4', name: 'Pulseira Oásis', price: 2100.00, category: 'Pulseira', imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '5', name: 'Anel Solitário', price: 5600.00, category: 'Anel', imageUrl: 'https://images.unsplash.com/photo-1622398925373-3f15ebbfedc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
];

const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax effect for hero
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Embla Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start',
    skipSnaps: false,
    dragFree: true
  });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="home" ref={containerRef}>
      
      {/* 1. Hero Section with Parallax */}
      <section className="hero-section">
        <motion.div 
          className="hero-background"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <img 
            src="https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="La Fiore Campaign" 
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </motion.div>

        <div className="hero-content container">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-title"
          >
            A Essência da<br/>
            Elegância
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-subtitle"
          >
            Descubra as joias que capturam a luz da sua alma. Artesanato em pedras preciosas.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/catalog">
              <Button variant="primary">Explorar Coleção</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Brand Ethos / About Section */}
      <section className="ethos-section container">
        <motion.div 
          className="ethos-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">Nossa Visão</span>
          <h2 className="ethos-title">Beleza que transcende o tempo, forjada pela natureza e aperfeiçoada pelo homem.</h2>
          <Link to="/about" className="link-with-arrow">
            Conheça nossa história <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* 3. Featured Carousel Area */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Novidades
            </motion.h2>
            <div className="carousel-controls">
              <button aria-label="Previous" onClick={scrollPrev}><ChevronLeft size={24} /></button>
              <button aria-label="Next" onClick={scrollNext}><ChevronRight size={24} /></button>
            </div>
          </div>
        </div>

        <div className="carousel-wrapper" ref={emblaRef}>
          <div className="carousel-container">
            {featuredProducts.map((product) => (
              <div className="carousel-slide" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION: Dual Vertical Infinite Carousel */}
      <section className="infinite-carousel-section" style={{ padding: '8rem 0', backgroundColor: 'var(--color-background)', overflow: 'hidden' }}>
        <div className="container" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <motion.span 
            className="section-label" 
            style={{ display: 'block', marginBottom: '1rem', color: 'var(--color-text-light)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Os Mais Desejados
          </motion.span>
          <motion.h2 
            style={{ fontSize: '2.5rem', color: 'var(--color-deep-olive)', fontFamily: 'var(--font-heading)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Inspiração Infinita
          </motion.h2>
        </div>
        
        {/* The Dual Vertical Component */}
        <DualCarousel products={featuredProducts} />
      </section>

      {/* 4. Alternate Grid / Lifestyle Section */}
      <section className="lifestyle-section container">
        <div className="lifestyle-grid">
          <motion.div 
            className="grid-item item-large"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Lifestyle" />
            <div className="grid-overlay">
              <h3>Coleção Noivas</h3>
              <Button variant="outline" className="white-outline">Ver Coleção</Button>
            </div>
          </motion.div>

          <motion.div 
            className="grid-item item-small"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-card bg-sage">
              <h3>O Presente Perfeito</h3>
              <p>Curadoria de especialistas para momentos inesquecíveis.</p>
              <Link to="/catalog" className="link-with-arrow">
                Guia de Presentes <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            className="grid-item item-small item-image"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <img src="https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Detail" />
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
