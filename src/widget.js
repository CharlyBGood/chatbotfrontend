import React from 'react'
import { createRoot } from 'react-dom/client'
import { SegurBot } from './components/SegurBot'
import './index.css'

class SegurBotWidget {
  constructor(options = {}) {
    this.options = {
      // Configuración por defecto
      apiUrl: options.apiUrl || 'http://localhost:8080/api/chat',
      containerId: options.containerId || 'segurbot-widget',
      initialMessage: options.initialMessage || '¡Hola! Soy SegurBot, tu asistente virtual de seguros. ¿En qué puedo ayudarte hoy?',
      title: options.title || 'SegurBot - Asistente Virtual',
      theme: options.theme || {},
      autoOpen: options.autoOpen !== false, // Por defecto abierto
      position: options.position || 'bottom-right', // bottom-right, bottom-left, etc.
      enableDebug: options.enableDebug || false,
      width: options.width || '400px',
      height: options.height || '600px',
      ...options
    }
    
    this.isOpen = this.options.autoOpen
    this.container = null
    this.root = null
    this.initialized = false
  }

  // Inicializar el widget
  init() {
    if (this.initialized) {
      console.warn('SegurBot Widget ya está inicializado')
      return
    }

    this.createContainer()
    this.injectStyles()
    this.renderWidget()
    this.initialized = true
    
    console.log('✅ SegurBot Widget inicializado correctamente')
  }

  // Crear el contenedor del widget
  createContainer() {
    // Buscar contenedor existente o crear uno nuevo
    this.container = document.getElementById(this.options.containerId)
    
    if (!this.container) {
      this.container = document.createElement('div')
      this.container.id = this.options.containerId
      document.body.appendChild(this.container)
    }

    // Aplicar estilos de posicionamiento
    this.applyContainerStyles()
  }
  // Aplicar estilos al contenedor
  applyContainerStyles() {
    // NO aplicar estilos de posicionamiento al container principal
    // porque SegurBot maneja su propio posicionamiento del botón flotante
    this.container.style.position = 'relative'
    this.container.style.zIndex = '1'
    this.container.style.width = 'auto'
    this.container.style.height = 'auto'
  }

