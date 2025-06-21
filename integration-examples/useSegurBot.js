// hooks/useSegurBot.js
import { useEffect, useRef, useState } from 'react';

export function useSegurBot(config = {}) {
  const widgetRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Función para cargar el script del widget
    const loadWidget = () => {
      return new Promise((resolve, reject) => {
        // Verificar si ya está cargado
        if (window.SegurBotWidget) {
          resolve();
          return;
        }

        // Cargar script dinámicamente
        const script = document.createElement('script');
        script.src = '/segurbot-widget.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    loadWidget()
      .then(() => {
        // Inicializar widget
        widgetRef.current = new window.SegurBotWidget({
          apiUrl: 'https://tu-backend.com/api/chat', // 🔴 CAMBIAR
          autoOpen: false,
          ...config
        });
        
        widgetRef.current.init();
        setIsLoaded(true);
      })
      .catch(error => {
        console.error('Error cargando SegurBot:', error);
      });

    // Cleanup
    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
      }
    };
  }, [config]);

  const open = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
      setIsOpen(true);
    }
  };

  const close = () => {
    if (widgetRef.current) {
      widgetRef.current.close();
      setIsOpen(false);
    }
  };

  const toggle = () => {
    if (widgetRef.current) {
      widgetRef.current.toggle();
      setIsOpen(!isOpen);
    }
  };

  return {
    isLoaded,
    isOpen,
    open,
    close,
    toggle,
    widget: widgetRef.current
  };
}
