# 🏗️ Estructura del Proyecto SegurBot (Limpia)

## 📁 Estructura de Archivos Final

```
x:\develop\botfrontend\
├── 📄 .env                     # Variables de entorno
├── 📄 .gitignore              # Archivos ignorados por Git
├── 📄 eslint.config.js        # Configuración ESLint
├── 📄 index.html              # HTML base de la aplicación
├── 📄 package.json            # Dependencias y scripts
├── 📄 README.md               # Documentación principal
├── 📄 PROJECT_STRUCTURE.md    # Documentación de estructura
├── 📄 vite.config.js          # Configuración Vite para la aplicación
├── 📄 vite.widget-umd.config.js # Configuración Vite para el widget UMD
├── 📄 vercel.json             # Configuración de deployment Vercel
├── 📁 public/
│   └── vite.svg               # Logo de Vite
├── 📁 dist/                   # Archivos de build generados
│   ├── segurbot-widget.umd.cjs # Widget UMD para integración externa
│   ├── segurbot-widget.css     # Estilos del widget
│   └── [otros archivos de build]
└── 📁 src/
    ├── 📄 App.jsx             # Componente raíz de la aplicación
    ├── 📄 main.jsx            # Punto de entrada de React
    ├── 📄 index.css           # Estilos globales y CSS variables
    ├── 📄 widget.js           # Entry point del widget UMD
    ├── 📁 assets/             # Recursos estáticos
    ├── 📁 components/
    │   ├── 📄 SegurBot.jsx    # Componente principal del chatbot
    │   ├── 📄 ChatBot.jsx     # Lógica central de chat y estado
    │   ├── 📄 ChatHeader.jsx  # Header con título y botón reset
    │   ├── 📄 ChatWindow.jsx  # Ventana de mensajes
    │   ├── 📄 ChatMessage.jsx # Mensaje individual con enlaces automáticos
    │   ├── 📄 ChatInput.jsx   # Input de mensajes con soporte móvil
    │   ├── 📄 ChatInputNew.jsx # Input alternativo (nuevo)
    │   ├── 📄 TypingIndicator.jsx  # Indicador de escritura
    │   ├── 📄 MobileChatLayout.jsx # Layout optimizado para móviles
    │   ├── 📄 MobileDebugPanel.jsx # Panel debug (lazy loading)
    │   ├── 📄 KeyboardIndicator.jsx # Indicador de teclado virtual
    │   └── 📁 faviconcomponent/
    │       └── 📄 ChatFavicon.jsx  # Favicon del bot
    └── 📁 hooks/
        ├── 📄 useChat.js            # Estado y lógica de chat
        ├── 📄 useViewport.js        # Detección viewport y móvil
        ├── 📄 useVirtualKeyboard.js # Manejo teclado virtual
        ├── 📄 useInputPositioning.js # Posicionamiento input móvil
        └── 📄 useIsMobile.js        # Hook para detección móvil
```

## 🧹 Archivos Eliminados en la Limpieza

### Documentación Temporal
- `COMPLETION_SUMMARY.md`
- `FINAL_ENHANCEMENT_SUMMARY.md` 
- `IMPLEMENTATION_FINAL_SUMMARY.md`
- `KEYBOARD_FIX_SUMMARY.md`
- `MOBILE_GUIDE.md`
- `MOBILE_OPTIMIZATIONS.md`
- `WIDGET_STATUS_FINAL.md`
- `ONLINE_TESTING_GUIDE.md`
- `WIDGET_INTEGRATION.md`

### Archivos de Testing HTML
- `debug-widget.html`
- `online-test.html`
- `simple-integration-example.html`
- `test-complete.html`
- `test-definition.html`
- `test-final-umd-vercel.html`
- `test-final.html`
- `test-force.html`
- `test-from-vercel.html`
- `test-local-widget.html`
- `test-simple.html`
- `test-styles-fix.html`
- `test-styles.html`
- `test-umd-fix.html`
- `test-vercel-final.html`
- `test-vercel-fixed.html`
- `test-widget.html`
- `widget-example.html`
- `widget-test.html`

### Archivos Duplicados
- `vite.widget.config.js` (duplicado, mantenemos `vite.widget-umd.config.js`)
- `src/widget-clean.js` (versión duplicada de `src/widget.js`)

### Carpeta de Ejemplos
- `integration-examples/` (carpeta completa con ejemplos de integración)

## 🎯 Scripts de Build Actualizados

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build && vite build --config vite.widget-umd.config.js",
    "build:widget": "vite build --config vite.widget-umd.config.js",
    "build:app": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

## ✅ Estado Post-Limpieza

- **0 errores de linting** - Código limpio y consistente
- **Build funcionando** - Ambos builds (app y widget) operativos
- **Estructura coherente** - Solo archivos necesarios para funcionamiento
- **Documentación consolidada** - README.md y PROJECT_STRUCTURE.md
- **UMD Widget funcional** - `segurbot-widget.umd.cjs` generado correctamente

## 🚀 Funcionalidades Mantenidas

✅ **Aplicación React principal** - Funcionando completamente  
✅ **Widget UMD standalone** - Para integración externa  
✅ **Soporte móvil completo** - Teclado virtual, layout responsive  
✅ **Debug panel móvil** - Carga lazy para desarrollo  
✅ **Hooks personalizados** - useChat, useViewport, useVirtualKeyboard  
✅ **Componentes optimizados** - ChatBot, ChatMessage, ChatInput, etc.  
✅ **Build production-ready** - Minificado y optimizado  

El proyecto está ahora **limpio, organizado y listo para análisis/desarrollo**.
