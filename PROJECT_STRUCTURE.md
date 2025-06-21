# 🏗️ Estructura del Proyecto SegurBot

## 📁 Estructura de Archivos

```
x:\develop\botfrontend\
├── 📄 .env                     # Variables de entorno
├── 📄 .gitignore              # Archivos ignorados por Git
├── 📄 eslint.config.js        # Configuración ESLint
├── 📄 index.html              # HTML base
├── 📄 package.json            # Dependencias y scripts
├── 📄 README.md               # Documentación principal
├── 📄 vite.config.js          # Configuración Vite
├── 📁 public/
│   └── vite.svg               # Logo de Vite
└── 📁 src/
    ├── 📄 App.jsx             # Componente raíz de la aplicación
    ├── 📄 main.jsx            # Punto de entrada de React
    ├── 📄 index.css           # Estilos globales y CSS variables
    ├── 📁 components/
    │   ├── 📄 SegurBot.jsx    # Componente principal del chatbot
    │   ├── 📄 ChatBot.jsx     # Lógica central de chat y estado
    │   ├── 📄 ChatHeader.jsx  # Header con título y botón reset
    │   ├── 📄 ChatWindow.jsx  # Ventana de mensajes
    │   ├── 📄 ChatMessage.jsx # Mensaje individual con enlaces automáticos
    │   ├── 📄 ChatInput.jsx   # Input de mensajes con soporte móvil
    │   ├── 📄 TypingIndicator.jsx  # Indicador de escritura
    │   ├── 📄 MobileChatLayout.jsx # Layout optimizado para móviles
    │   ├── 📄 MobileDebugPanel.jsx # Panel debug (lazy loading)
    │   └── 📁 faviconcomponent/
    │       └── 📄 ChatFavicon.jsx  # Favicon del bot
    └── 📁 hooks/
        ├── 📄 useChat.js            # Estado y lógica de chat
        ├── 📄 useViewport.js        # Detección viewport y móvil
        ├── 📄 useVirtualKeyboard.js # Manejo teclado virtual
        └── 📄 useInputPositioning.js # Posicionamiento input móvil
```

## 🎯 Componentes Principales

### **SegurBot.jsx**
- Componente de entrada principal
- Configuración y props del chatbot
- Envuelve a ChatBot con configuración específica

### **ChatBot.jsx**
- Lógica central del chat
- Manejo de estado global
- Diferenciación móvil/desktop
- Importación lazy de MobileDebugPanel

### **ChatMessage.jsx**
- Renderizado de mensajes individuales
- **Detección automática de URLs** con enlaces clickeables
- **Tratamiento especial para WhatsApp** ("WhatsApp de Maschio y Asociados")
- **Efecto fade-in** para mensajes del bot
- Soporte completo para ReactMarkdown

### **ChatHeader.jsx**
- Header con título y branding
- **Botón de reset** con icono SVG y animaciones
- **Texto sombreado** para WhatsApp
- Responsivo móvil/desktop

### **ChatInput.jsx**
- Input de mensajes con validación
- Soporte optimizado para móviles
- Manejo de teclado virtual
- Auto-focus y posicionamiento inteligente

## 🔧 Hooks Personalizados

### **useChat.js**
- Estado de mensajes y conversación
- Comunicación con API backend
- Manejo de loading y typing states
- Función de reset de chat

### **useViewport.js**
- Detección de viewport y dimensiones
- Identificación de dispositivos móviles
- Manejo de cambios de orientación

### **useVirtualKeyboard.js**
- Detección de teclado virtual en móviles
- Ajustes de layout automáticos
- Optimización de UX móvil

### **useInputPositioning.js**
- Posicionamiento inteligente del input
- Scroll automático para visibilidad
- Integración con teclado virtual

## 🎨 Características Clave

### **Enlaces Automáticos**
- Detección automática de URLs en mensajes
- Conversión a enlaces clickeables
- Texto personalizado para WhatsApp
- Compatible con markdown

### **Optimización Móvil**
- Layout responsivo completo
- Manejo de teclado virtual
- Scroll y posicionamiento optimizados
- Debug panel condicional (lazy loading)

### **Efectos Visuales**
- Fade-in suave para mensajes del bot
- Animaciones de botones y hover states
- Sombreado de texto personalizado
- Scrollbar personalizada

### **Accesibilidad**
- ARIA labels y roles
- Navegación por teclado
- Contraste y legibilidad optimizada
- Soporte para screen readers

## 📦 Bundle Optimization

- **Lazy loading** de MobileDebugPanel
- **Tree shaking** automático con Vite
- **Code splitting** para chunks optimizados
- **CSS optimizado** con Tailwind y variables

## 🚀 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Verificación ESLint
```

## 🌟 Estado del Proyecto

✅ **100% funcional** - Todas las características implementadas  
✅ **0 errores ESLint** - Código limpio y consistente  
✅ **Bundle optimizado** - Lazy loading y code splitting  
✅ **Documentación completa** - README y estructura actualizada  
✅ **Móvil y desktop** - Experiencia optimizada en ambos  

El proyecto está **listo para producción** y mantenimiento eficiente.
