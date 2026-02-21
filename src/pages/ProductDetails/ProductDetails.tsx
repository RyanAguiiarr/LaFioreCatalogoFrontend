import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../supabase/client';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import Button from '../../components/Button/Button';
import './ProductDetails.css';

interface Variant {
  id: string;
  dimensao: string;
  estoque: number;
  preco_variante: number | null;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Embla setup for main images
  const [mainViewportRef, emblaMainApi] = useEmblaCarousel({ loop: true });
  // Embla setup for thumbnails
  const [thumbViewportRef, emblaThumbApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on('select', onSelect);
    emblaMainApi.on('reInit', onSelect);
  }, [emblaMainApi, onSelect]);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    if (!id) return;
    setLoading(true);
    
    // Fetch product
    const { data: productData, error: productError } = await supabase
      .from('joias')
      .select('*')
      .eq('id', id)
      .single();

    if (productError) {
      console.error(productError);
      setLoading(false);
      return;
    }

    if (!productData || !productData.ativo) {
      setLoading(false);
      return; // Will leave product as null, triggering the error render below
    }

    setProduct(productData);

    // Fetch variants
    const { data: variantsData, error: variantsError } = await supabase
      .from('variantes')
      .select('id, dimensao, estoque, preco_variante')
      .eq('joia_id', id);

    if (!variantsError && variantsData) {
      setVariants(variantsData);
      if (variantsData.length > 0) {
        setSelectedVariantId(variantsData[0].id);
      }
    }
    setLoading(false);
  };

  if (loading) return <div className="loading-container">Carregando detalhes...</div>;
  if (!product) return (
    <div className="error-container" style={{ padding: '150px 0', textAlign: 'center' }}>
      <h2>Produto Indisponível</h2>
      <p style={{ color: 'var(--color-text-light)', marginTop: '1rem', marginBottom: '2rem' }}>Desculpe, esta joia não está disponível no momento.</p>
      <Link to="/catalog">
        <Button variant="outline">Voltar ao Catálogo</Button>
      </Link>
    </div>
  );

  const images = product.imagens_url && product.imagens_url.length > 0 
    ? product.imagens_url 
    : ['https://images.unsplash.com/photo-1599643478514-4a884e9c700e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']; // Fallback

  const selectedVariantData = variants.find(v => v.id === selectedVariantId);
  const displayPrice = selectedVariantData && selectedVariantData.preco_variante !== null
    ? selectedVariantData.preco_variante 
    : product.preco;

  return (
    <div className="product-details-page">
      <div className="container">
        <Link to="/catalog" className="back-link">
          <ArrowLeft size={16} /> Voltar ao Catálogo
        </Link>
        
        <div className="product-details-grid">
          {/* Left Column: Image Gallery */}
          <div className="product-gallery">
            <div className="embla" ref={mainViewportRef}>
              <div className="embla__container">
                {images.map((img: string, index: number) => (
                  <div className="embla__slide" key={index}>
                    <img src={img} alt={`${product.nome} ${index + 1}`} className="slide-img" />
                  </div>
                ))}
              </div>
              {images.length > 1 && (
                <>
                  <button className="gallery-nav prev" onClick={() => emblaMainApi?.scrollPrev()}><ChevronLeft /></button>
                  <button className="gallery-nav next" onClick={() => emblaMainApi?.scrollNext()}><ChevronRight /></button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="embla-thumbs" ref={thumbViewportRef}>
                <div className="embla-thumbs__container">
                  {images.map((img: string, index: number) => (
                    <div 
                      className={`embla-thumbs__slide ${index === selectedIndex ? 'is-selected' : ''}`}
                      key={index}
                      onClick={() => onThumbClick(index)}
                    >
                      <img src={img} alt={`Thumbnail ${index + 1}`} className="thumb-img" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Product Info */}
          <motion.div 
            className="product-info-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="product-meta">{product.categoria}</p>
            <h1 className="product-title">{product.nome}</h1>
            <motion.p 
              className="product-price-large"
              key={displayPrice} // Using key forces a small rerender animation when value changes
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayPrice)}
            </motion.p>

            <div className="product-description">
              <p>{product.descricao || "Uma joia com design exclusivo, trabalhada para refletir elegância em cada detalhe."}</p>
            </div>

            {/* Variants Selector */}
            {variants.length > 0 && (
              <div className="product-variants">
                <span className="variant-label">Selecione o Tamanho/Dimensão:</span>
                <div className="variant-options">
                  {variants.map(variant => (
                    <button 
                      key={variant.id}
                      className={`variant-btn ${selectedVariantId === variant.id ? 'active' : ''} ${variant.estoque === 0 ? 'out-of-stock' : ''}`}
                      onClick={() => variant.estoque > 0 && setSelectedVariantId(variant.id)}
                      disabled={variant.estoque === 0}
                    >
                      {variant.dimensao}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="product-actions">
              <Button 
                isFullWidth={true} 
                variant="primary" 
                onClick={() => {
                  const message = `Olá! Tenho interesse na joia: ${product.nome}. ${selectedVariantData ? `Gostaria do tamanho/aro: ${selectedVariantData.dimensao}.` : ''} Pode me ajudar?`;
                  window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank');
                }}
              >
                Comprar pelo WhatsApp
              </Button>
              <div className="product-features">
                <span>✦ Ouro/Prata Certificados</span>
                <span>✦ Garantia Vitalícia</span>
                <span>✦ Atendimento Exclusivo</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
