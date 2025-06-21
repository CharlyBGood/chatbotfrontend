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
      enableDebug: options.enableDebug || false,
      ...options
    }
    
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
    this.injectMinimalStyles()
    this.renderWidget()
    this.initialized = true
    
    console.log('✅ SegurBot Widget inicializado correctamente')
  }

  // Crear el contenedor del widget
  createContainer() {
    this.container = document.getElementById(this.options.containerId)
    
    if (!this.container) {
      this.container = document.createElement('div')
      this.container.id = this.options.containerId
      document.body.appendChild(this.container)
    }
  }

  // Inyectar solo estilos mínimos necesarios
  injectMinimalStyles() {
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

      /* Widget container - minimal styling */
      #${this.options.containerId} {
        font-family: 'Federo', sans-serif;
      }
    `
    
    document.head.appendChild(styleSheet)
  }

  // Renderizar el widget React
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
      const button = this.container.querySelector('[aria-label*="chat"]')
      console.log('- Botón encontrado:', !!button)
      if (button) {
        const styles = window.getComputedStyle(button)
        console.log('- Botón visible:', styles.display !== 'none' && styles.visibility !== 'hidden' && parseFloat(styles.opacity) > 0)
        console.log('- Clases del botón:', button.className)
      }
    }, 1000)
  }

  // Abrir el widget (delega a SegurBot)
  open() {
    if (!this.initialized) {
      console.warn('Widget no está inicializado. Llama a init() primero.')
      return
    }
    
    const button = this.container.querySelector('[aria-label*="chat"]')
    if (button && button.getAttribute('aria-label').includes('Abrir')) {
      button.click()
    }
  }

  // Cerrar el widget (delega a SegurBot)
  close() {
    const button = this.container.querySelector('[aria-label*="chat"]')
    if (button && button.getAttribute('aria-label').includes('Cerrar')) {
      button.click()
    }
  }

  // Toggle del widget (delega a SegurBot)
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
    this.rerender()
  }
}

// Función de inicialización global
window.SegurBotWidget = SegurBotWidget

// Auto-inicialización si hay configuración global
if (window.SegurBotConfig) {
  const widget = new SegurBotWidget(window.SegurBotConfig)
  widget.init()
  window.segurBotWidget = widget
}

// Auto-detección desde script tag
document.addEventListener('DOMContentLoaded', function() {
  const scriptTag = document.querySelector('script[src*="segurbot-widget"]')
  
  if (scriptTag && !window.segurBotWidget) {
    const config = {
      apiUrl: scriptTag.dataset.apiUrl || scriptTag.getAttribute('data-api-url'),
      title: scriptTag.dataset.title || scriptTag.getAttribute('data-title') || 'SegurBot',
      initialMessage: scriptTag.dataset.message || scriptTag.getAttribute('data-message') || '¡Hola! ¿En qué puedo ayudarte?',
      enableDebug: (scriptTag.dataset.debug || scriptTag.getAttribute('data-debug')) === 'true'
    }
    
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
