import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">LA FIORE</Link>
          <p className="footer-desc">
            Artesanato em joias finas, expressando a beleza através de pedras e metais preciosos desde 2026.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Explorar</h4>
          <ul>
            <li><Link to="/catalog">Catálogo</Link></li>
            <li><Link to="/collections">Coleções</Link></li>
            <li><Link to="/new-arrivals">Novidades</Link></li>
            <li><Link to="/best-sellers">Mais Vendidos</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Empresa</h4>
          <ul>
            <li><Link to="/about">Sobre Nós</Link></li>
            <li><Link to="/contact">Contato</Link></li>
            <li><Link to="/careers">Carreiras</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} La Fiore. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
