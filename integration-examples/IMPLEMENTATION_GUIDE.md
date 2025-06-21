# 🚀 Guía de Implementación - SegurBot Widget en React

## ✅ Checklist de Implementación

### 1. Preparación del Proyecto

```bash
# En tu proyecto Vite/React
cd tu-proyecto

# Crear las carpetas necesarias
mkdir -p src/hooks src/components src/styles

# Copiar el archivo del widget (desde el proyecto SegurBot)
cp /path/to/segurbot/dist/segurbot-widget.umd.js public/segurbot-widget.js
```

### 2. Archivos a Crear

- ✅ `src/hooks/useSegurBot.js` - Hook personalizado
- ✅ `src/components/SegurBotWidget.jsx` - Componente wrapper  
- ✅ `src/styles/segurbot-widget.css` - Estilos (opcional)
- ✅ `src/types/segurbot.d.ts` - TypeScript types (opcional)

### 3. Configuración Básica

```jsx
// App.jsx
import { SegurBotWidget } from './components/SegurBotWidget';

function App() {
  return (
    <div>
      {/* Tu contenido */}
      <h1>Mi Sitio Web</h1>
      
      {/* Widget básico */}
      <SegurBotWidget 
        apiUrl="https://TU-API.com/api/chat" // 🔴 CAMBIAR AQUÍ
        buttonText="Abrir Chat"
      />
    </div>
  );
}
```

## 🎯 Configuraciones de Ejemplo

### Configuración Básica
```jsx
<SegurBotWidget 
  apiUrl="https://mi-api.com/chat"
  buttonText="Soporte"
/>
```

### Configuración Avanzada
```jsx
<SegurBotWidget 
  apiUrl="https://mi-api.com/chat"
  position="bottom-left"
  title="Mi Asistente"
  initialMessage="¡Hola! ¿Cómo te puedo ayudar?"
  width="450px"
  height="650px"
  className="mi-clase-personalizada"
/>
```

### Control Programático
```jsx
<SegurBotWidget apiUrl="https://mi-api.com/chat">
  {({ isLoaded, isOpen, open, close, toggle }) => (
    <div>
      <button onClick={open} disabled={!isLoaded}>
        {isLoaded ? 'Abrir Chat' : 'Cargando...'}
      </button>
      {isOpen && (
        <button onClick={close}>Cerrar</button>
      )}
    </div>
  )}
</SegurBotWidget>
```

## 🔧 Configuración del Backend

Tu API debe aceptar:

```javascript
// POST /api/chat
{
  "messages": [
    {"role": "user", "content": "Hola"},
    {"role": "assistant", "content": "¡Hola! ¿Cómo estás?"}
  ],
  "sessionId": "uuid-generado"
}

// Respuesta esperada:
{
  "text": "Respuesta del bot"
}
```

## 🎨 Personalización de Estilos

```css
/* Personalizar el botón */
.segurbot-widget-button {
  background: linear-gradient(45deg, #your-color1, #your-color2) !important;
  border-radius: 25px !important;
}

/* Personalizar en móviles */
@media (max-width: 768px) {
  .segurbot-widget-button {
    width: 100%;
  }
}
```

## 🚨 Troubleshooting

### El widget no aparece
1. ✅ Verificar que el archivo `segurbot-widget.js` está en `public/`
2. ✅ Comprobar errores en la consola del navegador
3. ✅ Verificar que la API URL es correcta

### CORS Error
```javascript
// En tu backend (Express.js ejemplo)
app.use(cors({
  origin: ['http://localhost:5173', 'https://tu-dominio.com']
}));
```

### Widget no se carga
1. ✅ Verificar la ruta del script: `/segurbot-widget.js`
2. ✅ Comprobar que no hay conflictos con otros scripts
3. ✅ Verificar en Network tab que el archivo se descarga

## 📱 Responsive Design

El widget es automáticamente responsive:

- **Desktop**: Ventana flotante posicionable
- **Móvil**: Pantalla completa optimizada
- **Tablet**: Adaptación automática

## 🔍 Debug

```jsx
// Habilitar debug
<SegurBotWidget 
  apiUrl="https://mi-api.com/chat"
  enableDebug={true}
/>

// En la consola verás logs detallados
```

## 🚀 Deploy a Producción

1. **Build tu proyecto**:
   ```bash
   npm run build
   ```

2. **Verificar que `segurbot-widget.js` está en `dist/`**

3. **Configurar tu servidor web** para servir archivos estáticos

4. **Actualizar las URLs** de desarrollo a producción

## 📈 Mejores Prácticas

- ✅ **Lazy loading**: El widget se carga solo cuando es necesario
- ✅ **Error handling**: Manejo de errores incorporado
- ✅ **Performance**: Memoización y optimizaciones incluidas
- ✅ **Accesibilidad**: ARIA labels y navegación por teclado
- ✅ **SEO friendly**: No afecta el rendimiento inicial de la página

## 💡 Tips Adicionales

### Múltiples Widgets
```jsx
// Cada widget debe tener configuración única
<SegurBotWidget apiUrl="https://soporte.com/chat" position="bottom-right" />
<SegurBotWidget apiUrl="https://ventas.com/chat" position="bottom-left" />
```

### Integración con Estado Global
```jsx
// Con Context API, Redux, Zustand, etc.
const { user } = useAuth();

<SegurBotWidget 
  apiUrl="https://mi-api.com/chat"
  initialMessage={`¡Hola ${user.name}! ¿En qué puedo ayudarte?`}
/>
```

### Eventos Personalizados
```jsx
<SegurBotWidget apiUrl="https://mi-api.com/chat">
  {({ isOpen, open, close }) => {
    // Tracking de eventos
    const handleOpen = () => {
      analytics.track('ChatBot Opened');
      open();
    };
    
    return <button onClick={handleOpen}>Abrir Chat</button>;
  }}
</SegurBotWidget>
```

---

**¡Tu widget está listo para usar!** 🎉

Solo cambia `apiUrl` por tu endpoint real y ¡empieza a usar SegurBot en tu sitio web!
