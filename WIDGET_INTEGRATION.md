# 🤖 SegurBot Widget - Guía de Integración

Widget embebible de chatbot para fácil integración en cualquier sitio web.

## 🚀 Instalación Rápida

### 1. Construir el Widget
```bash
npm run build:widget
```

### 2. Integrar en tu Sitio Web
```html
<!-- Incluir el script -->
<script src="./dist/segurbot-widget.umd.js"></script>

<!-- Inicializar -->
<script>
  const widget = new SegurBotWidget({
    apiUrl: 'https://tu-api.com/api/chat'
  });
  widget.init();
</script>
```

## ⚙️ Configuraciones

### Configuración Básica
```javascript
const widget = new SegurBotWidget({
  apiUrl: 'https://tu-backend.com/api/chat', // ✅ REQUERIDO
  position: 'bottom-right',
  autoOpen: false
});
```

### Configuración Completa
```javascript
const widget = new SegurBotWidget({
  // 🔌 API Configuration
  apiUrl: 'https://tu-api.com/api/chat',
  
  // 🎨 Appearance
  position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left, center
  width: '400px',
  height: '600px',
  
  // 💬 Content
  initialMessage: '¡Hola! ¿En qué puedo ayudarte?',
  title: 'Mi Asistente',
  
  // 🛠️ Behavior
  autoOpen: true,
  containerId: 'custom-container',
  enableDebug: false
});
```

## 🎯 Posicionamiento

| Posición | Descripción |
|----------|-------------|
| `bottom-right` | Esquina inferior derecha (por defecto) |
| `bottom-left` | Esquina inferior izquierda |
| `top-right` | Esquina superior derecha |
| `top-left` | Esquina superior izquierda |
| `center` | Centro de la pantalla (modal) |

## 🎮 Control Programático

```javascript
// Inicializar
widget.init();

// Abrir/Cerrar
widget.open();
widget.close();
widget.toggle();

// Actualizar configuración
widget.updateConfig({
  position: 'center',
  width: '500px'
});

// Destruir
widget.destroy();
```

## 📱 Responsive Design

- **Desktop**: Ventana flotante posicionable
- **Móvil**: Pantalla completa optimizada
- **Tablet**: Adaptación automática
- **Teclado Virtual**: Ajuste dinámico del layout

## 🛠️ Integración por Framework

### React/Next.js
```jsx
import { useEffect } from 'react';

function MyApp() {
  useEffect(() => {
    const widget = new SegurBotWidget({
      apiUrl: process.env.NEXT_PUBLIC_CHAT_API
    });
    widget.init();
    
    return () => widget.destroy();
  }, []);
  
  return <div>Mi aplicación</div>;
}
```

### Vue.js
```vue
<template>
  <div>Mi aplicación Vue</div>
</template>

<script>
export default {
  mounted() {
    this.widget = new SegurBotWidget({
      apiUrl: process.env.VUE_APP_CHAT_API
    });
    this.widget.init();
  },
  
  beforeDestroy() {
    if (this.widget) {
      this.widget.destroy();
    }
  }
}
</script>
```

### WordPress
```html
<!-- En functions.php o directamente en el theme -->
<script src="path/to/segurbot-widget.umd.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    new SegurBotWidget({
      apiUrl: 'https://mi-api.com/chat'
    }).init();
  });
</script>
```

### Shopify
```liquid
<!-- En theme.liquid antes de </body> -->
<script src="{{ 'segurbot-widget.umd.js' | asset_url }}"></script>
<script>
  new SegurBotWidget({
    apiUrl: '{{ settings.chat_api_url }}',
    position: 'bottom-right'
  }).init();
</script>
```

## 🔧 API del Backend

El widget envía mensajes a tu endpoint con este formato:

```javascript
// POST a tu apiUrl
{
  "message": "Mensaje del usuario",
  "sessionId": "uuid-generado-automaticamente"
}

// Respuesta esperada
{
  "response": "Mensaje de respuesta del bot"
}
```

## 🎨 Personalización de Estilos

El widget incluye estilos encapsulados, pero puedes sobrescribirlos:

```css
/* Personalizar el contenedor principal */
#segurbot-widget {
  border-radius: 20px !important;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
}

/* Personalizar en móviles */
@media (max-width: 768px) {
  #segurbot-widget {
    border-radius: 0 !important;
  }
}
```

## 🔍 Debug y Desarrollo

```javascript
const widget = new SegurBotWidget({
  apiUrl: 'http://localhost:8080/api/chat',
  enableDebug: true // Habilita logs y panel de debug en móviles
});
```

## 📦 Archivos de Build

Después de `npm run build:widget`:

```
dist/
├── segurbot-widget.umd.js    # Para script tags
├── segurbot-widget.es.js     # Para módulos ES6
└── style.css                 # Estilos (incluidos en UMD)
```

## 🚨 Troubleshooting

### El widget no aparece
- ✅ Verificar que se incluye el script correctamente
- ✅ Comprobar errores en la consola del navegador
- ✅ Verificar que `apiUrl` es accesible

### Problemas de CORS
```javascript
// En tu backend, permitir el dominio:
res.header('Access-Control-Allow-Origin', 'https://tu-sitio.com');
```

### Widget no responsive en móviles
- ✅ Agregar meta viewport: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

## 📄 Licencia

Este widget está diseñado para el chatbot SegurBot de Maschio y Asociados.

---

**¿Necesitas ayuda?** Consulta `widget-example.html` para ver ejemplos interactivos.
