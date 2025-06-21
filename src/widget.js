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
    const styles = {
      position: 'fixed',
      zIndex: '9999',
      width: this.options.width,
      height: this.options.height,
      transition: 'all 0.3s ease',
      ...this.getPositionStyles()
    }

    Object.assign(this.container.style, styles)
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
  }
  // Inyectar estilos CSS necesarios
  injectStyles() {
    const existingStyles = document.getElementById('segurbot-widget-styles')
    if (existingStyles) return

    const styleSheet = document.createElement('style')
    styleSheet.id = 'segurbot-widget-styles'
    styleSheet.textContent = `
      #${this.options.containerId} {
        font-family: 'Federo', sans-serif;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        overflow: hidden;
        background: #03070f;
        /* Preservar el diseño original de SegurBot */
        position: relative;
      }
      
      #${this.options.containerId}.widget-closed {
        transform: scale(0);
        opacity: 0;
        pointer-events: none;
      }
      
      #${this.options.containerId}.widget-open {
        transform: scale(1);
        opacity: 1;
        pointer-events: all;
      }

      /* El botón launcher de SegurBot se mantiene como está definido originalmente */
      #${this.options.containerId} .launcher-button {
        /* No sobreescribir estilos del botón original */
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
  }
  // Renderizar el widget React
  renderWidget() {
    if (!this.container) return

    this.root = createRoot(this.container)
    this.root.render(
      React.createElement(SegurBot, {
        apiUrl: this.options.apiUrl,
        initialMessage: this.options.initialMessage,
        title: this.options.title,
        open: this.isOpen,
        enableDebug: this.options.enableDebug,
        onClose: () => this.close()
      })
    )

    // Aplicar clase inicial
    this.container.className = this.isOpen ? 'widget-open' : 'widget-closed'
  }

  // Abrir el widget
  open() {
    if (!this.initialized) {
      console.warn('Widget no está inicializado. Llama a init() primero.')
      return
    }
    
    this.isOpen = true
    this.container.className = 'widget-open'
    this.rerender()
  }

  // Cerrar el widget
  close() {
    this.isOpen = false
    this.container.className = 'widget-closed'
    this.rerender()
  }

  // Toggle del widget
  toggle() {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
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
          open: this.isOpen,
          enableDebug: this.options.enableDebug,
          onClose: () => this.close(),
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
