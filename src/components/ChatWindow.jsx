import { useRef, useEffect, useState, useCallback } from 'react';
import { ChatMessage } from './ChatMessage';
import TypingIndicator from './TypingIndicator';

export function ChatWindow({ messages, availableHeight, isKeyboardOpen, scrollContainerRef, isTyping, showInitialTyping = false, typingMessageId, onTypingComplete, onSendMessage }) {
  const messagesEndRef = useRef(null);
  const containerRef = scrollContainerRef; // Use the scroll container ref from parent
  const scrollTimeoutRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false); // Para el indicador dorado
  // Exponer función de scroll forzado para debugging y uso externo
  useEffect(() => {
    window.scrollToBottom = () => {
      if (messagesEndRef.current) {
        setShouldAutoScroll(true);
        setIsUserScrolling(false);
        
        // Triple garantía para el scroll
        const forceScroll = () => {
          messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
          });
        };
        
        forceScroll(); // Inmediato
        requestAnimationFrame(forceScroll); // Siguiente frame
        setTimeout(forceScroll, 100); // Como respaldo
      }
    };
    
    return () => {
      delete window.scrollToBottom;
    };
  }, []);  // Debug logging simplificado (solo eventos importantes)
  const lastMessageRef = useRef(null);
  useEffect(() => {
    if (import.meta.env.DEV) {
      const lastMessage = messages[messages.length - 1];
      const isNewBotMessage = lastMessage && lastMessage.isBot && !lastMessage.isInitial;
      
      // Solo logear nuevos mensajes del bot
      if (isNewBotMessage && lastMessage !== lastMessageRef.current) {
        // console.log('🤖 New bot message added');
        lastMessageRef.current = lastMessage;
      }
    }
  }, [messages]);  // Auto-scroll mejorado con mejor detección de nuevos mensajes
  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current && !isUserScrolling) {
      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      };

      // Scroll inmediato y con respaldo para asegurar que funcione
      scrollToBottom();
      requestAnimationFrame(scrollToBottom);
      setTimeout(scrollToBottom, 100);
      setTimeout(scrollToBottom, 300); // Respaldo adicional
    }
  }, [messages, shouldAutoScroll, isUserScrolling]);

  // Scroll especial cuando termina el typing
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.isBot && !isTyping && shouldAutoScroll) {
      // Dar tiempo para que el mensaje se renderice completamente
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
          });
        }
      }, 150);
    }
  }, [isTyping, messages, shouldAutoScroll]);

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
  // Detectar si el usuario está scrolleando manualmente con mejor lógica
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const isAtBottom = distanceFromBottom <= 20; // Más estricto: solo 20px de tolerancia
      
      // Si el usuario se aleja del final, desactivar auto-scroll
      if (!isAtBottom && shouldAutoScroll) {
        setShouldAutoScroll(false);
        setIsUserScrolling(true);
        setHasNewMessages(true);
      }
      
      // Si vuelve al final, reactivar auto-scroll
      if (isAtBottom && !shouldAutoScroll) {
        setShouldAutoScroll(true);
        setIsUserScrolling(false);
        setHasNewMessages(false);
      }

      // Limpiar timeout anterior
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Resetear estado de scroll manual después de un tiempo
      scrollTimeoutRef.current = setTimeout(() => {
        if (isAtBottom) {
          setIsUserScrolling(false);
        }
      }, 300); // Tiempo reducido para mejor responsividad
    }
  }, [containerRef, shouldAutoScroll]);// Dependencias correctas
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
    <div className="flex-shrink-0 h-2" />    {messages.map((message, index) => (
      <div key={message.id || index} className="flex-shrink-0">        <ChatMessage
          message={message.content}
          isBot={message.isBot}
          isInitial={message.isInitial}
          shouldShowTyping={
            (message.isInitial && showInitialTyping) ||
            (message.id && message.id === typingMessageId && message.shouldShowTyping)
          }
          onTypingComplete={() => message.id && onTypingComplete(message.id)}
          onSendMessage={onSendMessage}
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
    <div ref={messagesEndRef} className="flex-shrink-0 h-2" />    {/* Botón discreto para volver al final */}
    {!shouldAutoScroll && messages.length > 1 && (
      <button
        onClick={() => {
          setShouldAutoScroll(true);
          setHasNewMessages(false);
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="fixed bottom-24 right-6 bg-bgDarkBlue/80 hover:bg-bgDarkBlue border border-lightBlue/30 hover:border-lightBlue/60 text-lightBlue p-2 rounded-full shadow-md hover:shadow-lg z-10 transition-all duration-200 backdrop-blur-sm"
        aria-label="Ir al final del chat"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7" />
        </svg>
        {/* Indicador discreto de mensajes nuevos */}
        {hasNewMessages && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-lightBlue rounded-full animate-pulse"></div>
        )}
      </button>
    )}
  </main>
  );
}