import { User } from 'lucide-react';
import { ChatFavicon } from './faviconcomponent/ChatFavicon';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState, useEffect, useRef } from 'react';

export function ChatMessage({ message, isBot, shouldShowTyping = false, onTypingComplete }) {  // Estados para el efecto typewriter palabra por palabra
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
    <div className={`w-full flex ${isBot ? 'justify-start' : 'justify-end'} mb-2`}>
      <div className={`flex gap-2 items-start max-w-[80%] ${isBot ? 'bg-bgDarkBlue/10 border border-bgDarkBlue/20' : 'bg-lightBlue/5 border border-lightBlue/20'} p-4 rounded-lg`}>
        {isBot ? (
          <ChatFavicon alt="Bot Logo" />
        ) : null}        {isBot ? (
          <div
            className={`flex-1 text-blueGray break-words w-full transition-opacity duration-300 ${showContent ? (isVisible ? 'opacity-100' : 'opacity-0') : 'opacity-0'
              }`}
          >            {showContent && (
            <>
              <div className="bot-message-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Solo mantenemos los links personalizados para WhatsApp y ATM
                    a: (props) => {
                      const href = props.href || '';
                      const isWhatsAppUrl = href.includes('whatsapp.com') || href.includes('wa.me');
                      const isAtmUrl = href.toLowerCase().includes('atm');

                      return (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {isWhatsAppUrl ? 'WhatsApp de Maschio y Asociados' :
                            isAtmUrl ? 'Cotizar con ATM' : props.children}
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
            <p className="flex-1 text-blueGray whitespace-pre-wrap break-words w-full">{message}</p>
            <User className="w-6 h-6 text-lightBlue flex-shrink-0" />
          </>
        )}      </div>
    </div>
  );
}

// Añadir displayName para DevTools
ChatMessage.displayName = 'ChatMessage';
