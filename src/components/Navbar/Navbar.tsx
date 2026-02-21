import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabase/client';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and search on navigate
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, [location.pathname]);

  // Handle search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('joias')
        .select('id, nome, preco, imagens_url')
        .eq('ativo', true)
        .ilike('nome', `%${query}%`)
        .limit(5);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (err) {
      console.error('Erro na busca:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchResultClick = (id: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/product/${id}`);
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className={`navbar-container ${isSearchOpen ? 'search-active' : ''}`}>
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
            <div className={`search-container ${isSearchOpen ? 'open' : ''}`}>
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'var(--search-width, 250px)', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="search-input-wrapper"
                  >
                    <input
                      type="text"
                      placeholder="Buscar joias..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <button className="close-search" onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}>
                      <X size={16} />
                    </button>

                    {/* Search Results Dropdown */}
                    {searchQuery.length >= 2 && (
                      <div className="search-results-dropdown">
                        {isSearching ? (
                          <div className="search-status">Buscando...</div>
                        ) : searchResults.length > 0 ? (
                          <div className="search-results-list">
                            {searchResults.map((result) => (
                              <div 
                                key={result.id} 
                                className="search-result-item"
                                onClick={() => handleSearchResultClick(result.id)}
                              >
                                {result.imagens_url && result.imagens_url.length > 0 ? (
                                  <img src={result.imagens_url[0]} alt={result.nome} />
                                ) : (
                                  <div className="search-result-no-image"></div>
                                )}
                                <div className="search-result-info">
                                  <span className="search-result-name">{result.nome}</span>
                                  <span className="search-result-price">R$ {result.preco.toFixed(2)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="search-status">Nenhuma joia encontrada.</div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              <button 
                aria-label="Search" 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                style={{ display: isSearchOpen ? 'none' : 'flex' }}
              >
                <Search size={20} />
              </button>
            </div>
            
            <Link to="/admin" aria-label="Admin/Login"><User size={20} /></Link>
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
