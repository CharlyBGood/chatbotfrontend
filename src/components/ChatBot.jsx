import { ChatHeader } from './ChatHeader';
import { useChat } from '../hooks/useChat';
import { ChatWindow } from './ChatWindow';
import { ChatInput } from './ChatInput';
import { useViewport } from '../hooks/useViewport';
import { useVirtualKeyboard } from '../hooks/useVirtualKeyboard';
import { MobileChatLayout } from './MobileChatLayout';
import { useEffect, useRef, lazy, Suspense } from 'react';

// Importación lazy del MobileDebugPanel para reducir el bundle size
const MobileDebugPanel = lazy(() => import('./MobileDebugPanel').then(module => ({ default: module.MobileDebugPanel })));

export function ChatBot({ apiUrl, apiKey, initialMessage, title, /* theme, */ onClose, open = true, enableDebug = false }) {
  const { messages, isLoading, isTyping, sendMessage, showInitialTyping, typingMessageId, onTypingComplete, resetChat } = useChat(apiUrl || apiKey, initialMessage);
  const viewport = useViewport();
  const keyboard = useVirtualKeyboard();
  const chatContainerRef = useRef(null); // Ref for the scroll container
  
  // Función debug para resetear chat desde consola
  useEffect(() => {
    if (enableDebug) {
      window.resetChatDebug = resetChat;
      console.log('🔧 Debug mode enabled. Use window.resetChatDebug() to reset chat');
      
      return () => {
        delete window.resetChatDebug;
      };
    }
  }, [resetChat, enableDebug]);
  
  const { 
    isMobile, 
    headerRef, 
    footerRef, 
    headerHeight,
    footerHeight
  } = viewport;
    // Calcular altura disponible más precisamente
  const availableHeight = keyboard.isKeyboardVisible 
    ? Math.max(120, keyboard.visualViewportHeight - headerHeight - footerHeight)
    : Math.max(120, viewport.visualViewportHeight - headerHeight - footerHeight);

  useEffect(() => {
    if (isMobile && open) {
      // Agregar clase para prevenir scroll del body
      document.body.classList.add('chat-open');
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      
      return () => { 
        document.body.classList.remove('chat-open');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
      };
    }
  }, [isMobile, open]);

  const chatContent = (
    <>
      <ChatHeader ref={headerRef} title={title} onClose={onClose} onResetChat={resetChat} />      <div 
        ref={chatContainerRef}
        className="flex-1 bg-bgDarkBlue min-h-0 chat-window-container"
        style={isMobile ? {
          height: `${availableHeight}px`,
          maxHeight: `${availableHeight}px`,
          minHeight: '120px',
          overflowY: 'scroll',
          overflowX: 'hidden'
        } : {
          overflowY: 'scroll',
          overflowX: 'hidden'
        }}
      >        <ChatWindow
          messages={messages} 
          availableHeight={isMobile ? availableHeight : undefined}
          isKeyboardOpen={keyboard.isKeyboardVisible}
          scrollContainerRef={chatContainerRef}
          isTyping={isTyping}
          showInitialTyping={showInitialTyping}
          typingMessageId={typingMessageId}
          onTypingComplete={onTypingComplete}
        />
      </div>
      <ChatInput 
        ref={footerRef}
        onSendMessage={sendMessage} 
        isLoading={isLoading} 
        isMobile={isMobile} 
      />
    </>
  );

  // Add scroll event listener to the chat container
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // This will be handled by ChatWindow component
      // but we need to ensure the scroll events are properly triggered
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);
  if (isMobile) {
    return (
      <>
        {enableDebug && (
          <Suspense fallback={null}>
            <MobileDebugPanel enabled={enableDebug} />
          </Suspense>
        )}
        <MobileChatLayout isMobile={isMobile}>
          {chatContent}
        </MobileChatLayout>
      </>
    );
  }

  return (
    <div className="fixed bottom-25 right-12 z-50 bg-bgDarkBlue shadow-2xl flex flex-col w-80 sm:w-96 h-[32em]">
      {chatContent}
    </div>
  );
}