  // Obtener estilos de posición según configuración
  getPositionStyles() {
    const offset = '20px'
    
    switch (this.options.position) {
      case 'bottom-right':
        return { bottom: offset, right: offset }
      case 'bottom-left':
        return { bottom: offset, left: offset }
      case 'top-right':
        return { top: offset, right: offset }
      case 'top-left':
        return { top: offset, left: offset }
      case 'center':
        return { 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: 'min(90vw, ' + this.options.width + ')',
          height: 'min(90vh, ' + this.options.height + ')'
        }
      default:
        return { bottom: offset, right: offset }
    }
  }  // Inyectar estilos CSS necesarios
  injectStyles() {
    const existingStyles = document.getElementById('segurbot-widget-styles')
    if (existingStyles) return

    const styleSheet = document.createElement('style')
    styleSheet.id = 'segurbot-widget-styles'
    styleSheet.textContent = `
      /* Define Tailwind CSS custom colors used by SegurBot */
      :root {
        --color-Blue: #253878;
        --color-bgDarkBlue: #03070f;
        --color-Black: rgba(3, 7, 15, 0.81);
        --color-justGray: #7a7a7a;
        --color-blueGray: #d3dde6;
        --color-lightBlue: #44b0de;
        --color-lightBlueHover: #3a9ecb;
        --color-Golden: #f7d16e;
      }

      /* Essential Tailwind utility classes for SegurBot */
      .bg-bgDarkBlue { background-color: var(--color-bgDarkBlue) !important; }
      .hover\\:bg-Black:hover { background-color: var(--color-Black) !important; }
      .bg-Black { background-color: var(--color-Black) !important; }
      .text-lightBlue { color: var(--color-lightBlue) !important; }
      .hover\\:text-lightBlueHover:hover { color: var(--color-lightBlueHover) !important; }
      .border-lightBlue { border-color: var(--color-lightBlue) !important; }
      .text-justGray { color: var(--color-justGray) !important; }      /* Essential positioning and display utilities */
      .fixed { position: fixed !important; }
      .z-40 { z-index: 40 !important; }
      .z-50 { z-index: 50 !important; }
      .bottom-16 { bottom: 4rem !important; }
      .bottom-10 { bottom: 2.5rem !important; }
      .right-4 { right: 1rem !important; }
      .right-6 { right: 1.5rem !important; }
      .right-12 { right: 3rem !important; }
      .p-2 { padding: 0.5rem !important; }
      .p-3 { padding: 0.75rem !important; }
      .rounded-full { border-radius: 50% !important; }
      .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; }
      .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important; }
      .border-4 { border-width: 4px !important; }
      .cursor-pointer { cursor: pointer !important; }
      .opacity-0 { opacity: 0 !important; }
      .opacity-100 { opacity: 1 !important; }
      .translate-y-0 { transform: translateY(0px) !important; }
      .translate-y-10 { transform: translateY(2.5rem) !important; }
      .scale-100 { transform: scale(1) !important; }
      .scale-110 { transform: scale(1.1) !important; }
      .transition-all { transition-property: all !important; transition-duration: 1000ms !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; }
      .duration-1000 { transition-duration: 1000ms !important; }
      .ease-in-out { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; }
      .transform { /* Handled by individual transform classes */ }
      .text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
      .flex { display: flex !important; }
      .flex-col { flex-direction: column !important; }
      .w-80 { width: 20rem !important; }
      .w-96 { width: 24rem !important; }
      .h-\\[32em\\] { height: 32em !important; }
      .min-h-0 { min-height: 0px !important; }

      /* Special Tailwind arbitrary value classes */
      .drop-shadow-\\[0_0_6px_\\#44b0de99\\] { 
        filter: drop-shadow(0 0 6px rgba(68, 176, 222, 0.6)) !important; 
      }

      /* Floating button specific styles - Override any conflicting styles */
      #${this.options.containerId} button[aria-label*="chat"] {
        position: fixed !important;
        z-index: 9999 !important;
        bottom: 1.5rem !important;
        right: 1rem !important;
        background-color: var(--color-bgDarkBlue) !important;
        color: var(--color-lightBlue) !important;
        border: 4px solid var(--color-lightBlue) !important;
        border-radius: 50% !important;
        padding: 0.75rem !important;
        width: auto !important;
        height: auto !important;
        min-width: 3.5rem !important;
        min-height: 3.5rem !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        filter: drop-shadow(0 0 6px rgba(68, 176, 222, 0.6)) !important;
        transition: all 1000ms cubic-bezier(0.4, 0, 0.2, 1) !important;
        visibility: visible !important;
        opacity: 1 !important;
        transform: translateY(0px) scale(1) !important;
      }

      #${this.options.containerId} button[aria-label*="chat"]:hover {
        background-color: var(--color-Black) !important;
        color: var(--color-lightBlueHover) !important;
        transform: translateY(0px) scale(1.1) !important;
      }

      /* Chat window positioning */
      #${this.options.containerId} .fixed.bottom-25 {
        position: fixed !important;
        bottom: 6.25rem !important;
        right: 3rem !important;
        z-index: 50 !important;
      }/* Widget container specific styles */
      #${this.options.containerId} {
        /* Minimal container styles - let SegurBot handle positioning */
        font-family: 'Federo', sans-serif;
        position: relative;
        width: auto;
        height: auto;
        z-index: 1;
      }

      /* Special drop shadow effect for the floating button */
      #${this.options.containerId} button[aria-label*="chat"] {
        filter: drop-shadow(0 0 6px rgba(68, 176, 222, 0.6));
      }

      /* Responsive for mobile */
      @media (max-width: 640px) {
        .sm\\:bottom-10 { bottom: 2.5rem !important; }
        .sm\\:right-6 { right: 1.5rem !important; }
        .sm\\:p-3 { padding: 0.75rem !important; }
        .sm\\:w-96 { width: 24rem !important; }
      }

      /* Responsive para móviles */
      @media (max-width: 768px) {
        #${this.options.containerId} {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          border-radius: 0 !important;
          transform: none !important;
        }
        
        #${this.options.containerId}.widget-closed {
          transform: translateY(100%);
        }
        
        #${this.options.containerId}.widget-open {
          transform: translateY(0);
        }
      }
    `
    
    document.head.appendChild(styleSheet)
  }  // Renderizar el widget React
  renderWidget() {
    if (!this.container) return

    console.log('🔧 Renderizando SegurBot en container:', this.container.id)
    
    this.root = createRoot(this.container)
    this.root.render(
      React.createElement(SegurBot, {
        apiUrl: this.options.apiUrl,
        initialMessage: this.options.initialMessage,
        title: this.options.title,
        enableDebug: this.options.enableDebug
      })
    )

    // Verificar después de renderizar
    setTimeout(() => {
      console.log('📋 Estado después de renderizar:')
      console.log('- Container children:', this.container.children.length)
      console.log('- Container HTML:', this.container.innerHTML.substring(0, 200))
      const button = this.container.querySelector('[aria-label*="chat"]')
      console.log('- Botón encontrado:', !!button)
      if (button) {
        const styles = window.getComputedStyle(button)
        console.log('- Botón visible:', styles.display !== 'none' && styles.visibility !== 'hidden' && parseFloat(styles.opacity) > 0)
      }
    }, 1000)
  }
  // Abrir el widget (ahora delega a SegurBot)
  open() {
    if (!this.initialized) {
      console.warn('Widget no está inicializado. Llama a init() primero.')
      return
    }
    
    // Buscar el botón flotante y hacer clic para abrir
    const button = this.container.querySelector('[aria-label*="chat"]')
    if (button && button.getAttribute('aria-label').includes('Abrir')) {
      button.click()
    }
  }

