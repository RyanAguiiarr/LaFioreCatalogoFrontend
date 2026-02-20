import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../../components/Button/Button';
import ProductCard, { type Product } from '../../components/ProductCard/ProductCard';
import DualCarousel from '../../components/DualCarousel/DualCarousel';
import CarouselSliderPro from '../../components/CarouselSliderPro/CarouselSliderPro';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import './Home.css';
import { Link } from 'react-router-dom';

// Placeholder data based on the requested aesthetic
const featuredProducts: Product[] = [
  { id: '1', name: 'Product 1', price: 1250.00, category: 'Category', imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '2', name: 'Product 2', price: 3400.00, category: 'Category', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '3', name: 'Product 3', price: 980.00, category: 'Category', imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '4', name: 'Product 4', price: 2100.00, category: 'Category', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: '5', name: 'Product 5', price: 5600.00, category: 'Category', imageUrl: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
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
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
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

      {/* NEW SECTION: Mais Vendidos (Carousel Slider Pro) */}
      <section className="best-sellers-section" style={{ padding: '6rem 0', backgroundColor: 'var(--color-background)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.span 
            className="section-label" 
            style={{ display: 'block', marginBottom: '1rem', color: 'var(--color-text-light)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Nossa Seleção
          </motion.span>
          <motion.h2 
            style={{ fontSize: '2.5rem', color: 'var(--color-deep-olive)', fontFamily: 'var(--font-heading)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Mais Vendidos
          </motion.h2>
        </div>
        
        <CarouselSliderPro products={featuredProducts} />
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
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Lifestyle" />
            <div className="grid-overlay">
              <h3>Teste Imagem Grande</h3>
              <Button variant="outline" className="white-outline">Ver Detalhes</Button>
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
              <h3>Teste Imagem</h3>
              <p>Texto de teste explicativo.</p>
              <Link to="/catalog" className="link-with-arrow">
                Acessar <ArrowRight size={18} />
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
            <img src="https://images.unsplash.com/photo-1512413913426-3023b7e41ac8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Detail" />
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
