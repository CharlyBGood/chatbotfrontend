# SegurBot - Frontend Chatbot

Frontend interactivo para el chatbot SegurBot de Maschio y Asociados, especializado en consultas de seguros.

## 🚀 Características

- **Interfaz moderna y responsiva** - Optimizada para móviles y desktop
- **Enlaces automáticos** - Detecta URLs en mensajes y las convierte en enlaces clickeables
- **Tratamiento especial para WhatsApp** - Enlaces de WhatsApp se muestran como "WhatsApp de Maschio y Asociados"
- **Efectos visuales suaves** - Fade-in para mensajes del bot
- **Botón de reset** - Permite reiniciar la conversación desde el header
- **Soporte markdown** - Compatible con texto enriquecido en mensajes

## 🛠️ Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de build
npm run preview
```

## 🏗️ Arquitectura

### Componentes principales
- `SegurBot.jsx` - Componente principal del chatbot
- `ChatBot.jsx` - Lógica central de chat y manejo de estado
- `ChatHeader.jsx` - Header con título y botón de reset
- `ChatWindow.jsx` - Ventana de mensajes
- `ChatMessage.jsx` - Renderizado de mensajes individuales con enlaces automáticos
- `ChatInput.jsx` - Input de mensajes con manejo móvil

### Hooks personalizados
- `useChat.js` - Manejo de estado de chat y comunicación con API
- `useViewport.js` - Detección de viewport y dispositivo móvil
- `useVirtualKeyboard.js` - Manejo de teclado virtual en móviles
- `useInputPositioning.js` - Posicionamiento del input en móviles

## 🌐 API

El frontend se comunica con el backend a través de:
```
POST /api/chat
{
  "message": "mensaje del usuario"
}
```

## 📱 Soporte móvil

- Detección automática de dispositivos móviles
- Ajuste dinámico del layout para teclado virtual
- Optimización de UX para pantallas táctiles