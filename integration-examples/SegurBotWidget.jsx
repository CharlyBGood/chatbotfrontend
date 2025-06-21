// components/SegurBotWidget.jsx
import { useSegurBot } from '../hooks/useSegurBot';

export function SegurBotWidget({ 
  apiUrl = 'https://tu-backend.com/api/chat',
  position = 'bottom-right',
  initialMessage = '¡Hola! ¿En qué puedo ayudarte?',
  title = 'Asistente Virtual',
  autoOpen = false,
  children 
}) {
  const { isLoaded, isOpen, open, close, toggle } = useSegurBot({
    apiUrl,
    position,
    initialMessage,
    title,
    autoOpen
  });

  // Renderizar botón personalizado si se proporciona children
  if (children) {
    return (
      <>
        {children({ isLoaded, isOpen, open, close, toggle })}
      </>
    );
  }

  // Renderizar botón por defecto
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isLoaded && (
        <button
          onClick={toggle}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
          aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" 
            />
          </svg>
        </button>
      )}
    </div>
  );
}
