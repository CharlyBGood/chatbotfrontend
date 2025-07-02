import { useEffect, useRef, useCallback } from 'react';

export function useInputPositioning(isMobile) {
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);
  const ensureInputVisibility = useCallback(() => {
    if (!isMobile || !inputRef.current || document.activeElement !== inputRef.current) {
      return;
    }

    // Cancelar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Esperar un poco más para asegurar que el layout y el teclado estén listos
    timeoutRef.current = setTimeout(() => {
      requestAnimationFrame(() => {
        if (!inputRef.current) return;

        const inputRect = inputRef.current.getBoundingClientRect();
        const visualViewportHeight = window.visualViewport?.height || window.innerHeight;
        const visualViewportTop = window.visualViewport?.offsetTop || 0;
        const safeMargin = 20; // Margen de seguridad

        // Verificar si el input está completamente visible en el visual viewport
        const inputBottom = inputRect.bottom;
        const visibleAreaBottom = visualViewportTop + visualViewportHeight;
        const isInputFullyVisible = (
          inputRect.top >= visualViewportTop && 
          inputBottom <= visibleAreaBottom - safeMargin
        );

        if (!isInputFullyVisible) {
          // Calcular cuánto necesitamos desplazar para que el input sea visible
          const distanceToBottom = inputBottom - (visibleAreaBottom - safeMargin);
          if (distanceToBottom > 0) {
            // El input está parcialmente fuera de la vista, hacer scroll mínimo
            const chatContainer = inputRef.current.closest('.mobile-chat-container');
            if (chatContainer) {
              const chatWindow = chatContainer.querySelector('.mobile-chat-window');
              if (chatWindow) {
                // Esperar un frame extra para asegurar layout
                requestAnimationFrame(() => {
                  chatWindow.scrollBy({
                    top: distanceToBottom,
                    behavior: 'smooth'
                  });
                });
              }
            }
          }

          // Como fallback más suave, usar scrollIntoView con opciones precisas
          setTimeout(() => {
            if (inputRef.current && document.activeElement === inputRef.current) {
              inputRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest'
              });
            }
          }, 150); // Esperar un poco más
        }
      });
    }, 200); // Esperar más para asegurar que el teclado esté visible
  }, [isMobile]);

  const handleFocus = useCallback(() => {
    if (isMobile) {
      // Delay para permitir que el teclado aparezca
      setTimeout(ensureInputVisibility, 300);
    }
  }, [isMobile, ensureInputVisibility]);

  const handleInput = useCallback(() => {
    if (isMobile) {
      ensureInputVisibility();
    }
  }, [isMobile, ensureInputVisibility]);

  const handleViewportChange = useCallback(() => {
    if (isMobile) {
      ensureInputVisibility();
    }
  }, [isMobile, ensureInputVisibility]);

  useEffect(() => {
    if (!isMobile) return;

    const input = inputRef.current;
    if (!input) return;

    // Event listeners
    input.addEventListener('focus', handleFocus);
    input.addEventListener('input', handleInput);
    window.addEventListener('resize', handleViewportChange);
    window.visualViewport?.addEventListener('resize', handleViewportChange);
    window.visualViewport?.addEventListener('scroll', handleViewportChange);

    return () => {
      // Cleanup
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('input', handleInput);
      window.removeEventListener('resize', handleViewportChange);
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
      window.visualViewport?.removeEventListener('scroll', handleViewportChange);
    };
  }, [isMobile, handleFocus, handleInput, handleViewportChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    inputRef,
    ensureInputVisibility
  };
}
