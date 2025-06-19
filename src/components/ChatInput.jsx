import { useState, useRef, useEffect, forwardRef } from 'react';
import { SendHorizontal } from 'lucide-react';
import { useInputPositioning } from '../hooks/useInputPositioning';

export const ChatInput = forwardRef(function ChatInput({ onSendMessage, isLoading, isMobile }, ref) {
  const [input, setInput] = useState('');
  const internalInputRef = useRef(null);
  const { inputRef: positioningInputRef, ensureInputVisibility } = useInputPositioning(isMobile);

  // Combinar refs
  useEffect(() => {
    if (positioningInputRef.current && internalInputRef.current) {
      positioningInputRef.current = internalInputRef.current;
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  useEffect(() => {
    if (!isLoading && input === '' && internalInputRef.current) {
      internalInputRef.current.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    if (internalInputRef.current) {
      internalInputRef.current.style.height = 'auto';
      internalInputRef.current.style.height = internalInputRef.current.scrollHeight + 'px';
      
      // Asegurar visibilidad después de cambiar el tamaño
      if (isMobile && document.activeElement === internalInputRef.current) {
        ensureInputVisibility();
      }
    }
  }, [input, isMobile, ensureInputVisibility]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFocus = () => {
    if (isMobile) {
      setTimeout(ensureInputVisibility, 300);
    }
  };

  return (
    <footer 
      ref={ref}
      className={`border-t border-lightBlue/20 rounded-b-lg flex-shrink-0 ${
        isMobile 
          ? 'mobile-chat-footer bg-Blue pb-safe' 
          : 'bg-Blue shadow-lg'
      }`}
      style={{ fontSize: isMobile ? '16px' : '14px' }}
    >
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-end gap-1 w-full p-2 px-4">
          <textarea
            ref={(node) => {
              internalInputRef.current = node;
              if (positioningInputRef) {
                positioningInputRef.current = node;
              }
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder="Escribe tu consulta aquí..."
            className="flex-1 p-3 bg-Black border border-lightBlue/30 rounded-xl text-blueGray placeholder-blueGray/70 focus:outline-none focus:ring-2 focus:ring-lightBlue focus:border-transparent resize-none min-h-[44px] text-base leading-tight shadow-sm transition-all duration-200 overflow-hidden scrollbar-none"
            disabled={isLoading}
            rows={1}
            maxLength={1000}
            name='user_input'
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="sentences"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center h-[44px] w-[44px] min-w-[44px] min-h-[44px] ml-1 rounded-xl bg-lightBlue hover:bg-lightBlueHover focus:outline-none focus:ring-2 focus:ring-lightBlue shadow-lg text-blueGray text-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Enviar mensaje"
          >
            <SendHorizontal className="w-6 h-6" />
          </button>
        </div>
      </form>
    </footer>
  );
});
