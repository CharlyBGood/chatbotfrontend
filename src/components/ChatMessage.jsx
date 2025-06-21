import { User } from 'lucide-react';
import { ChatFavicon } from './faviconcomponent/ChatFavicon';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect, useRef } from 'react';

export function ChatMessage({ message, isBot, shouldShowTyping = false, onTypingComplete }) {
  // Estado simple para el efecto de fade-in
  const [isVisible, setIsVisible] = useState(!shouldShowTyping);
  const [showContent, setShowContent] = useState(!shouldShowTyping);

  // Ref para evitar warnings del linter manteniendo la función actualizada
  const onTypingCompleteRef = useRef(onTypingComplete);
  // Actualizar la ref cuando cambie la función
  useEffect(() => {
    onTypingCompleteRef.current = onTypingComplete;
  }, [onTypingComplete]);

  // Función para procesar URLs en el texto
  const processMessageWithLinks = (text) => {
    if (!text || typeof text !== 'string') return text;

    // Regex mejorada para detectar URLs
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      // Reset regex para test
      urlRegex.lastIndex = 0;

      // Si es una URL
      if (urlRegex.test(part)) {
        // Asegurar que tenga protocolo
        const fullUrl = part.startsWith('http') ? part : `https://${part}`;

        // Detectar si es WhatsApp
        const isWhatsAppUrl = part.includes('whatsapp.com') || part.includes('wa.me');

        return (
          <a
            key={index}
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lightBlue underline hover:text-blue-500 transition-colors duration-200 font-semibold"
          >
            {isWhatsAppUrl ? 'Hablar con Maschio y Asociados' : part}
          </a>
        );
      }

      // Si no es URL, devolver el texto normal
      return part;
    });
  };

  // Efecto simple de fade-in con delay
  useEffect(() => {
    if (shouldShowTyping && message) {
      // Inicialmente oculto
      setShowContent(false);
      setIsVisible(false);

      // Delay para simular "pensando" (500ms)
      const showTimer = setTimeout(() => {
        setShowContent(true);
        // Pequeño delay adicional para activar la animación
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      }, 500);

      // Notificar cuando termine la animación (500ms delay + 800ms fade = 1300ms total)
      const completeTimer = setTimeout(() => {
        if (onTypingCompleteRef.current) {
          onTypingCompleteRef.current();
        }
      }, 1300);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(completeTimer);
      };
    } else {
      // Mostrar inmediatamente si no hay typing
      setShowContent(true);
      setIsVisible(true);
    }
  }, [message, shouldShowTyping]);

  return (
    <div className={`w-full flex ${isBot ? 'justify-start' : 'justify-end'} mb-2`}>
      <div className={`flex gap-2 items-start max-w-[80%] ${isBot ? 'bg-bgDarkBlue/10 border border-bgDarkBlue/20' : 'bg-lightBlue/5 border border-lightBlue/20'} p-4 rounded-lg`}>
        {isBot ? (
          <ChatFavicon alt="Bot Logo" />
        ) : null}
        {isBot ? (
          <div
            className={`flex-1 text-blueGray break-words w-full transition-opacity duration-800 ${showContent ? (isVisible ? 'opacity-100' : 'opacity-0') : 'opacity-0'
              }`}
          >            {showContent && (
            <ReactMarkdown
              components={{
                // Links - mejorado para manejar URLs automáticas
                a: (props) => {
                  const href = props.href || '';
                  const isWhatsAppUrl = href.includes('whatsapp.com') || href.includes('wa.me');

                  return (
                    <a
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lightBlue underline hover:text-blue-500 transition-colors duration-200 font-semibold"
                    >
                      {isWhatsAppUrl ? 'WhatsApp de Maschio y Asociados' : props.children}
                    </a>
                  );
                },
                // Párrafos - mejorado para procesar URLs automáticamente
                p: ({ children }) => {
                  // Si children es string, procesarlo para URLs
                  const processedChildren = typeof children === 'string'
                    ? processMessageWithLinks(children)
                    : children;

                  return (
                    <p className="mb-2 last:mb-0">{processedChildren}</p>
                  );
                },
                // Text nodes - procesar URLs en texto plano
                text: ({ children }) => {
                  return typeof children === 'string'
                    ? processMessageWithLinks(children)
                    : children;
                },
                // Headings con espaciado controlado
                h1: ({ children }) => (
                  <h1 className="text-xl font-bold mb-2 mt-1 first:mt-0">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-bold mb-2 mt-1 first:mt-0">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-bold mb-1 mt-1 first:mt-0">{children}</h3>
                ),
                // Listas con menos espaciado
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="mb-0">{children}</li>
                ),
                // Código con espaciado controlado
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  ) : (
                    <pre className="bg-gray-100 p-3 rounded mb-2 overflow-x-auto">
                      <code className="text-sm font-mono">{children}</code>
                    </pre>
                  );
                },
                // Blockquotes
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-lightBlue pl-4 mb-2 italic">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message}
            </ReactMarkdown>
          )}
          </div>
        ) : (
          <>
            <p className="flex-1 text-blueGray whitespace-pre-wrap break-words w-full">{message}</p>
            <User className="w-6 h-6 text-lightBlue flex-shrink-0" />
          </>
        )}
      </div>
    </div>
  );
}
