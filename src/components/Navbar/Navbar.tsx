import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on navigate
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          <div className="navbar-links desktop-only">
            <Link to="/catalog">Catálogo</Link>
            <Link to="/about">Sobre</Link>
            <Link to="/collections">Coleções</Link>
          </div>

          <Link to="/" className="navbar-logo">
            <span className="logo-text">LA FIORE</span>
          </Link>

          <div className="navbar-actions">
            <button aria-label="Search"><Search size={20} /></button>
            <Link to="/admin" aria-label="Admin/Login"><User size={20} /></Link>
            <button aria-label="Cart" className="cart-btn">
              <ShoppingBag size={20} />
              <span className="cart-count">0</span>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              className="mobile-menu"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="close-menu-btn" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
              
              <div className="mobile-links">
                <Link to="/">Início</Link>
                <Link to="/catalog">Catálogo</Link>
                <Link to="/collections">Coleções</Link>
                <Link to="/about">Nossa História</Link>
                <Link to="/admin">Área Admin</Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
