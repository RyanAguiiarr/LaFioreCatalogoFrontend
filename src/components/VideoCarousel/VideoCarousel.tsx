import React, { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './VideoCarousel.css';

export interface VideoMedia {
  id: string;
  type: 'video' | 'image';
  url: string;
  title?: string;
}

interface VideoCarouselProps {
  items: VideoMedia[];
  title?: string;
  subtitle?: string;
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ 
  items, 
  title = "Sinta a Joia", 
  subtitle = "EXPERIÊNCIA" 
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
    dragFree: false,
    containScroll: false
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const bgVideoRef = useRef<HTMLVideoElement | null>(null);

  // Sync active slide and handle play/pause
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const current = emblaApi.selectedScrollSnap();
    setSelectedIndex(current);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    // Initial call
    onSelect();
    
    // Subscribe to select event
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Handle Play/Pause logic based on selectedIndex
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === selectedIndex) {
          // Play the active video
          video.currentTime = 0; // Optional: restart every time it comes into view
          video.play().catch(e => console.log("Autoplay prevented:", e));
        } else {
          // Pause inactive videos
          video.pause();
        }
      }
    });
    
    // Sync the background ambilight video
    const activeItem = items[selectedIndex];
    if (bgVideoRef.current && activeItem && activeItem.type === 'video') {
       if (bgVideoRef.current.src !== activeItem.url) {
         bgVideoRef.current.src = activeItem.url;
       }
       bgVideoRef.current.play().catch(e => console.log("Ambilight Autoplay prevented:", e));
    }
  }, [selectedIndex, items]);

  const handleVideoEnd = () => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  };

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const activeItem = items[selectedIndex];

  return (
    <section className="video-carousel-section">
      {/* AMBILIGHT BACKGROUND */}
      <div className="ambilight-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem?.id || 'empty'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ width: '100%', height: '100%' }}
          >
            {activeItem?.type === 'video' ? (
              <video 
                ref={bgVideoRef}
                key={`bg-${activeItem.id}`}
                className="slide-media"
                src={activeItem.url} 
                muted 
                loop 
                playsInline
                autoPlay
              />
            ) : activeItem?.type === 'image' ? (
              <img src={activeItem.url} className="slide-media" alt="glow" />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="video-carousel-content">
        <div className="container carousel-header">
           {subtitle && (
            <motion.span 
              className="section-label" 
              style={{ color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '1rem', letterSpacing: '2px', fontSize: '0.85rem' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {subtitle}
            </motion.span>
           )}
           <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
           >
             {title}
           </motion.h2>
        </div>

        {/* EMBLA WRAPPER - Full Width */}
        <div className="embla-video" ref={emblaRef}>
          <div className="embla__container__video">
            {items.map((item, index) => {
              const isActive = index === selectedIndex;
              
              return (
                <div 
                  className={`embla__slide__video ${isActive ? 'is-active' : ''}`} 
                  key={item.id}
                  onClick={() => {
                    // Clicking an inactive slide brings it to center
                    if (!isActive && emblaApi) {
                      emblaApi.scrollTo(index);
                    }
                  }}
                  style={{ cursor: isActive ? 'default' : 'pointer' }}
                >
                  {item.type === 'video' ? (
                    <video
                      ref={el => { videoRefs.current[index] = el; }}
                      src={item.url}
                      className="slide-media"
                      muted
                      playsInline
                      onEnded={handleVideoEnd}
                    />
                  ) : (
                    <img src={item.url} alt={item.title} className="slide-media" />
                  )}
                  
                  <div className="slide-overlay">
                    {item.title && <h3 className="slide-title">{item.title}</h3>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="video-controls">
          <button aria-label="Previous Video" onClick={scrollPrev}><ChevronLeft size={24} /></button>
          <button aria-label="Next Video" onClick={scrollNext}><ChevronRight size={24} /></button>
        </div>
      </div>
    </section>
  );
};

export default VideoCarousel;
