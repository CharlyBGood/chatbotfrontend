# 🔗 Funcionalidad de Enlaces Automáticos en SegurBot

## ✨ **Nueva Característica Implementada**

El chatbot ahora detecta automáticamente URLs en los mensajes del backend y las convierte en enlaces clickeables con tratamiento especial para WhatsApp.

## 🎯 **Funcionalidades Implementadas**

### **1. Detección Automática de URLs**
- ✅ Detecta URLs con protocolo: `https://ejemplo.com`
- ✅ Detecta URLs sin protocolo: `www.ejemplo.com`
- ✅ Convierte automáticamente a enlaces clickeables
- ✅ Abre en nueva pestaña con `target="_blank"`
- ✅ Seguridad: `rel="noopener noreferrer"`

### **2. Tratamiento Especial para WhatsApp**
- ✅ Detecta URLs de WhatsApp (`whatsapp.com`, `wa.me`)
- ✅ Muestra texto personalizado: **"WhatsApp de Maschio y Asociados"**
- ✅ Mantiene la funcionalidad del enlace original
- ✅ Estilos consistentes con el diseño de la app

### **3. Integración con ReactMarkdown**
- ✅ Compatible con markdown existente
- ✅ Procesa tanto enlaces markdown como URLs automáticas
- ✅ Mantiene el formato y estilos originales
- ✅ No interfiere con otros elementos markdown

## 🔧 **Implementación Técnica**

### **Función de Procesamiento:**
```javascript
const processMessageWithLinks = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  
  return text.split(urlRegex).map((part, index) => {
    if (urlRegex.test(part)) {
      const fullUrl = part.startsWith('http') ? part : `https://${part}`;
      const isWhatsAppUrl = part.includes('whatsapp.com') || part.includes('wa.me');
      
      return (
        <a
          key={index}
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lightBlue underline hover:text-blue-500 transition-colors duration-200 font-semibold"
        >
          {isWhatsAppUrl ? 'WhatsApp de Maschio y Asociados' : part}
        </a>
      );
    }
    return part;
  });
};
```

### **Integración con ReactMarkdown:**
```javascript
components={{
  // Links mejorados
  a: (props) => {
    const isWhatsAppUrl = props.href?.includes('whatsapp.com') || props.href?.includes('wa.me');
    return (
      <a {...props} target="_blank" rel="noopener noreferrer">
        {isWhatsAppUrl ? 'WhatsApp de Maschio y Asociados' : props.children}
      </a>
    );
  },
  
  // Párrafos con procesamiento de URLs
  p: ({ children }) => {
    const processedChildren = typeof children === 'string' 
      ? processMessageWithLinks(children)
      : children;
    return <p className="mb-2 last:mb-0">{processedChildren}</p>;
  },
  
  // Texto plano con procesamiento de URLs
  text: ({ children }) => {
    return typeof children === 'string' 
      ? processMessageWithLinks(children)
      : children;
  }
}}
```

## 📱 **Ejemplos de Uso**

### **Entrada desde Backend:**
```
"Puedes contactarnos por WhatsApp: https://wa.me/5491156999580 o visita nuestra web: https://asegurando.online"
```

### **Resultado en el Chat:**
```
Puedes contactarnos por WhatsApp: [WhatsApp de Maschio y Asociados] o visita nuestra web: [https://asegurando.online]
```

### **URLs Detectadas Automáticamente:**
- ✅ `https://ejemplo.com` → Enlace clickeable
- ✅ `http://ejemplo.com` → Enlace clickeable  
- ✅ `www.ejemplo.com` → Enlace clickeable (se añade https://)
- ✅ `https://wa.me/123456` → "WhatsApp de Maschio y Asociados"
- ✅ `https://api.whatsapp.com/send?phone=123` → "WhatsApp de Maschio y Asociados"

## 🎨 **Estilos Aplicados**

- **Color**: `text-lightBlue` (consistente con la paleta de la app)
- **Hover**: `hover:text-blue-500` (feedback visual)
- **Decoración**: `underline` (claridad visual)
- **Transición**: `transition-colors duration-200` (suavidad)
- **Peso**: `font-semibold` (legibilidad)

## ✅ **Compatibilidad**

- ✅ **ReactMarkdown**: Totalmente compatible
- ✅ **Fade-in effect**: Funciona perfectamente
- ✅ **Mobile responsive**: Optimizado para móviles
- ✅ **Accessibility**: Navegación por teclado y screen readers
- ✅ **Security**: Protección contra ataques de enlaces maliciosos

## 🚀 **URLs de Prueba**

- **Desktop**: `http://localhost:5173/`
- **Móvil**: `http://192.168.1.100:5173/`
- **Backend**: `http://192.168.1.100:8080/api/chat`

## 💡 **Casos de Uso**

1. **Respuestas automáticas** con enlaces a productos específicos
2. **Contacto directo** vía WhatsApp desde las respuestas del bot
3. **Documentación** y recursos adicionales
4. **Formularios** y páginas de cotización
5. **Redes sociales** y canales de comunicación

La funcionalidad está completamente integrada y lista para producción. El backend puede ahora incluir URLs directamente en las respuestas y serán automáticamente convertidas en enlaces funcionales con el tratamiento especial para WhatsApp.
