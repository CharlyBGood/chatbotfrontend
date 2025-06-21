# 🌐 Guía para Probar SegurBot Widget Online

## 🚀 Pasos para Probar en Vercel

### 1. **Commit y Push a GitHub**
```bash
git add .
git commit -m "Add SegurBot widget for online testing"
git push origin main
```

### 2. **Verificar el Deploy en Vercel**
1. Ve a tu [Dashboard de Vercel](https://vercel.com/dashboard)
2. Busca tu proyecto `botfrontend`
3. Verifica que el último deploy sea exitoso
4. Copia la URL de tu proyecto (ej: `https://tu-proyecto-abc123.vercel.app`)

### 3. **Verificar que el Widget está Disponible**
Abre en tu navegador:
```
https://TU-URL-VERCEL.vercel.app/segurbot-widget.umd.js
```

**✅ Debería mostrarte el archivo JavaScript del widget**  
**❌ Si da 404, verifica que el build fue correcto**

### 4. **Probar el Widget Online**

#### Opción A: Desde tu propia app desplegada
Tu app principal en Vercel ya tiene el widget incluido localmente.
Visita: `https://TU-URL-VERCEL.vercel.app`

#### Opción B: Crear una página de prueba externa
Crea un archivo HTML en cualquier lugar con:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Prueba SegurBot Widget</title>
</head>
<body>
  <h1>🧪 Probando SegurBot desde Vercel</h1>
  
  <!-- REEMPLAZA CON TU URL REAL -->
  <script 
    src="https://TU-URL-VERCEL.vercel.app/segurbot-widget.umd.js"
    data-api-url="https://tu-backend.com/api/chat"
    data-title="SegurBot Online"
    data-message="¡Funcionando desde Vercel! 🚀"
  ></script>
</body>
</html>
```

### 5. **Solución de Problemas**

#### ❌ Widget no carga
1. **Verifica la URL**: Asegúrate de que `/segurbot-widget.umd.js` responda
2. **Revisa la consola**: Abre DevTools (F12) y busca errores
3. **Verifica CORS**: Tu backend debe permitir tu dominio de Vercel

#### ❌ Error de CORS
Agrega tu dominio de Vercel a tu backend:
```javascript
// Express.js ejemplo
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://tu-proyecto.vercel.app'  // ← Agregar esto
  ]
}));
```

#### ❌ API no responde
1. Verifica que tu backend esté funcionando
2. Asegúrate de que la URL en `data-api-url` sea correcta
3. Prueba la API directamente con Postman/curl

## 🔧 URLs de Ejemplo

### Tu Widget estará disponible en:
```
https://tu-proyecto.vercel.app/segurbot-widget.umd.js
```

### Para usar en otros sitios:
```html
<script 
  src="https://tu-proyecto.vercel.app/segurbot-widget.umd.js"
  data-api-url="https://tu-backend.herokuapp.com/api/chat"
  data-title="Mi Asistente"
></script>
```

## 📊 Verificación Final

Una vez que funcione online, tendrás:

✅ **Widget funcionando desde CDN**  
✅ **Integración con 1 línea de código**  
✅ **Disponible para cualquier sitio web**  
✅ **Diseño original preservado**  

## 🎯 Próximo Paso: CDN Real

Una vez verificado que funciona desde Vercel, puedes:

1. **Usar Vercel como CDN temporal** (funciona perfectamente)
2. **Subir a jsDelivr** (CDN gratuito para GitHub)
3. **Usar tu propio CDN** (AWS CloudFront, etc.)

### CDN con jsDelivr (Automático)
Si tu repo es público en GitHub:
```html
<script src="https://cdn.jsdelivr.net/gh/TU-USUARIO/TU-REPO@main/dist/segurbot-widget.umd.js"></script>
```

---

**¡Vercel funciona perfectamente como CDN para el widget!** 🎉
