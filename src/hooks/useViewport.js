import { useState, useEffect, useRef } from 'react';

export function useViewport() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    visualViewportHeight: window.visualViewport?.height || window.innerHeight,
    isKeyboardOpen: false
  });

  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      const newHeight = window.innerHeight;
      const visualHeight = window.visualViewport?.height || newHeight;
      const keyboardOpen = Math.abs(newHeight - visualHeight) > 150; // Threshold para detectar teclado

      setDimensions({
        width: window.innerWidth,
        height: newHeight,
        visualViewportHeight: visualHeight,
        isKeyboardOpen: keyboardOpen
      });

      // Prevenir scroll del body cuando el teclado está abierto
      if (keyboardOpen && window.innerWidth < 768) {
        document.body.style.position = 'fixed';
        document.body.style.top = '0';
        document.body.style.left = '0';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';
      } else if (!keyboardOpen && window.innerWidth < 768) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.overflow = '';
      }
    };

    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    const updateFooterHeight = () => {
      if (footerRef.current) {
        setFooterHeight(footerRef.current.offsetHeight);
      }
    };

    // Event listeners
    window.addEventListener('resize', updateDimensions);
    window.visualViewport?.addEventListener('resize', updateDimensions);
    
    // ResizeObserver para medir elementos
    const resizeObserver = new ResizeObserver(() => {
      updateHeaderHeight();
      updateFooterHeight();
    });

    if (headerRef.current) resizeObserver.observe(headerRef.current);
    if (footerRef.current) resizeObserver.observe(footerRef.current);

    // Inicial measurement
    updateDimensions();
    updateHeaderHeight();
    updateFooterHeight();

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.visualViewport?.removeEventListener('resize', updateDimensions);
      resizeObserver.disconnect();
      
      // Limpiar estilos del body al desmontar
      if (window.innerWidth < 768) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.overflow = '';
      }
    };
  }, []);

  // Calcular altura disponible para el área de chat
  const availableHeight = dimensions.visualViewportHeight - headerHeight - footerHeight;

  return {
    ...dimensions,
    headerRef,
    footerRef,
    headerHeight,
    footerHeight,
    availableHeight: Math.max(120, availableHeight), // Mínimo 120px
    isMobile: dimensions.width < 768
  };
}
