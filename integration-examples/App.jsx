// App.jsx
import { SegurBotWidget } from './components/SegurBotWidget';

function App() {
  return (
    <div className="App">
      {/* Tu contenido normal */}
      <header>
        <h1>Mi Sitio Web</h1>
      </header>
      
      <main>
        <p>Contenido de tu sitio...</p>
        
        {/* Ejemplo con botón personalizado */}
        <SegurBotWidget
          apiUrl="https://tu-backend.com/api/chat"
          initialMessage="¡Bienvenido a mi empresa! ¿Cómo te puedo ayudar?"
        >
          {({ isLoaded, isOpen, toggle }) => (
            <button 
              onClick={toggle}
              disabled={!isLoaded}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {isOpen ? 'Cerrar' : 'Abrir'} Soporte
            </button>
          )}
        </SegurBotWidget>
      </main>
      
      {/* Widget con botón por defecto */}
      <SegurBotWidget 
        apiUrl="https://tu-backend.com/api/chat"
        position="bottom-left"
      />
    </div>
  );
}

export default App;