  // Cerrar el widget (ahora delega a SegurBot)
  close() {
    // Buscar el botón flotante y hacer clic para cerrar
    const button = this.container.querySelector('[aria-label*="chat"]')
    if (button && button.getAttribute('aria-label').includes('Cerrar')) {
      button.click()
    }
  }

  // Toggle del widget (ahora delega a SegurBot)
  toggle() {
    const button = this.container.querySelector('[aria-label*="chat"]')
    if (button) {
      button.click()
    }
  }
  // Re-renderizar el widget
  rerender() {
    if (this.root) {
      this.root.render(
        React.createElement(SegurBot, {
          apiUrl: this.options.apiUrl,
          initialMessage: this.options.initialMessage,
          title: this.options.title,
          // NO pasar 'open' para permitir que SegurBot maneje su propio estado
          enableDebug: this.options.enableDebug,
          theme: this.options.theme
        })
      )
    }
  }

  // Destruir el widget
  destroy() {
    if (this.root) {
      this.root.unmount()
      this.root = null
    }
    
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
    }
    
    // Remover estilos
    const styles = document.getElementById('segurbot-widget-styles')
    if (styles) {
      styles.remove()
    }
    
    this.initialized = false
    console.log('🗑️ SegurBot Widget destruido')
  }

  // Cambiar configuración
  updateConfig(newOptions) {
    this.options = { ...this.options, ...newOptions }
    this.applyContainerStyles()
    this.rerender()
  }
}

// Función de inicialización global
window.SegurBotWidget = SegurBotWidget

// Auto-inicialización si hay configuración global o data-attributes
if (window.SegurBotConfig) {
  const widget = new SegurBotWidget(window.SegurBotConfig)
  widget.init()
  window.segurBotWidget = widget
}

// NUEVA FUNCIONALIDAD: Auto-detección desde script tag
document.addEventListener('DOMContentLoaded', function() {
  // Buscar el script tag que cargó este widget
  const scriptTag = document.querySelector('script[src*="segurbot-widget"]')
  
  if (scriptTag && !window.segurBotWidget) {
    // Extraer configuración de data-attributes
    const config = {
      apiUrl: scriptTag.dataset.apiUrl || scriptTag.getAttribute('data-api-url'),
      title: scriptTag.dataset.title || scriptTag.getAttribute('data-title') || 'SegurBot',
      initialMessage: scriptTag.dataset.message || scriptTag.getAttribute('data-message') || '¡Hola! ¿En qué puedo ayudarte?',
      position: scriptTag.dataset.position || scriptTag.getAttribute('data-position') || 'bottom-right',
      autoOpen: (scriptTag.dataset.autoOpen || scriptTag.getAttribute('data-auto-open')) === 'true',
      enableDebug: (scriptTag.dataset.debug || scriptTag.getAttribute('data-debug')) === 'true'
    }
    
    // Solo inicializar si hay apiUrl
    if (config.apiUrl) {
      const widget = new SegurBotWidget(config)
      widget.init()
      window.segurBotWidget = widget
      
      console.log('✅ SegurBot Widget auto-inicializado desde script tag')
    } else {
      console.warn('⚠️ SegurBot: data-api-url es requerido para auto-inicialización')
    }
  }
})

// Exportar para uso como módulo
export default SegurBotWidget
