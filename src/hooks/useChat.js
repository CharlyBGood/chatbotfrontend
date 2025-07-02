import { useState, useEffect, useCallback, useMemo } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const initialBotMessage = {
  content: `🤖 **¡Hola! Soy SegurBot** 🚀

✨ Tu asistente especializado en seguros

💬 **Contame qué necesitás** o hacé click en una opción:
🚗 **¿[Auto](auto)?**
🔥 **[Cotizá ahora mismo](https://ecommerce.atmseguros.com.ar/?sale-center=2y10tlfsxluek4uomgoapb4pnee6wq6sc0gbfpflgju2vukfabvhvkni&fromQr=true)**

🏠 **[Casa](hogar)** 
👥 **[Vida](vida)** 🏢 **[Empresa](empresa)**

⚡ *Te respondo al toque*`,
  isBot: true,
  isInitial: true
};

function generateSessionId() {
  return 'xxxxxxxxyxxxxyxxxyxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function useChat(apiUrl, customInitialMessage) {

  const CHAT_API_URL = apiUrl || API_URL;

  const botMessage = useMemo(() =>
    customInitialMessage ?
      { content: customInitialMessage, isBot: true, isInitial: true } :
      initialBotMessage,
    [customInitialMessage]
  );

  const stored = sessionStorage.getItem('chatMessages');
  const parsedMessages = stored ? JSON.parse(stored) : [];
  
  // Verificar si ya se mostró el mensaje inicial en esta sesión
  const hasInitialMessage = parsedMessages.some(m => m.isInitial);

  const [sessionId, setSessionId] = useState(() => {
    let id = sessionStorage.getItem('sessionId');
    if (!id) {
      id = generateSessionId();
      sessionStorage.setItem('sessionId', id);
    }
    return id;
  });

  // Solo agregar mensaje inicial si no existe en los mensajes guardados
  const [messages, setMessages] = useState(() => {
    if (hasInitialMessage || parsedMessages.length > 0) {
      // Ya hay mensajes (incluido el inicial) - cargar desde storage
      return parsedMessages;
    } else {
      // Primera vez - mostrar mensaje inicial
      return [botMessage];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [showInitialTyping, setShowInitialTyping] = useState(!hasInitialMessage && parsedMessages.length === 0);

  const [typingMessageId, setTypingMessageId] = useState(null);

  // Guardar mensaje inicial cuando se crea por primera vez
  useEffect(() => {
    if (!hasInitialMessage && messages.length === 1 && messages[0].isInitial) {
      sessionStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [hasInitialMessage, messages]);

  const sendMessage = async (message) => {
    try {
      setIsLoading(true);
      const userMsg = { content: message, isBot: false };
      setMessages(prev => [...prev, userMsg]);

      setTimeout(() => {
        if (window.scrollToBottom) window.scrollToBottom();
      }, 100);

      setTimeout(() => {
        setIsTyping(true);
      }, 500);

      // Para el historial del chat (API), excluir mensajes iniciales
      const realMessages = [...messages, userMsg].filter(m => !m.isInitial);

      const chatHistory = realMessages.map(m => ({
        role: m.isBot ? 'assistant' : 'user',
        content: m.content,
      }));

      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory, sessionId }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      setIsTyping(false);
      // LOG para debug: ver el mensaje recibido del LLM
      console.log('[DEBUG] Mensaje recibido del LLM:', data.text);
      const botReply = {
        content: data.text || 'Sin respuesta',
        isBot: true,
        id: Date.now() + Math.random(),
        shouldShowTyping: true,
      };

      setTypingMessageId(botReply.id);

      const updatedMessages = [...messages, userMsg, botReply];
      setMessages(updatedMessages);

      setTimeout(() => {
        if (window.scrollToBottom) window.scrollToBottom();
      }, 200);

      // Guardar TODOS los mensajes en sessionStorage (incluido el inicial)
      sessionStorage.setItem('chatMessages', JSON.stringify(updatedMessages));

    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          content: `Lo sentimos, hubo un error: ${error.message}`,
          isBot: true,
          id: Date.now() + Math.random()
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Guardar todos los mensajes en sessionStorage (incluido el inicial)
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const onTypingComplete = useCallback((messageId) => {
    if (typingMessageId === messageId) {
      setTypingMessageId(null);

      setTimeout(() => {
        if (window.scrollToBottom) {
          window.scrollToBottom();
        }
      }, 100);
    }
  }, [typingMessageId]);

  const resetSessionOnBackend = useCallback(async (oldSessionId) => {
    try {
      const response = await fetch(`${CHAT_API_URL}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: oldSessionId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🔄 Sesión reseteada en backend:', data.message);
      } else {
        console.warn('⚠️ Error al resetear sesión en backend:', response.status);
      }
    } catch (error) {
      console.warn('⚠️ No se pudo resetear sesión en backend:', error.message);
    }
  }, [CHAT_API_URL]);

  const resetChat = useCallback(async () => {
    const oldSessionId = sessionId;

    setMessages([botMessage]);
    setIsTyping(false);
    setShowInitialTyping(true);
    sessionStorage.removeItem('chatMessages');

    const newId = generateSessionId();
    setSessionId(newId);
    sessionStorage.setItem('sessionId', newId);

    await resetSessionOnBackend(oldSessionId);

    console.log(`🔄 Chat reseteado: ${oldSessionId} → ${newId}`);
  }, [botMessage, sessionId, resetSessionOnBackend]);

  useEffect(() => {
    if (import.meta.env.DEV) {
      window.resetChat = resetChat;
      if (!window.chatTipShown) {
        window.chatTipShown = true;
      }
    }
    return () => {
      if (import.meta.env.DEV) {
        delete window.resetChat;
      }
    };
  }, [resetChat]);

  return {
    messages,
    isLoading,
    isTyping,
    showInitialTyping,
    typingMessageId,
    onTypingComplete,
    sendMessage,
    resetChat,
  };
}
