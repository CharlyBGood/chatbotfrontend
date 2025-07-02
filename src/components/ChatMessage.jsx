import { User } from 'lucide-react';
import { ChatFavicon } from './faviconcomponent/ChatFavicon';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState, useEffect, useRef } from 'react';

export function ChatMessage({ message, isBot, shouldShowTyping = false, onTypingComplete, isInitial = false, onSendMessage }) {  // Estados para el efecto typewriter palabra por palabra
  const [isVisible, setIsVisible] = useState(!shouldShowTyping);
  const [showContent, setShowContent] = useState(!shouldShowTyping);
  const [displayedText, setDisplayedText] = useState(!shouldShowTyping ? message : '');
  const [isTypingInProgress, setIsTypingInProgress] = useState(false);
  // Ref para evitar warnings del linter manteniendo la función actualizada
  const onTypingCompleteRef = useRef(onTypingComplete);
  // Actualizar la ref cuando cambie la función
  useEffect(() => {
    onTypingCompleteRef.current = onTypingComplete;
  }, [onTypingComplete]);

  // Efecto typewriter palabra por palabra
  useEffect(() => {
    if (shouldShowTyping && message && isBot) {      // Inicialmente oculto
      setShowContent(false);
      setIsVisible(false);
      setDisplayedText('');
      setIsTypingInProgress(false);

      // Delay inicial para simular "pensando" (500ms)
      const showTimer = setTimeout(() => {
        setShowContent(true);
        setIsVisible(true);
        setIsTypingInProgress(true);

        // Dividir el mensaje en palabras
        const words = message.split(' ');
        let wordIndex = 0;

        // Función para mostrar la siguiente palabra
        const showNextWord = () => {
          if (wordIndex < words.length) {
            const currentWords = words.slice(0, wordIndex + 1);
            setDisplayedText(currentWords.join(' '));
            wordIndex++;

            // Velocidad de aparición por palabra (150ms por palabra)
            setTimeout(showNextWord, 150);
          } else {
            // Todas las palabras mostradas
            setIsTypingInProgress(false);
            // Notificar completion
            setTimeout(() => {
              if (onTypingCompleteRef.current) {
                onTypingCompleteRef.current();
              }
            }, 200); // Pequeño delay extra después de la última palabra
          }
        };

        // Iniciar el efecto typewriter
        showNextWord();
      }, 500);

      return () => {
        clearTimeout(showTimer);
      };
    } else {      // Mostrar inmediatamente si no hay typing
      setShowContent(true);
      setIsVisible(true);
      setDisplayedText(message);
      setIsTypingInProgress(false);
    }
  }, [message, shouldShowTyping, isBot]);

  return (
    <div className={`w-full flex ${isBot ? 'justify-start' : 'justify-end'} mb-2 chat-message`}>
      <div className={`flex gap-2 items-start max-w-[80%] p-4 rounded-lg ${
        isBot 
          ? isInitial 
            ? 'initial-message' 
            : 'bot-message'
          : 'user-message'
      } ${isInitial ? 'animate-pulse-soft' : ''}`}>
        {isBot ? (
          <ChatFavicon alt="Bot Logo" />
        ) : null}        {isBot ? (
          <div
            className={`flex-1 text-gray-200 break-words break-all w-full transition-opacity duration-300 overflow-wrap-anywhere ${showContent ? (isVisible ? 'opacity-100' : 'opacity-0') : 'opacity-0'
              }`}
          >            {showContent && (
            <>
              <div className="bot-message-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: (props) => {
                      const href = props.href || '';
                      const isWhatsAppUrl = href.includes('whatsapp.com') || href.includes('wa.me');
                      const isAtmUrl = href.includes('ecommerce.atmseguros.com.ar') || href.includes('tinyurl.com/cotizaconMaschioenAtm');
                      
                      // Si es un link interno para generar mensajes (auto, hogar, vida, empresa)
                      const isInternalCommand = ['auto', 'hogar', 'vida', 'empresa'].includes(href.toLowerCase());
                      
                      if (isInternalCommand && onSendMessage) {
                        return (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              const command = href.toLowerCase();
                              const messages = {
                                auto: 'Quiero cotizar un seguro para mi auto',
                                hogar: 'Quiero cotizar un seguro para mi casa',
                                vida: 'Quiero cotizar un seguro de vida',
                                empresa: 'Quiero cotizar un seguro para mi empresa'
                              };
                              onSendMessage(messages[command] || command);
                            }}
                            className="clickable-option-btn"
                          >
                            {props.children}
                          </button>
                        );
                      }

                      return (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={isAtmUrl ? '' : 'text-lightBlue hover:text-lightBlueHover underline transition-colors duration-200'}
                          title={isWhatsAppUrl && href.includes('text=') ? decodeURIComponent(href.split('text=')[1].replace(/\+/g, ' ')) : undefined}
                        >
                          {isWhatsAppUrl ? 'Hablemos por WhatsApp' : isAtmUrl ? '⚡ Cotizá con ATM' : props.children}
                        </a>
                      );
                    }
                  }}
                >
                  {displayedText}
                </ReactMarkdown>
              </div>
              {isTypingInProgress && (
                <span className="inline-block w-2 h-5 bg-lightBlue ml-1 animate-pulse"></span>
              )}
            </>
          )}
          </div>
        ) : (
          <>
            <p className="flex-1 text-gray-200 whitespace-pre-wrap break-words w-full">{message}</p>
            <User className="w-6 h-6 text-lightBlue flex-shrink-0" />
          </>
        )}      </div>
    </div>
  );
}

// Añadir displayName para DevTools
ChatMessage.displayName = 'ChatMessage';
