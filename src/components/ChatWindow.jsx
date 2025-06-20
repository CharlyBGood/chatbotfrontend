import { useRef, useEffect, useState, useCallback } from 'react';
import { ChatMessage } from './ChatMessage';
import TypingIndicator from './TypingIndicator';

export function ChatWindow({ messages, availableHeight, isKeyboardOpen, scrollContainerRef, isTyping }) {
  const messagesEndRef = useRef(null);
  const containerRef = scrollContainerRef; // Use the scroll container ref from parent
  const scrollTimeoutRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  // Auto-scroll a los nuevos mensajes con timing mejorado
  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current && !isUserScrolling) {
      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      };

      // Dar tiempo para que el DOM se actualice
      requestAnimationFrame(() => {
        setTimeout(scrollToBottom, 50);
      });
    }
  }, [messages, shouldAutoScroll, isUserScrolling, isTyping]); // Incluir isTyping

  // Manejar scroll cuando el teclado se abre/cierra con mejor timing
  useEffect(() => {
    if (isKeyboardOpen && messagesEndRef.current && shouldAutoScroll) {
      // Dar tiempo para que el layout se ajuste antes de hacer scroll
      setTimeout(() => {
        requestAnimationFrame(() => {
          messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
          });
        });
      }, 200); // Tiempo suficiente para que el teclado termine de aparecer
    }  }, [isKeyboardOpen, shouldAutoScroll]);

  // Detectar si el usuario está scrolleando manualmente con debouncing
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setIsUserScrolling(true);

      // Limpiar timeout anterior
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Detectar si está cerca del final
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + 50; // 50px de tolerancia

      setShouldAutoScroll(isNearBottom);

      // Dejar de considerar que el usuario está scrolleando después de un tiempo
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 1000);
    }
  }, [containerRef]);  // Adjuntar el event listener al contenedor de scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, containerRef]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);const dynamicStyle = availableHeight ? {
    height: `${availableHeight}px`,
    maxHeight: `${availableHeight}px`,
    minHeight: '120px', // Altura mínima para evitar problemas
    // Removed overflow properties - now handled by parent container
  } : {
    // Removed overflow properties - now handled by parent container
  }; return (<main
    className="w-full flex flex-col bg-bgDarkBlue p-2 sm:p-4 space-y-2 sm:space-y-4 mobile-chat-window"
    style={dynamicStyle}
  >
    {/* Espaciador para asegurar que el primer mensaje (inicial) siempre sea visible */}
    <div className="flex-shrink-0 h-2" />
    {messages.map((message, index) => (
      <div key={index} className="flex-shrink-0">
        <ChatMessage
          message={message.content}
          isBot={message.isBot}
        />
      </div>
    ))}

    {/* Mostrar typing indicator cuando el bot está escribiendo */}
    {isTyping && (
      <div className="flex-shrink-0">
        <TypingIndicator />
      </div>
    )}

    {/* Espaciador final para scroll */}
    <div ref={messagesEndRef} className="flex-shrink-0 h-2" />

    {/* Botón para volver al final si no está en auto-scroll */}
    {!shouldAutoScroll && messages.length > 1 && (
      <button
        onClick={() => {
          setShouldAutoScroll(true);
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="fixed bottom-20 right-4 bg-lightBlue hover:bg-lightBlueHover text-blueGray p-2 rounded-full shadow-lg z-10 transition-all duration-200"
        aria-label="Ir al final del chat"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7" />
        </svg>
      </button>
    )}
  </main>
  );
}