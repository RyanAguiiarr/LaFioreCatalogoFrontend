import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Can also be 'smooth' if desired, but 'instant' feels more native for page loads.
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
