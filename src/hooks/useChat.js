import { useState, useEffect } from 'react';

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
    return r.toString(16);
  });
}

export function useChat() {
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
    initialBotMessage,
    ...parsedMessages
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (message) => {
    try {
      setIsLoading(true);
      const userMsg = { content: message, isBot: false };
      setMessages(prev => [...prev, userMsg]);

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

      const response = await fetch(API_URL, {
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
      };
      // Agregar la respuesta del bot
      const updatedMessages = [...messages, userMsg, botReply];
      setMessages(updatedMessages);
      // Guardar solo los mensajes reales en sessionStorage
      const storedMessages = updatedMessages.filter(m => !m.isInitial);
      sessionStorage.setItem('chatMessages', JSON.stringify(storedMessages));
    } catch (error) {
      setIsTyping(false); // Ocultar typing en caso de error
      setMessages(prev => [
        ...prev,
        { content: `Lo sentimos, hubo un error: ${error.message}`, isBot: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Si otros efectos modifican mensajes, asegurarse de mantener solo los "reales" en storage
  useEffect(() => {
    const realMessages = messages.filter(m => !m.isInitial);
    sessionStorage.setItem('chatMessages', JSON.stringify(realMessages));
  }, [messages]);

  // Permitir resetear el chat (opcional, útil para UX)
  const resetChat = () => {
    setMessages([initialBotMessage]);
    setIsTyping(false); // Reset typing state
    sessionStorage.removeItem('chatMessages');
    const newId = generateSessionId();
    setSessionId(newId);
    sessionStorage.setItem('sessionId', newId);
  };

  return {
    messages,
    isLoading,
    isTyping,
    sendMessage,
    resetChat, // expuesto para usar en la UI si lo deseas
  };
}