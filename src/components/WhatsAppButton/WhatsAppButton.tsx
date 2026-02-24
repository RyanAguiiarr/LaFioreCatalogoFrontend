import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import './WhatsAppButton.css';

const WhatsAppButton: React.FC = () => {
  // Replace this placeholder number with the actual store's WhatsApp number
  const whatsappNumber = '5511999999999'; 
  const message = encodeURIComponent('Olá! Gostaria de saber mais sobre as joias da La Fiore.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float-btn"
      aria-label="Fale conosco no WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 260, 
        damping: 20, 
        delay: 1 
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <MessageCircle size={32} />
    </motion.a>
  );
};

export default WhatsAppButton;
