import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../../components/Button/Button';
import ProductCard, { type Product } from '../../components/ProductCard/ProductCard';
import DualCarousel from '../../components/DualCarousel/DualCarousel';
import CarouselSliderPro from '../../components/CarouselSliderPro/CarouselSliderPro';
import VideoCarousel, { type VideoMedia } from '../../components/VideoCarousel/VideoCarousel';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import './Home.css';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase/client';

// We will fetch real data instead of placeholders
// const featuredProducts: Product[] = [...];

import video1 from '../../assets/videos/video1.mp4';
import video2 from '../../assets/videos/video2.mp4';
import video3 from '../../assets/videos/video3.mp4';
import video4 from '../../assets/videos/video4.mp4';

const demoVideos: VideoMedia[] = [
  { id: '1', type: 'video', url: video1, title: 'Novas Formas' },
  { id: '2', type: 'video', url: video2, title: 'Brilho Único' },
  { id: '3', type: 'video', url: video3, title: 'Elegância Prática' },
  { id: '4', type: 'video', url: video4, title: 'Tons Naturais' }
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

  // Product states
  const [novidades, setNovidades] = React.useState<Product[]>([]);
  const [inspiracoes, setInspiracoes] = React.useState<Product[]>([]);
  const [maisVendidos, setMaisVendidos] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    try {
      // We could do 3 separate queries or 1 combined query and filter in JS
      // Doing 1 combined query for active products if your catalog isn't massive
      // But for cleaner code, let's fetch them in parallel if Supabase is fast enough
      // Actually, since we only need featured ones, let's just query everything where at least one flag is true
      const { data, error } = await supabase
        .from('joias')
        .select('id, nome, preco, categoria, imagens_url, destaque_novidade, destaque_inspiracao, destaque_mais_vendido')
        .eq('ativo', true)
        .or('destaque_novidade.eq.true,destaque_inspiracao.eq.true,destaque_mais_vendido.eq.true');

      if (error) throw error;

      if (data) {
        const formatProduct = (item: any): Product => ({
          id: item.id,
          name: item.nome,
          price: item.preco,
          category: item.categoria,
          imageUrl: item.imagens_url && item.imagens_url.length > 0 ? item.imagens_url[0] : undefined
        });

        setNovidades(data.filter(i => i.destaque_novidade).map(formatProduct));
        setInspiracoes(data.filter(i => i.destaque_inspiracao).map(formatProduct));
        setMaisVendidos(data.filter(i => i.destaque_mais_vendido).map(formatProduct));
      }
    } catch (err) {
      console.error("Erro ao buscar produtos destaques:", err);
    } finally {
      setLoading(false);
    }
  };

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
            {novidades.length > 0 ? (
              novidades.map((product) => (
                <div className="carousel-slide" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              !loading && <p style={{ padding: '0 5%', color: 'var(--color-text-light)' }}>Nenhuma novidade encontrada no momento.</p>
            )}
          </div>
        </div>
      </section>

      {/* NEW SECTION: Dual Vertical Infinite Carousel */}
      <section className="infinite-carousel-section" style={{ padding: '2rem 0', backgroundColor: 'var(--color-background)', overflow: 'hidden' }}>
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
        {inspiracoes.length > 0 ? (
          <DualCarousel products={inspiracoes} />
        ) : (
          !loading && <p style={{ textAlign: 'center', color: 'var(--color-text-light)' }}>Nenhuma inspiração encontrada no momento.</p>
        )}
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
        {maisVendidos.length > 0 ? (
          <CarouselSliderPro products={maisVendidos} />
        ) : (
          !loading && <p style={{ textAlign: 'center', color: 'var(--color-text-light)', marginTop: '2rem' }}>Nenhum produto em Mais Vendidos no momento.</p>
        )}
      </section>

      {/* NEW SECTION: Video Carousel (AmbiLight) */}
      <VideoCarousel items={demoVideos} title="A Experiência La Fiore" subtitle="LIFESTYLE" />

      {/* 2. Brand Ethos / About Section */}
      <section className="ethos-section">
        <div className="container">
          <motion.div 
            className="ethos-content"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            style={{ marginBottom: '1rem' }}
          >
            <span className="section-label">Nossa Visão</span>
            <h2 className="ethos-title">Beleza que transcende o tempo, forjada pela natureza e aperfeiçoada pelo homem.</h2>
            <Link to="/about" className="link-with-arrow">
              Conheça nossa história <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 4. Alternate Grid / Lifestyle Section */}
      <section className="lifestyle-section">
        <div className="container">
          <div className="lifestyle-grid">
            <motion.div 
              className="grid-item item-large"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img src="/lifestyle-3.png" alt="Mulher com colar" />
              <div className="grid-overlay">
                <Link to="/catalog">
                  <Button variant="outline" className="white-outline">Ver Coleções</Button>
                </Link>
              </div>
            </motion.div>

            <motion.div 
              className="grid-item item-small item-image"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img src="/lifestyle-1.png" alt="O Cuidado Interno" />
            </motion.div>

            <motion.div 
              className="grid-item item-small item-image"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <img src="/lifestyle-2.png" alt="Escolha das Peças" />
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
