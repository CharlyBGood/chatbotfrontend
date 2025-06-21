// src/hooks/useSegurBot.js
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

export function useSegurBot(config = {}) {
  const widgetRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  // Configuración por defecto  
  const defaultConfig = useMemo(() => ({
    apiUrl: 'http://localhost:8080/api/chat', // 🔴 CAMBIAR por tu API
    position: 'bottom-right',
    initialMessage: '¡Hola! ¿En qué puedo ayudarte?',
    title: 'Asistente Virtual',
    autoOpen: false,
    width: '400px',
    height: '600px',
    enableDebug: false
  }), []);
  const finalConfig = useMemo(() => ({ ...defaultConfig, ...config }), [defaultConfig, config]);

  useEffect(() => {
    let isMounted = true;

    // Función para cargar el script del widget
    const loadWidget = () => {
      return new Promise((resolve, reject) => {
        // Verificar si ya está cargado
        if (window.SegurBotWidget) {
          resolve();
          return;
        }

        // Verificar si ya existe un script cargándose
        const existingScript = document.querySelector('script[data-segurbot-widget]');
        if (existingScript) {
          existingScript.addEventListener('load', resolve);
          existingScript.addEventListener('error', reject);
          return;
        }

        // Cargar script dinámicamente
        const script = document.createElement('script');
        script.src = '/segurbot-widget.js';
        script.setAttribute('data-segurbot-widget', 'true');
        script.onload = resolve;
        script.onerror = () => reject(new Error('Error cargando el script del widget'));
        document.head.appendChild(script);
      });
    };

    loadWidget()
      .then(() => {
        if (!isMounted) return;

        try {
          // Inicializar widget
          widgetRef.current = new window.SegurBotWidget({
            ...finalConfig,
            // Generar un containerId único para evitar conflictos
            containerId: `segurbot-widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          });
          
          widgetRef.current.init();
          setIsLoaded(true);
          setError(null);
        } catch (err) {
          console.error('Error inicializando SegurBot:', err);
          setError(err.message);
        }
      })
      .catch(error => {
        if (!isMounted) return;
        console.error('Error cargando SegurBot:', error);
        setError(error.message);
      });    // Cleanup
    return () => {
      isMounted = false;
      if (widgetRef.current) {
        try {
          widgetRef.current.destroy();
          widgetRef.current = null;
        } catch (err) {
          console.warn('Error durante cleanup:', err);
        }
      }
    };
  }, [finalConfig]); // Usar finalConfig memoizado

  const open = useCallback(() => {
    if (widgetRef.current && isLoaded) {
      widgetRef.current.open();
      setIsOpen(true);
    }
  }, [isLoaded]);

  const close = useCallback(() => {
    if (widgetRef.current && isLoaded) {
      widgetRef.current.close();
      setIsOpen(false);
    }
  }, [isLoaded]);

  const toggle = useCallback(() => {
    if (widgetRef.current && isLoaded) {
      widgetRef.current.toggle();
      setIsOpen(prev => !prev);
    }
  }, [isLoaded]);

  const updateConfig = useCallback((newConfig) => {
    if (widgetRef.current && isLoaded) {
      widgetRef.current.updateConfig(newConfig);
    }
  }, [isLoaded]);

  return {
    isLoaded,
    isOpen,
    error,
    open,
    close,
    toggle,
    updateConfig,
    widget: widgetRef.current
  };
}
