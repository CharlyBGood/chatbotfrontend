import { ChatFavicon } from './faviconcomponent/ChatFavicon';
import { forwardRef } from 'react';
import { useViewport } from '../hooks/useViewport';

export const ChatHeader = forwardRef(function ChatHeader({ onClose, onResetChat }, ref) {
  const { isMobile } = useViewport();
  
  return (
    <header 
      ref={ref} 
      className={`bg-Blue shadow-lg border-b relative border-lightBlue/20 rounded-t-lg flex-shrink-0 ${
        isMobile ? 'mobile-chat-header' : ''
      }`} 
      onClick={onClose}
    >
      <div className="flex items-center gap-2 w-85 m-auto relative p-2 ">
        <ChatFavicon alt="Logo de la Maschio y Asociados" />        <div className='flex flex-col items-center justify-center w-full'>
          <h1 className="flex-1 text-xl font-semibold text-blueGray text-center mx-auto tracking-widest drop-shadow-md">SegurBot</h1>
          <a target='_blank' className='text-blueGray hover:text-lightBlue' href="https://asegurando.online">Maschio y Asociados</a>
        </div>
          {/* Botón de resetear chat */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onResetChat?.();
          }}
          className="text-blueGray text-xl px-2 py-1 hover:text-lightBlue z-10 focus:outline-none cursor-pointer transition-all duration-300 hover:rotate-180"
          aria-label="Resetear chat"
          title="Reiniciar conversación"
          type="button"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-5 h-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
        </button>
        
        <button
          onClick={onClose}
          className="text-blueGray text-3xl px-2 py-1 hover:text-lightBlue z-10 focus:outline-none cursor-pointer transition-colors duration-200"
          aria-label="Cerrar chat"
          type="button"
        >
          ×
        </button>
      </div>
      <p className="text-sm text-center">
        <a
          href="https://api.whatsapp.com/send/?phone=5491156999580&text=Quiero+saber+m%C3%A1s+sobre+.+.+."
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center w-full text-center relative px-2 py-2 font-semibold shadow-md text-blueGray bg-gradient-to-r from-lightBlue via-blue-500 to-bgDarkBlue hover:from-blue-500 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-lightBlue focus:ring-offset-2 transition-all duration-300 animate-pulse"
          style={{
            boxShadow: '0 2px 12px 0 rgba(59, 130, 246, 0.25)'
          }}
        >          <span className="inline-flex items-center gap-2 drop-shadow-lg text-shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blueGray drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.72 11.06a6.5 6.5 0 10-2.28 2.28l2.54.73a1 1 0 001.26-1.26l-.73-2.54z" /></svg>
            Contactanos por WhatsApp
          </span>
        </a>
      </p>
    </header>
  );
});