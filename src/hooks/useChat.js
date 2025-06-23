import { useState, useEffect, useCallback, useMemo } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const initialBotMessage = {
  content: "¡Hola! Estoy para ayudarte a encontrar la mejor alternativa en seguros.",
  isBot: true,
  isInitial: true 
};

// Función simple para generar un UUID
function generateSessionId() {
  return 'xxxxxxxxyxxxxyxxxyxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function useChat(apiUrl, customInitialMessage) {
  // Determinar la URL de la API
  const CHAT_API_URL = apiUrl || API_URL;
    // Usar mensaje personalizado si se proporciona
  const botMessage = useMemo(() => 
    customInitialMessage ? 
      { content: customInitialMessage, isBot: true, isInitial: true } : 
      initialBotMessage,
    [customInitialMessage]
  );
  // Cargar historial real (sin mensaje inicial) desde sessionStorage
  const stored = sessionStorage.getItem('chatMessages');
  const parsedMessages = stored ? JSON.parse(stored) : [];

  // sessionId para mantener el contexto con el backend
  const [sessionId, setSessionId] = useState(() => {
    let id = sessionStorage.getItem('sessionId');
    if (!id) {
      id = generateSessionId();
      sessionStorage.setItem('sessionId', id);
    }
    return id;
  });
  // Estado del chat incluye el mensaje visual inicial (solo para UI)
  const [messages, setMessages] = useState([
    botMessage,
    ...parsedMessages
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
    // Estado simple para controlar solo el typing del mensaje inicial
  const [showInitialTyping, setShowInitialTyping] = useState(parsedMessages.length === 0);
  
  // Estado para controlar el typing de nuevos mensajes del bot
  const [typingMessageId, setTypingMessageId] = useState(null);  const sendMessage = async (message) => {
    try {
      setIsLoading(true);
      const userMsg = { content: message, isBot: false };
      setMessages(prev => [...prev, userMsg]);
      
      // Garantizar que el usuario pueda ver su mensaje
      setTimeout(() => {
        if (window.scrollToBottom) window.scrollToBottom();
      }, 100);

      // Mostrar indicador de typing después de un pequeño delay
      setTimeout(() => {
        setIsTyping(true);
      }, 500);

      // Filtrar solo los mensajes "reales" (sin el mensaje inicial)
      const realMessages = [...messages, userMsg].filter(m => !m.isInitial);
      // Formato para API: historial completo
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
      
      // Ocultar typing antes de mostrar la respuesta
      setIsTyping(false);
      const botReply = {
        content: data.text || 'Sin respuesta',
        isBot: true,
        id: Date.now() + Math.random(), // ID único para el mensaje
        shouldShowTyping: true, // Marcar que debe mostrar typing
      };
      
      // Activar typing para este mensaje específico
      setTypingMessageId(botReply.id);
      
      // Agregar la respuesta del bot de forma simple
      const updatedMessages = [...messages, userMsg, botReply];
      setMessages(updatedMessages);
      
      // Garantizar scroll para la respuesta del bot
      setTimeout(() => {
        if (window.scrollToBottom) window.scrollToBottom();
      }, 200);
      
      // Guardar solo los mensajes reales en sessionStorage
      const storedMessages = updatedMessages.filter(m => !m.isInitial);
      sessionStorage.setItem('chatMessages', JSON.stringify(storedMessages));
      
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

  // Si otros efectos modifican mensajes, asegurarse de mantener solo los "reales" en storage
  useEffect(() => {
    const realMessages = messages.filter(m => !m.isInitial);
    sessionStorage.setItem('chatMessages', JSON.stringify(realMessages));
  }, [messages]);  // Función para marcar que terminó el typing de un mensaje específico
  const onTypingComplete = useCallback((messageId) => {
    if (typingMessageId === messageId) {
      setTypingMessageId(null);
      
      // Forzar scroll al final después de que termine el typing
      setTimeout(() => {
        if (window.scrollToBottom) {
          window.scrollToBottom();        }
      }, 100);
    }
  }, [typingMessageId]);
  // Función para resetear sesión en el backend
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

  // Permitir resetear el chat (opcional, útil para UX)
  const resetChat = useCallback(async () => {
    const oldSessionId = sessionId; // Guardar el ID actual antes de cambiarlo
    
    // Resetear estado del frontend
    setMessages([botMessage]);
    setIsTyping(false);
    setShowInitialTyping(true); // Mostrar typing effect al resetear
    sessionStorage.removeItem('chatMessages');
    
    // Generar nuevo sessionId
    const newId = generateSessionId();
    setSessionId(newId);
    sessionStorage.setItem('sessionId', newId);
    
    // Notificar al backend para limpiar la sesión anterior
    await resetSessionOnBackend(oldSessionId);
    
    console.log(`🔄 Chat reseteado: ${oldSessionId} → ${newId}`);
  }, [botMessage, sessionId, resetSessionOnBackend]);

  // Exponer resetChat en window para debugging (solo en desarrollo)
  useEffect(() => {
    if (import.meta.env.DEV) {
      window.resetChat = resetChat;
      // Solo mostrar el tip una vez
      if (!window.chatTipShown) {
        console.log('💡 Para probar el efecto de typing, ejecuta: window.resetChat()');
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
