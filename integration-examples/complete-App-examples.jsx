// src/App.jsx - Ejemplos de uso
import { SegurBotWidget } from './components/SegurBotWidget';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-800">Mi Sitio Web</h1>
      </header>
      
      <main className="container mx-auto p-6">
        <div className="space-y-8">
          
          {/* EJEMPLO 1: Widget básico con botón por defecto */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">1. Widget Básico</h2>
            <p className="text-gray-600 mb-4">Widget con configuración por defecto:</p>
            
            <SegurBotWidget
              apiUrl="https://tu-api.com/api/chat" // 🔴 CAMBIAR AQUÍ
              buttonText="Abrir Soporte"
            />
          </section>

          {/* EJEMPLO 2: Widget personalizado */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">2. Widget Personalizado</h2>
            <p className="text-gray-600 mb-4">Widget con configuración personalizada:</p>
            
            <SegurBotWidget
              apiUrl="https://tu-api.com/api/chat" // 🔴 CAMBIAR AQUÍ
              position="bottom-left"
              initialMessage="¡Bienvenido a nuestra empresa! ¿Cómo te podemos ayudar hoy?"
              title="Asistente de Ventas"
              width="450px"
              height="650px"
              buttonText="Contactar Ventas"
              className="inline-block"
            />
          </section>

          {/* EJEMPLO 3: Widget con render prop (control total) */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">3. Control Personalizado</h2>
            <p className="text-gray-600 mb-4">Usando render prop para control total:</p>
            
            <SegurBotWidget
              apiUrl="https://tu-api.com/api/chat" // 🔴 CAMBIAR AQUÍ
              position="center"
              title="Soporte Técnico"
              initialMessage="👋 ¡Hola! Soy tu asistente técnico. ¿Tienes algún problema que pueda ayudarte a resolver?"
            >
              {({ isLoaded, isOpen, open, close, toggle }) => (
                <div className="flex gap-3">
                  <button 
                    onClick={open}
                    disabled={!isLoaded}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    {isLoaded ? '🚀 Abrir Soporte' : '⏳ Cargando...'}
                  </button>
                  
                  {isOpen && (
                    <button 
                      onClick={close}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      ❌ Cerrar
                    </button>
                  )}
                  
                  <button 
                    onClick={toggle}
                    disabled={!isLoaded}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    🔄 Toggle
                  </button>
                </div>
              )}
            </SegurBotWidget>
          </section>

          {/* EJEMPLO 4: Integrado en un componente complejo */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">4. Integración Avanzada</h2>
            <ContactSection />
          </section>

          {/* EJEMPLO 5: Widget flotante siempre visible */}
          <SegurBotWidget
            apiUrl="https://tu-api.com/api/chat" // 🔴 CAMBIAR AQUÍ
            position="bottom-right"
            autoOpen={false}
            buttonText="💬 Chat"
            className="fixed bottom-4 right-4 z-50"
          />
          
        </div>
      </main>
    </div>
  );
}

// Componente ejemplo de integración avanzada
function ContactSection() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-3">¿Necesitas Ayuda?</h3>
      <p className="mb-4">Nuestro equipo está aquí para ayudarte 24/7</p>
      
      <div className="flex gap-3">
        <button className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors">
          📧 Email
        </button>
        
        <button className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors">
          📞 Teléfono
        </button>
        
        {/* Widget integrado en el diseño */}
        <SegurBotWidget
          apiUrl="https://tu-api.com/api/chat" // 🔴 CAMBIAR AQUÍ
          position="center"
          title="Soporte en Vivo"
          initialMessage="¡Hola! Has llegado desde la sección de contacto. ¿En qué puedo ayudarte específicamente?"
        >
          {({ isLoaded, open }) => (
            <button 
              onClick={open}
              disabled={!isLoaded}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-semibold transition-colors disabled:opacity-50"
            >
              💬 Chat en Vivo
            </button>
          )}
        </SegurBotWidget>
      </div>
    </div>
  );
}

export default App;
