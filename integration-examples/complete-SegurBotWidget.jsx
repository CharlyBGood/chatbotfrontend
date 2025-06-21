// src/components/SegurBotWidget.jsx
import { useSegurBot } from '../hooks/useSegurBot';

export function SegurBotWidget({ 
  apiUrl = 'http://localhost:8080/api/chat', // 🔴 CAMBIAR por tu API
  position = 'bottom-right',
  initialMessage = '¡Hola! ¿En qué puedo ayudarte?',
  title = 'Asistente Virtual',
  autoOpen = false,
  width = '400px',
  height = '600px',
  enableDebug = false,
  showButton = true,
  buttonText = 'Chat',
  className = '',
  children 
}) {
  const { isLoaded, isOpen, error, open, close, toggle } = useSegurBot({
    apiUrl,
    position,
    initialMessage,
    title,
    autoOpen,
    width,
    height,
    enableDebug
  });

  // Si hay un error, mostrarlo
  if (error) {
    console.error('SegurBot Error:', error);
    return (
      <div className="text-red-500 text-sm p-2 border border-red-300 rounded bg-red-50">
        Error cargando el chatbot: {error}
      </div>
    );
  }

  // Renderizar función children si se proporciona (patrón render prop)
  if (children && typeof children === 'function') {
    return children({ isLoaded, isOpen, error, open, close, toggle });
  }

  // No mostrar botón si showButton es false
  if (!showButton) {
    return null;
  }

  // Renderizar botón por defecto
  return (
    <div className={`segurbot-widget-container ${className}`}>
      {isLoaded ? (
        <button
          onClick={toggle}
          className="segurbot-widget-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2"
          aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
          disabled={!isLoaded}
        >
          <ChatIcon />
          <span>{isOpen ? 'Cerrar' : buttonText}</span>
        </button>
      ) : (
        <div className="segurbot-widget-loading bg-gray-400 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <LoadingIcon />
          <span>Cargando...</span>
        </div>
      )}
    </div>
  );
}

// Iconos SVG simples
function ChatIcon() {
  return (
    <svg 
      className="w-5 h-5" 
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
  );
}

function LoadingIcon() {
  return (
    <svg 
      className="w-5 h-5 animate-spin" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
      />
    </svg>
  );
}
