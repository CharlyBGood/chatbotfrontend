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
    this.detectAndResolveConflicts()
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
    // Primero intentar cargar el CSS externo
    this.loadExternalCSS()
    
    const existingStyles = document.getElementById('segurbot-widget-styles')
    if (existingStyles) return

    const styleSheet = document.createElement('style')
    styleSheet.id = 'segurbot-widget-styles'
    styleSheet.textContent = `      /* ========================================
         SEGURBOT WIDGET - ESTILOS ENCAPSULADOS
         Versión: 2.0 - Máxima Compatibilidad
         ======================================== */
        /* RESET SELECTIVO PARA EL WIDGET - Preservar funcionalidad interna */
      #${this.options.containerId} {
        box-sizing: border-box !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        background: transparent !important;
        position: relative !important;
        width: auto !important;
        height: auto !important;
        z-index: 1 !important;
      }
      
      /* Reset para elementos comunes que podrían causar conflictos */
      #${this.options.containerId} div,
      #${this.options.containerId} span,
      #${this.options.containerId} p,
      #${this.options.containerId} h1,
      #${this.options.containerId} h2,
      #${this.options.containerId} h3,
      #${this.options.containerId} button,
      #${this.options.containerId} input,
      #${this.options.containerId} textarea {
        box-sizing: border-box !important;
      }
      
      /* Reset específico para botones para evitar interferencias del sitio padre */
      #${this.options.containerId} button {
        all: unset !important;
        box-sizing: border-box !important;
        cursor: pointer !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      /* Variables CSS EXCLUSIVAS del widget - MÁXIMA PRIORIDAD */
      #${this.options.containerId} {
        /* Variables principales del widget */
        --segurbot-color-Blue: #253878 !important;
        --segurbot-color-bgDarkBlue: #03070f !important;
        --segurbot-color-Black: rgba(3, 7, 15, 0.81) !important;
        --segurbot-color-justGray: #7a7a7a !important;
        --segurbot-color-blueGray: #d3dde6 !important;
        --segurbot-color-lightBlue: #44b0de !important;
        --segurbot-color-lightBlueHover: #3a9ecb !important;
        --segurbot-color-Golden: #f7d16e !important;
        --segurbot-font-family: "Federo", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        
        /* Configuración base del contenedor */
        position: relative !important;
        width: auto !important;
        height: auto !important;
        z-index: 1 !important;
        font-family: var(--segurbot-font-family) !important;
        font-size: 15px !important;
        line-height: 1.5 !important;
        color: var(--segurbot-color-blueGray) !important;
      }

      /* ESTILOS PRINCIPALES DEL WIDGET - CON MÁXIMA ESPECIFICIDAD */
      
      /* Background colors */
      #${this.options.containerId} .bg-bgDarkBlue { 
        background-color: var(--segurbot-color-bgDarkBlue) !important; 
      }
      #${this.options.containerId} .hover\\:bg-Black:hover { 
        background-color: var(--segurbot-color-Black) !important; 
      }
      #${this.options.containerId} .bg-Black { 
        background-color: var(--segurbot-color-Black) !important; 
      }
      #${this.options.containerId} .bg-Blue { 
        background-color: var(--segurbot-color-Blue) !important; 
      }
      #${this.options.containerId} .bg-lightBlue { 
        background-color: var(--segurbot-color-lightBlue) !important; 
      }
      #${this.options.containerId} .hover\\:bg-lightBlueHover:hover { 
        background-color: var(--segurbot-color-lightBlueHover) !important; 
      }
      #${this.options.containerId} .bg-bgDarkBlue\\/10 { 
        background-color: rgba(3, 7, 15, 0.1) !important; 
      }
      #${this.options.containerId} .bg-bgDarkBlue\\/80 { 
        background-color: rgba(3, 7, 15, 0.8) !important; 
      }
      #${this.options.containerId} .bg-lightBlue\\/5 { 
        background-color: rgba(68, 176, 222, 0.05) !important; 
      }
      #${this.options.containerId} .bg-gray-100 { 
        background-color: #f3f4f6 !important; 
      }
      
      /* Text colors */
      #${this.options.containerId} .text-lightBlue { 
        color: var(--segurbot-color-lightBlue) !important; 
      }
      #${this.options.containerId} .hover\\:text-lightBlueHover:hover { 
        color: var(--segurbot-color-lightBlueHover) !important; 
      }
      #${this.options.containerId} .text-justGray { 
        color: var(--segurbot-color-justGray) !important; 
      }
      #${this.options.containerId} .text-blueGray { 
        color: var(--segurbot-color-blueGray) !important; 
      }
      #${this.options.containerId} .hover\\:text-lightBlue:hover { 
        color: var(--segurbot-color-lightBlue) !important; 
      }
      #${this.options.containerId} .hover\\:text-blue-500:hover { 
        color: #3b82f6 !important; 
      }
      
      /* Border colors */
      #${this.options.containerId} .border-lightBlue { 
        border-color: var(--segurbot-color-lightBlue) !important; 
      }
      #${this.options.containerId} .border-lightBlue\\/20 { 
        border-color: rgba(68, 176, 222, 0.2) !important; 
      }
      #${this.options.containerId} .border-lightBlue\\/30 { 
        border-color: rgba(68, 176, 222, 0.3) !important; 
      }
      #${this.options.containerId} .hover\\:border-lightBlue\\/60:hover { 
        border-color: rgba(68, 176, 222, 0.6) !important; 
      }
      #${this.options.containerId} .border-bgDarkBlue\\/20 { 
        border-color: rgba(3, 7, 15, 0.2) !important; 
      }
      #${this.options.containerId} .border-l-4 { 
        border-left-width: 4px !important; 
        border-left-style: solid !important;
      }
      #${this.options.containerId} .border-4 { 
        border-width: 4px !important; 
        border-style: solid !important;
      }
      #${this.options.containerId} .border { 
        border-width: 1px !important; 
        border-style: solid !important;
      }
        /* Text sizes y typography */
      #${this.options.containerId} .text-xl { 
        font-size: 1.25rem !important; 
        line-height: 1.75rem !important; 
      }
      #${this.options.containerId} .text-2xl { 
        font-size: 1.5rem !important; 
        line-height: 2rem !important; 
      }
      #${this.options.containerId} .text-3xl { 
        font-size: 1.875rem !important; 
        line-height: 2.25rem !important; 
      }
      #${this.options.containerId} .text-sm { 
        font-size: 0.875rem !important; 
        line-height: 1.25rem !important; 
      }
      #${this.options.containerId} .text-lg { 
        font-size: 1.125rem !important; 
        line-height: 1.75rem !important; 
      }
      #${this.options.containerId} .text-base { 
        font-size: 1rem !important; 
        line-height: 1.5rem !important; 
      }
      
      /* Font styles */
      #${this.options.containerId} .font-semibold { 
        font-weight: 600 !important; 
      }
      #${this.options.containerId} .font-bold { 
        font-weight: 700 !important; 
      }
      #${this.options.containerId} .font-mono { 
        font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace !important; 
      }
      #${this.options.containerId} .tracking-widest { 
        letter-spacing: 0.1em !important; 
      }
      #${this.options.containerId} .italic { 
        font-style: italic !important; 
      }
      #${this.options.containerId} .underline { 
        text-decoration: underline !important; 
      }
      
      /* Layout utilities */
      #${this.options.containerId} .flex { 
        display: flex !important; 
      }
      #${this.options.containerId} .flex-col { 
        flex-direction: column !important; 
      }
      #${this.options.containerId} .items-center { 
        align-items: center !important; 
      }
      #${this.options.containerId} .items-start { 
        align-items: flex-start !important; 
      }
      #${this.options.containerId} .items-end { 
        align-items: flex-end !important; 
      }
      #${this.options.containerId} .justify-center { 
        justify-content: center !important; 
      }
      #${this.options.containerId} .justify-start { 
        justify-content: flex-start !important; 
      }
      #${this.options.containerId} .justify-end { 
        justify-content: flex-end !important; 
      }
      #${this.options.containerId} .text-center { 
        text-align: center !important; 
      }
      #${this.options.containerId} .mx-auto { 
        margin-left: auto !important; 
        margin-right: auto !important; 
      }
      #${this.options.containerId} .gap-1 { 
        gap: 0.25rem !important; 
      }
      #${this.options.containerId} .gap-2 { 
        gap: 0.5rem !important; 
      }
      #${this.options.containerId} .inline-flex { 
        display: inline-flex !important; 
      }
      
      /* Spacing utilities */
      #${this.options.containerId} .p-1 { padding: 0.25rem !important; }
      #${this.options.containerId} .p-2 { padding: 0.5rem !important; }
      #${this.options.containerId} .p-3 { padding: 0.75rem !important; }
      #${this.options.containerId} .p-4 { padding: 1rem !important; }
      #${this.options.containerId} .px-1 { padding-left: 0.25rem !important; padding-right: 0.25rem !important; }
      #${this.options.containerId} .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
      #${this.options.containerId} .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
      #${this.options.containerId} .py-0\\.5 { padding-top: 0.125rem !important; padding-bottom: 0.125rem !important; }
      #${this.options.containerId} .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
      #${this.options.containerId} .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
      #${this.options.containerId} .pl-4 { padding-left: 1rem !important; }
      #${this.options.containerId} .mb-0 { margin-bottom: 0 !important; }
      #${this.options.containerId} .mb-1 { margin-bottom: 0.25rem !important; }
      #${this.options.containerId} .mb-2 { margin-bottom: 0.5rem !important; }
      #${this.options.containerId} .mt-1 { margin-top: 0.25rem !important; }
      #${this.options.containerId} .ml-1 { margin-left: 0.25rem !important; }
      #${this.options.containerId} .last\\:mb-0:last-child { margin-bottom: 0 !important; }
      #${this.options.containerId} .first\\:mt-0:first-child { margin-top: 0 !important; }
      
      /* Sizing - Comprehensive width and height utilities */
      #${this.options.containerId} .w-1 { width: 0.25rem !important; }
      #${this.options.containerId} .w-2 { width: 0.5rem !important; }
      #${this.options.containerId} .w-3 { width: 0.75rem !important; }
      #${this.options.containerId} .w-4 { width: 1rem !important; }
      #${this.options.containerId} .w-5 { width: 1.25rem !important; }
      #${this.options.containerId} .w-6 { width: 1.5rem !important; }
      #${this.options.containerId} .w-8 { width: 2rem !important; }
      #${this.options.containerId} .w-10 { width: 2.5rem !important; }
      #${this.options.containerId} .w-12 { width: 3rem !important; }
      #${this.options.containerId} .w-80 { width: 20rem !important; }
      #${this.options.containerId} .w-85 { width: 21.25rem !important; }
      #${this.options.containerId} .w-96 { width: 24rem !important; }
      #${this.options.containerId} .w-full { width: 100% !important; }
      #${this.options.containerId} .w-auto { width: auto !important; }
      
      #${this.options.containerId} .h-1 { height: 0.25rem !important; }
      #${this.options.containerId} .h-2 { height: 0.5rem !important; }
      #${this.options.containerId} .h-3 { height: 0.75rem !important; }
      #${this.options.containerId} .h-4 { height: 1rem !important; }
      #${this.options.containerId} .h-5 { height: 1.25rem !important; }
      #${this.options.containerId} .h-6 { height: 1.5rem !important; }
      #${this.options.containerId} .h-8 { height: 2rem !important; }
      #${this.options.containerId} .h-10 { height: 2.5rem !important; }
      #${this.options.containerId} .h-12 { height: 3rem !important; }
      #${this.options.containerId} .h-\\[44px\\] { height: 44px !important; }
      #${this.options.containerId} .h-\\[32em\\] { height: 32em !important; }
      #${this.options.containerId} .h-full { height: 100% !important; }
      #${this.options.containerId} .h-auto { height: auto !important; }
      
      #${this.options.containerId} .min-w-\\[44px\\] { min-width: 44px !important; }
      #${this.options.containerId} .min-h-\\[44px\\] { min-height: 44px !important; }
      #${this.options.containerId} .min-h-0 { min-height: 0px !important; }
      #${this.options.containerId} .max-w-\\[80\\%\\] { max-width: 80% !important; }
      #${this.options.containerId} .m-auto { margin: auto !important; }
      
      /* Borders and borders radius */
      #${this.options.containerId} .border { border-width: 1px !important; }
      #${this.options.containerId} .border-t { border-top-width: 1px !important; }
      #${this.options.containerId} .border-b { border-bottom-width: 1px !important; }
      #${this.options.containerId} .rounded { border-radius: 0.25rem !important; }
      #${this.options.containerId} .rounded-lg { border-radius: 0.5rem !important; }
      #${this.options.containerId} .rounded-xl { border-radius: 0.75rem !important; }
      #${this.options.containerId} .rounded-t-lg { border-top-left-radius: 0.5rem !important; border-top-right-radius: 0.5rem !important; }
      #${this.options.containerId} .rounded-b-lg { border-bottom-left-radius: 0.5rem !important; border-bottom-right-radius: 0.5rem !important; }
      #${this.options.containerId} .rounded-full { border-radius: 50% !important; }
      
      /* Shadows */
      #${this.options.containerId} .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important; }
      #${this.options.containerId} .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important; }
      #${this.options.containerId} .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; }
      #${this.options.containerId} .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important; }
      #${this.options.containerId} .drop-shadow-md { filter: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.07)) drop-shadow(0 2px 2px rgba(0, 0, 0, 0.06)) !important; }
      #${this.options.containerId} .drop-shadow-sm { filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.05)) !important; }
      #${this.options.containerId} .drop-shadow-lg { filter: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1)) !important; }
      
      /* Focus and transitions */
      #${this.options.containerId} .focus\\:outline-none:focus { outline: 2px solid transparent !important; outline-offset: 2px !important; }
      #${this.options.containerId} .focus\\:ring-2:focus { box-shadow: 0 0 0 2px var(--color-lightBlue) !important; }
      #${this.options.containerId} .focus\\:ring-lightBlue:focus { --tw-ring-color: var(--color-lightBlue) !important; }
      #${this.options.containerId} .focus\\:ring-offset-2:focus { --tw-ring-offset-width: 2px !important; }
      #${this.options.containerId} .focus\\:border-transparent:focus { border-color: transparent !important; }
      #${this.options.containerId} .transition-all { transition-property: all !important; }
      #${this.options.containerId} .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke !important; }
      #${this.options.containerId} .transition-opacity { transition-property: opacity !important; }
      #${this.options.containerId} .duration-200 { transition-duration: 200ms !important; }
      #${this.options.containerId} .duration-300 { transition-duration: 300ms !important; }
      #${this.options.containerId} .duration-800 { transition-duration: 800ms !important; }
      #${this.options.containerId} .duration-1000 { transition-duration: 1000ms !important; }
      #${this.options.containerId} .ease-in-out { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; }
      
      /* Transform effects */
      #${this.options.containerId} .hover\\:rotate-180:hover { transform: rotate(180deg) !important; }
      #${this.options.containerId} .translate-y-0 { transform: translateY(0px) !important; }
      #${this.options.containerId} .translate-y-10 { transform: translateY(2.5rem) !important; }
      #${this.options.containerId} .scale-100 { transform: scale(1) !important; }
      #${this.options.containerId} .scale-110 { transform: scale(1.1) !important; }
      #${this.options.containerId} .transform { /* Handled by individual transform classes */ }
      
      /* Gradients */
      #${this.options.containerId} .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)) !important; }
      #${this.options.containerId} .from-lightBlue { --tw-gradient-from: var(--color-lightBlue) !important; --tw-gradient-to: rgba(68, 176, 222, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
      #${this.options.containerId} .via-blue-500 { --tw-gradient-to: rgba(59, 130, 246, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), #3b82f6, var(--tw-gradient-to) !important; }
      #${this.options.containerId} .to-bgDarkBlue { --tw-gradient-to: var(--color-bgDarkBlue) !important; }
      #${this.options.containerId} .hover\\:from-blue-500:hover { --tw-gradient-from: #3b82f6 !important; --tw-gradient-to: rgba(59, 130, 246, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
      #${this.options.containerId} .hover\\:to-blue-800:hover { --tw-gradient-to: #1e40af !important; }
      
      /* Layout classes */
      #${this.options.containerId} .flex-1 { flex: 1 1 0% !important; }
      #${this.options.containerId} .flex-shrink-0 { flex-shrink: 0 !important; }
      #${this.options.containerId} .space-y-1 > * + * { margin-top: 0.25rem !important; }
      #${this.options.containerId} .space-y-2 > * + * { margin-top: 0.5rem !important; }
      #${this.options.containerId} .space-y-4 > * + * { margin-top: 1rem !important; }
      
      /* Positioning classes */
      #${this.options.containerId} .fixed { position: fixed !important; }
      #${this.options.containerId} .absolute { position: absolute !important; }
      #${this.options.containerId} .relative { position: relative !important; }
      #${this.options.containerId} .bottom-10 { bottom: 2.5rem !important; }
      #${this.options.containerId} .bottom-16 { bottom: 4rem !important; }
      #${this.options.containerId} .bottom-24 { bottom: 6rem !important; }
      #${this.options.containerId} .bottom-25 { bottom: 6.25rem !important; }
      #${this.options.containerId} .right-4 { right: 1rem !important; }
      #${this.options.containerId} .right-6 { right: 1.5rem !important; }
      #${this.options.containerId} .right-12 { right: 3rem !important; }
      #${this.options.containerId} .z-10 { z-index: 10 !important; }
      #${this.options.containerId} .z-40 { z-index: 40 !important; }
      #${this.options.containerId} .z-50 { z-index: 50 !important; }
      #${this.options.containerId} .-top-1 { top: -0.25rem !important; }
      #${this.options.containerId} .-right-1 { right: -0.25rem !important; }
      
      /* Effects and animations */
      #${this.options.containerId} .backdrop-blur-sm { backdrop-filter: blur(4px) !important; }
      #${this.options.containerId} .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important; }
      #${this.options.containerId} .opacity-0 { opacity: 0 !important; }
      #${this.options.containerId} .opacity-100 { opacity: 1 !important; }
      #${this.options.containerId} .opacity-50 { opacity: 0.5 !important; }
      
      /* List styles */
      #${this.options.containerId} .list-disc { list-style-type: disc !important; }
      #${this.options.containerId} .list-decimal { list-style-type: decimal !important; }
      #${this.options.containerId} .list-inside { list-style-position: inside !important; }
      
      /* Text behavior */
      #${this.options.containerId} .break-words { word-wrap: break-word !important; }
      #${this.options.containerId} .whitespace-pre-wrap { white-space: pre-wrap !important; }
      
      /* Form utilities */
      #${this.options.containerId} .resize-none { resize: none !important; }
      #${this.options.containerId} .leading-tight { line-height: 1.25 !important; }
      #${this.options.containerId} .overflow-hidden { overflow: hidden !important; }
      #${this.options.containerId} .overflow-x-auto { overflow-x: auto !important; }
      #${this.options.containerId} .scrollbar-none { scrollbar-width: none !important; }
      #${this.options.containerId} .scrollbar-none::-webkit-scrollbar { display: none !important; }
      
      /* Cursor utilities */
      #${this.options.containerId} .cursor-pointer { cursor: pointer !important; }
      
      /* Disabled states */
      #${this.options.containerId} .disabled\\:opacity-50:disabled { opacity: 0.5 !important; }
      #${this.options.containerId} .disabled\\:cursor-not-allowed:disabled { cursor: not-allowed !important; }
        /* Placeholder styles */
      #${this.options.containerId} .placeholder-blueGray\\/70::placeholder { color: rgba(211, 221, 230, 0.7) !important; }
        /* Clases arbitrarias específicas necesarias para el widget */
      #${this.options.containerId} .h-\\[32em\\] { height: 32em !important; }
      #${this.options.containerId} .h-\\[44px\\] { height: 44px !important; }
      #${this.options.containerId} .w-\\[44px\\] { width: 44px !important; }
      #${this.options.containerId} .min-w-\\[44px\\] { min-width: 44px !important; }
      #${this.options.containerId} .min-h-\\[44px\\] { min-height: 44px !important; }
      #${this.options.containerId} .max-w-\\[80\\%\\] { max-width: 80% !important; }
      #${this.options.containerId} .bottom-25 { bottom: 6.25rem !important; }
      #${this.options.containerId} .w-85 { width: 21.25rem !important; }
        /* Transform utilities */
      #${this.options.containerId} .transform { transform: var(--tw-transform) !important; }
      #${this.options.containerId} .left-1\\/2 { left: 50% !important; }
      #${this.options.containerId} .-translate-x-1\\/2 { 
        --tw-translate-x: -50% !important;
        transform: translateX(-50%) !important;
      }
      #${this.options.containerId} .justify-between { justify-content: space-between !important; }
      
      /* Flex utilities adicionales */
      #${this.options.containerId} .flex-shrink-0 { flex-shrink: 0 !important; }
      
      /* Responsive utilities */
      @media (min-width: 640px) {
        #${this.options.containerId} .sm\\:bottom-10 { bottom: 2.5rem !important; }
        #${this.options.containerId} .sm\\:right-6 { right: 1.5rem !important; }
        #${this.options.containerId} .sm\\:p-3 { padding: 0.75rem !important; }
        #${this.options.containerId} .sm\\:w-96 { width: 24rem !important; }
      }
      
      /* Emergencia: clases adicionales que pueden faltar */
      #${this.options.containerId} .border-b { border-bottom-width: 1px !important; }
      #${this.options.containerId} .rounded-t-lg { 
        border-top-left-radius: 0.5rem !important; 
        border-top-right-radius: 0.5rem !important; 
      }
      #${this.options.containerId} .rounded-full { border-radius: 50% !important; }
      #${this.options.containerId} .tracking-widest { letter-spacing: 0.1em !important; }
      
      /* Drop shadow específico */
      #${this.options.containerId} .drop-shadow-\\[0_0_6px_\\#44b0de99\\] { 
        filter: drop-shadow(0 0 6px rgba(68, 176, 222, 0.6)) !important; 
      }
      
      /* Chat-specific classes */
      #${this.options.containerId} .chat-window-container { 
        /* Additional chat window styling if needed */
      }
      #${this.options.containerId} .mobile-chat-window { 
        /* Mobile specific styling */
      }

      /* Special Tailwind arbitrary value classes */
      #${this.options.containerId} .drop-shadow-\\[0_0_6px_\\#44b0de99\\] { 
        filter: drop-shadow(0 0 6px rgba(68, 176, 222, 0.6)) !important; 
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: .5; }
      }
      
      /* Position utilities */
      #${this.options.containerId} .absolute { position: absolute !important; }
      #${this.options.containerId} .-top-1 { top: -0.25rem !important; }
      #${this.options.containerId} .-right-1 { right: -0.25rem !important; }      /* Essential positioning and display utilities */
      #${this.options.containerId} .fixed { position: fixed !important; }
      #${this.options.containerId} .absolute { position: absolute !important; }
      #${this.options.containerId} .z-40 { z-index: 40 !important; }
      #${this.options.containerId} .z-50 { z-index: 50 !important; }
      #${this.options.containerId} .bottom-16 { bottom: 4rem !important; }
      #${this.options.containerId} .bottom-10 { bottom: 2.5rem !important; }
      #${this.options.containerId} .right-4 { right: 1rem !important; }
      #${this.options.containerId} .right-6 { right: 1.5rem !important; }
      #${this.options.containerId} .right-12 { right: 3rem !important; }
      #${this.options.containerId} .p-2 { padding: 0.5rem !important; }
      #${this.options.containerId} .p-3 { padding: 0.75rem !important; }
      #${this.options.containerId} .cursor-pointer { cursor: pointer !important; }
      #${this.options.containerId} .translate-y-0 { transform: translateY(0px) !important; }
      #${this.options.containerId} .translate-y-10 { transform: translateY(2.5rem) !important; }
      #${this.options.containerId} .scale-100 { transform: scale(1) !important; }
      #${this.options.containerId} .scale-110 { transform: scale(1.1) !important; }
      #${this.options.containerId} .duration-1000 { transition-duration: 1000ms !important; }
      #${this.options.containerId} .ease-in-out { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; }
      #${this.options.containerId} .transform { /* Handled by individual transform classes */ }
      #${this.options.containerId} .text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
      #${this.options.containerId} .w-80 { width: 20rem !important; }
      #${this.options.containerId} .w-96 { width: 24rem !important; }
      #${this.options.containerId} .h-\\[32em\\] { height: 32em !important; }

      /* Mobile chat window class */
      #${this.options.containerId} .mobile-chat-window { 
        /* Will be styled via other utility classes */ 
      }

      /* Special Tailwind arbitrary value classes */
      #${this.options.containerId} .drop-shadow-\\[0_0_6px_\\#44b0de99\\] { 
        filter: drop-shadow(0 0 6px rgba(68, 176, 222, 0.6)) !important; 
      }      /* Floating button specific styles - Override any conflicting styles */
      #${this.options.containerId} button[aria-label*="chat"] {
        position: fixed !important;
        z-index: 9999 !important;
        bottom: 1.5rem !important;
        right: 1rem !important;
        background-color: var(--segurbot-color-bgDarkBlue) !important;
        color: var(--segurbot-color-lightBlue) !important;
        border: 4px solid var(--segurbot-color-lightBlue) !important;
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
      }      #${this.options.containerId} button[aria-label*="chat"]:hover {
        background-color: var(--segurbot-color-Black) !important;
        color: var(--segurbot-color-lightBlueHover) !important;
        transform: translateY(0px) scale(1.1) !important;
      }

      /* Button icon styles */
      #${this.options.containerId} button[aria-label*="chat"] svg {
        width: 1.5rem !important;
        height: 1.5rem !important;
        fill: currentColor !important;
        stroke: currentColor !important;
        stroke-width: 2 !important;
      }/* Chat window positioning */
      #${this.options.containerId} .fixed.bottom-25 {
        position: fixed !important;
        bottom: 6.25rem !important;
        right: 3rem !important;
        z-index: 50 !important;
      }      /* Chat header styles */
      #${this.options.containerId} .bg-Blue {
        background-color: var(--segurbot-color-Blue) !important;
      }      /* Chat input styles */
      #${this.options.containerId} textarea {
        background-color: var(--segurbot-color-Black) !important;
        border-color: rgba(68, 176, 222, 0.3) !important;
        color: var(--segurbot-color-blueGray) !important;
      }

      #${this.options.containerId} textarea:focus {
        border-color: var(--segurbot-color-lightBlue) !important;
        box-shadow: 0 0 0 2px var(--segurbot-color-lightBlue) !important;
      }

      /* Chat messages styling */
      #${this.options.containerId} .bg-bgDarkBlue\\/10 {
        background-color: rgba(3, 7, 15, 0.1) !important;
      }

      #${this.options.containerId} .border-bgDarkBlue\\/20 {
        border-color: rgba(3, 7, 15, 0.2) !important;
      }

      #${this.options.containerId} .bg-lightBlue\\/5 {
        background-color: rgba(68, 176, 222, 0.05) !important;
      }

      #${this.options.containerId} .border-lightBlue\\/20 {
        border-color: rgba(68, 176, 222, 0.2) !important;
      }      /* Send button styles */
      #${this.options.containerId} .bg-lightBlue {
        background-color: var(--segurbot-color-lightBlue) !important;
      }

      #${this.options.containerId} .hover\\:bg-lightBlueHover:hover {
        background-color: var(--segurbot-color-lightBlueHover) !important;
      }/* Widget container specific styles */
      #${this.options.containerId} {
        /* Fuente por defecto del widget - con fallbacks seguros */
        font-family: var(--segurbot-font-family, "Federo", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif) !important;
        position: relative !important;
        width: auto !important;
        height: auto !important;
        z-index: 1 !important;
        /* Evitar herencia de estilos del sitio padre */
        color: initial !important;
        background: initial !important;
        border: initial !important;
        margin: initial !important;
        padding: initial !important;
        text-align: initial !important;
        line-height: initial !important;
        font-size: 15px !important;
      }

      /* Resetear estilos heredados en todos los elementos del widget */
      #${this.options.containerId} *, 
      #${this.options.containerId} *:before, 
      #${this.options.containerId} *:after {
        font-family: inherit !important;
        box-sizing: border-box !important;
      }

      /* Special drop shadow effect for the floating button */
      #${this.options.containerId} button[aria-label*="chat"] {
        filter: drop-shadow(0 0 6px rgba(68, 176, 222, 0.6)) !important;
      }/* Responsive for mobile */
      @media (max-width: 640px) {
        .sm\\:bottom-10 { bottom: 2.5rem !important; }
        .sm\\:right-6 { right: 1.5rem !important; }
        .sm\\:p-3 { padding: 0.75rem !important; }
        .sm\\:w-96 { width: 24rem !important; }
        .sm\\:space-y-4 > * + * { margin-top: 1rem !important; }
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
  // Detectar y resolver conflictos CSS potenciales
  detectAndResolveConflicts() {
    if (typeof window === 'undefined' || !this.container) return;

    // Marcar que las variables CSS del widget están activas
    document.documentElement.setAttribute('data-segurbot-vars', 'true');

    // Verificar si hay conflictos con variables CSS del sitio padre
    const rootStyles = getComputedStyle(document.documentElement);
    const conflicts = [];

    const criticalVars = [
      '--color-Blue',
      '--color-lightBlue', 
      '--color-bgDarkBlue',
      '--color-blueGray'
    ];

    criticalVars.forEach(varName => {
      const existingValue = rootStyles.getPropertyValue(varName);
      if (existingValue && existingValue.trim() && existingValue !== this.getExpectedVarValue(varName)) {
        conflicts.push({
          variable: varName,
          existing: existingValue.trim(),
          expected: this.getExpectedVarValue(varName)
        });
      }
    });

    if (conflicts.length > 0 && this.options.enableDebug) {
      console.warn('⚠️ SegurBot: Detectados conflictos CSS potenciales:', conflicts);
      console.log('💡 El widget usará sus variables prefijadas para evitar conflictos');
    }

    // Verificar que el botón flotante esté correctamente posicionado
    setTimeout(() => {
      const button = this.container.querySelector('[aria-label*="chat"]');
      if (button) {
        const computedStyles = getComputedStyle(button);
        const issues = [];
        
        if (computedStyles.position !== 'fixed') {
          issues.push('position');
          button.style.setProperty('position', 'fixed', 'important');
        }
        
        if (parseInt(computedStyles.zIndex) < 9999) {
          issues.push('z-index');
          button.style.setProperty('z-index', '9999', 'important');
        }

        // Verificar colores del botón
        const bgColor = computedStyles.backgroundColor;
        if (!bgColor || bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
          issues.push('background-color');
          button.style.setProperty('background-color', '#03070f', 'important');
        }

        const borderColor = computedStyles.borderColor;
        if (!borderColor || borderColor === 'rgba(0, 0, 0, 0)' || borderColor === 'transparent') {
          issues.push('border-color');
          button.style.setProperty('border-color', '#44b0de', 'important');
        }

        // Verificar visibilidad
        if (computedStyles.visibility !== 'visible' || computedStyles.opacity === '0') {
          issues.push('visibility');
          button.style.setProperty('visibility', 'visible', 'important');
          button.style.setProperty('opacity', '1', 'important');
        }

        if (issues.length > 0 && this.options.enableDebug) {
          console.warn('⚠️ SegurBot: Corrigiendo estilos del botón flotante:', issues);
        }
      }
    }, 500);
  }

  // Obtener el valor esperado para una variable CSS
  getExpectedVarValue(varName) {
    const varMap = {
      '--color-Blue': '#253878',
      '--color-lightBlue': '#44b0de',
      '--color-bgDarkBlue': '#03070f',
      '--color-blueGray': '#d3dde6'
    };
    return varMap[varName] || '';
  }

  // Cargar CSS externo automáticamente
  loadExternalCSS() {
    // Verificar si ya se cargó el CSS externo
    const existingLink = document.getElementById('segurbot-widget-external-css')
    if (existingLink) return

    // Intentar detectar la URL base del script
    const currentScript = document.currentScript || 
                         document.querySelector('script[src*="segurbot-widget"]') ||
                         Array.from(document.scripts).find(s => s.src.includes('segurbot-widget'))
    
    if (currentScript && currentScript.src) {
      const scriptUrl = new URL(currentScript.src)
      const cssUrl = `${scriptUrl.protocol}//${scriptUrl.host}${scriptUrl.pathname.replace('.umd.cjs', '.css')}`
      
      // Crear y cargar el link CSS
      const link = document.createElement('link')
      link.id = 'segurbot-widget-external-css'
      link.rel = 'stylesheet'
      link.href = cssUrl
      link.crossOrigin = 'anonymous'
      
      // Añadir al head
      document.head.appendChild(link)
      
      if (this.options.enableDebug) {
        console.log('🎨 SegurBot: Cargando CSS externo desde:', cssUrl)
      }
    } else if (this.options.enableDebug) {
      console.warn('⚠️ SegurBot: No se pudo detectar la URL del CSS externo')
    }
  }
}

// Asegurar que SegurBotWidget esté disponible globalmente INMEDIATAMENTE
if (typeof window !== 'undefined') {
  window.SegurBotWidget = SegurBotWidget;
}

// Variable global para prevenir múltiples inicializaciones
let globalWidgetInitialized = false;

// Auto-inicialización si hay configuración global o data-attributes
if (typeof window !== 'undefined' && window.SegurBotConfig && !globalWidgetInitialized) {
  const widget = new SegurBotWidget(window.SegurBotConfig)
  widget.init()
  window.segurBotWidget = widget
  globalWidgetInitialized = true
}

// NUEVA FUNCIONALIDAD: Auto-detección desde script tag
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    // Solo proceder si no se ha inicializado ya
    if (globalWidgetInitialized) return;
    
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
        globalWidgetInitialized = true
        
        console.log('✅ SegurBot Widget auto-inicializado desde script tag')
      } else {
        console.warn('⚠️ SegurBot: data-api-url es requerido para auto-inicialización')
      }
    }
  })
}

// Exportar para uso como módulo (solo default para UMD)
export default SegurBotWidget
