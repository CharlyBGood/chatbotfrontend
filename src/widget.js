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
      }      /* Essential Tailwind utility classes for SegurBot */
      /* Background colors */
      .bg-bgDarkBlue { background-color: var(--color-bgDarkBlue) !important; }
      .hover\\:bg-Black:hover { background-color: var(--color-Black) !important; }
      .bg-Black { background-color: var(--color-Black) !important; }
      .bg-Blue { background-color: var(--color-Blue) !important; }
      .bg-lightBlue { background-color: var(--color-lightBlue) !important; }
      .hover\\:bg-lightBlueHover:hover { background-color: var(--color-lightBlueHover) !important; }
      .bg-bgDarkBlue\\/10 { background-color: rgba(3, 7, 15, 0.1) !important; }
      .bg-bgDarkBlue\\/80 { background-color: rgba(3, 7, 15, 0.8) !important; }
      .bg-lightBlue\\/5 { background-color: rgba(68, 176, 222, 0.05) !important; }
      .bg-gray-100 { background-color: #f3f4f6 !important; }
      
      /* Text colors */
      .text-lightBlue { color: var(--color-lightBlue) !important; }
      .hover\\:text-lightBlueHover:hover { color: var(--color-lightBlueHover) !important; }
      .text-justGray { color: var(--color-justGray) !important; }
      .text-blueGray { color: var(--color-blueGray) !important; }
      .hover\\:text-lightBlue:hover { color: var(--color-lightBlue) !important; }
      .hover\\:text-blue-500:hover { color: #3b82f6 !important; }
      
      /* Border colors */
      .border-lightBlue { border-color: var(--color-lightBlue) !important; }
      .border-lightBlue\\/20 { border-color: rgba(68, 176, 222, 0.2) !important; }
      .border-lightBlue\\/30 { border-color: rgba(68, 176, 222, 0.3) !important; }
      .hover\\:border-lightBlue\\/60:hover { border-color: rgba(68, 176, 222, 0.6) !important; }
      .border-bgDarkBlue\\/20 { border-color: rgba(3, 7, 15, 0.2) !important; }
      .border-l-4 { border-left-width: 4px !important; }
      .border-4 { border-width: 4px !important; }
      
      /* Text sizes */
      .text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
      .text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
      .text-3xl { font-size: 1.875rem !important; line-height: 2.25rem !important; }
      .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
      .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
      .text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
      
      /* Font styles */
      .font-semibold { font-weight: 600 !important; }
      .font-bold { font-weight: 700 !important; }
      .font-mono { font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace !important; }
      .tracking-widest { letter-spacing: 0.1em !important; }
      .italic { font-style: italic !important; }
      .underline { text-decoration: underline !important; }
      
      /* Layout utilities */
      .flex { display: flex !important; }
      .flex-col { flex-direction: column !important; }
      .items-center { align-items: center !important; }
      .items-start { align-items: flex-start !important; }
      .items-end { align-items: flex-end !important; }
      .justify-center { justify-content: center !important; }
      .justify-start { justify-content: flex-start !important; }
      .justify-end { justify-content: flex-end !important; }
      .text-center { text-align: center !important; }
      .mx-auto { margin-left: auto !important; margin-right: auto !important; }
      .gap-1 { gap: 0.25rem !important; }
      .gap-2 { gap: 0.5rem !important; }
      .inline-flex { display: inline-flex !important; }
      
      /* Spacing utilities */
      .p-1 { padding: 0.25rem !important; }
      .p-2 { padding: 0.5rem !important; }
      .p-3 { padding: 0.75rem !important; }
      .p-4 { padding: 1rem !important; }
      .px-1 { padding-left: 0.25rem !important; padding-right: 0.25rem !important; }
      .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
      .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
      .py-0\\.5 { padding-top: 0.125rem !important; padding-bottom: 0.125rem !important; }
      .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
      .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
      .pl-4 { padding-left: 1rem !important; }
      .mb-0 { margin-bottom: 0 !important; }
      .mb-1 { margin-bottom: 0.25rem !important; }
      .mb-2 { margin-bottom: 0.5rem !important; }
      .mt-1 { margin-top: 0.25rem !important; }
      .ml-1 { margin-left: 0.25rem !important; }
      .last\\:mb-0:last-child { margin-bottom: 0 !important; }
      .first\\:mt-0:first-child { margin-top: 0 !important; }
      
      /* Sizing - Comprehensive width and height utilities */
      .w-1 { width: 0.25rem !important; }
      .w-2 { width: 0.5rem !important; }
      .w-3 { width: 0.75rem !important; }
      .w-4 { width: 1rem !important; }
      .w-5 { width: 1.25rem !important; }
      .w-6 { width: 1.5rem !important; }
      .w-8 { width: 2rem !important; }
      .w-10 { width: 2.5rem !important; }
      .w-12 { width: 3rem !important; }
      .w-80 { width: 20rem !important; }
      .w-85 { width: 21.25rem !important; }
      .w-96 { width: 24rem !important; }
      .w-full { width: 100% !important; }
      .w-auto { width: auto !important; }
      
      .h-1 { height: 0.25rem !important; }
      .h-2 { height: 0.5rem !important; }
      .h-3 { height: 0.75rem !important; }
      .h-4 { height: 1rem !important; }
      .h-5 { height: 1.25rem !important; }
      .h-6 { height: 1.5rem !important; }
      .h-8 { height: 2rem !important; }
      .h-10 { height: 2.5rem !important; }
      .h-12 { height: 3rem !important; }
      .h-\\[44px\\] { height: 44px !important; }
      .h-\\[32em\\] { height: 32em !important; }
      .h-full { height: 100% !important; }
      .h-auto { height: auto !important; }
      
      .min-w-\\[44px\\] { min-width: 44px !important; }
      .min-h-\\[44px\\] { min-height: 44px !important; }
      .min-h-0 { min-height: 0px !important; }
      .max-w-\\[80\\%\\] { max-width: 80% !important; }
      .m-auto { margin: auto !important; }
      
      /* Borders and borders radius */
      .border { border-width: 1px !important; }
      .border-t { border-top-width: 1px !important; }
      .border-b { border-bottom-width: 1px !important; }
      .rounded { border-radius: 0.25rem !important; }
      .rounded-lg { border-radius: 0.5rem !important; }
      .rounded-xl { border-radius: 0.75rem !important; }
      .rounded-t-lg { border-top-left-radius: 0.5rem !important; border-top-right-radius: 0.5rem !important; }
      .rounded-b-lg { border-bottom-left-radius: 0.5rem !important; border-bottom-right-radius: 0.5rem !important; }
      .rounded-full { border-radius: 50% !important; }
      
      /* Shadows */
      .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important; }
      .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important; }
      .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; }
      .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important; }
      .drop-shadow-md { filter: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.07)) drop-shadow(0 2px 2px rgba(0, 0, 0, 0.06)) !important; }
      .drop-shadow-sm { filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.05)) !important; }
      .drop-shadow-lg { filter: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1)) !important; }
      
      /* Focus and transitions */
      .focus\\:outline-none:focus { outline: 2px solid transparent !important; outline-offset: 2px !important; }
      .focus\\:ring-2:focus { box-shadow: 0 0 0 2px var(--color-lightBlue) !important; }
      .focus\\:ring-lightBlue:focus { --tw-ring-color: var(--color-lightBlue) !important; }
      .focus\\:ring-offset-2:focus { --tw-ring-offset-width: 2px !important; }
      .focus\\:border-transparent:focus { border-color: transparent !important; }
      .transition-all { transition-property: all !important; }
      .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke !important; }
      .transition-opacity { transition-property: opacity !important; }
      .duration-200 { transition-duration: 200ms !important; }
      .duration-300 { transition-duration: 300ms !important; }
      .duration-800 { transition-duration: 800ms !important; }
      .duration-1000 { transition-duration: 1000ms !important; }
      .ease-in-out { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; }
      
      /* Transform effects */
      .hover\\:rotate-180:hover { transform: rotate(180deg) !important; }
      .translate-y-0 { transform: translateY(0px) !important; }
      .translate-y-10 { transform: translateY(2.5rem) !important; }
      .scale-100 { transform: scale(1) !important; }
      .scale-110 { transform: scale(1.1) !important; }
      .transform { /* Handled by individual transform classes */ }
      
      /* Gradients */
      .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)) !important; }
      .from-lightBlue { --tw-gradient-from: var(--color-lightBlue) !important; --tw-gradient-to: rgba(68, 176, 222, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
      .via-blue-500 { --tw-gradient-to: rgba(59, 130, 246, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), #3b82f6, var(--tw-gradient-to) !important; }
      .to-bgDarkBlue { --tw-gradient-to: var(--color-bgDarkBlue) !important; }
      .hover\\:from-blue-500:hover { --tw-gradient-from: #3b82f6 !important; --tw-gradient-to: rgba(59, 130, 246, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
      .hover\\:to-blue-800:hover { --tw-gradient-to: #1e40af !important; }
      
      /* Layout classes */
      .flex-1 { flex: 1 1 0% !important; }
      .flex-shrink-0 { flex-shrink: 0 !important; }
      .space-y-1 > * + * { margin-top: 0.25rem !important; }
      .space-y-2 > * + * { margin-top: 0.5rem !important; }
      .space-y-4 > * + * { margin-top: 1rem !important; }
      
      /* Positioning classes */
      .fixed { position: fixed !important; }
      .absolute { position: absolute !important; }
      .relative { position: relative !important; }
      .bottom-10 { bottom: 2.5rem !important; }
      .bottom-16 { bottom: 4rem !important; }
      .bottom-24 { bottom: 6rem !important; }
      .bottom-25 { bottom: 6.25rem !important; }
      .right-4 { right: 1rem !important; }
      .right-6 { right: 1.5rem !important; }
      .right-12 { right: 3rem !important; }
      .z-10 { z-index: 10 !important; }
      .z-40 { z-index: 40 !important; }
      .z-50 { z-index: 50 !important; }
      .-top-1 { top: -0.25rem !important; }
      .-right-1 { right: -0.25rem !important; }
      
      /* Effects and animations */
      .backdrop-blur-sm { backdrop-filter: blur(4px) !important; }
      .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important; }
      .opacity-0 { opacity: 0 !important; }
      .opacity-100 { opacity: 1 !important; }
      .opacity-50 { opacity: 0.5 !important; }
      
      /* List styles */
      .list-disc { list-style-type: disc !important; }
      .list-decimal { list-style-type: decimal !important; }
      .list-inside { list-style-position: inside !important; }
      
      /* Text behavior */
      .break-words { word-wrap: break-word !important; }
      .whitespace-pre-wrap { white-space: pre-wrap !important; }
      
      /* Form utilities */
      .resize-none { resize: none !important; }
      .leading-tight { line-height: 1.25 !important; }
      .overflow-hidden { overflow: hidden !important; }
      .overflow-x-auto { overflow-x: auto !important; }
      .scrollbar-none { scrollbar-width: none !important; }
      .scrollbar-none::-webkit-scrollbar { display: none !important; }
      
      /* Cursor utilities */
      .cursor-pointer { cursor: pointer !important; }
      
      /* Disabled states */
      .disabled\\:opacity-50:disabled { opacity: 0.5 !important; }
      .disabled\\:cursor-not-allowed:disabled { cursor: not-allowed !important; }
      
      /* Placeholder styles */
      .placeholder-blueGray\\/70::placeholder { color: rgba(211, 221, 230, 0.7) !important; }
      
      /* Chat-specific classes */
      .chat-window-container { 
        /* Additional chat window styling if needed */
      }
      .mobile-chat-window { 
        /* Mobile specific styling */
      }

      /* Special Tailwind arbitrary value classes */
      .drop-shadow-\\[0_0_6px_\\#44b0de99\\] { 
        filter: drop-shadow(0 0 6px rgba(68, 176, 222, 0.6)) !important; 
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: .5; }
      }
      
      /* Position utilities */
      .absolute { position: absolute !important; }
      .-top-1 { top: -0.25rem !important; }
      .-right-1 { right: -0.25rem !important; }      /* Essential positioning and display utilities */
      .fixed { position: fixed !important; }
      .absolute { position: absolute !important; }
      .z-40 { z-index: 40 !important; }
      .z-50 { z-index: 50 !important; }
      .bottom-16 { bottom: 4rem !important; }
      .bottom-10 { bottom: 2.5rem !important; }
      .right-4 { right: 1rem !important; }
      .right-6 { right: 1.5rem !important; }
      .right-12 { right: 3rem !important; }
      .p-2 { padding: 0.5rem !important; }
      .p-3 { padding: 0.75rem !important; }
      .cursor-pointer { cursor: pointer !important; }
      .translate-y-0 { transform: translateY(0px) !important; }
      .translate-y-10 { transform: translateY(2.5rem) !important; }
      .scale-100 { transform: scale(1) !important; }
      .scale-110 { transform: scale(1.1) !important; }
      .duration-1000 { transition-duration: 1000ms !important; }
      .ease-in-out { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; }
      .transform { /* Handled by individual transform classes */ }
      .text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
      .w-80 { width: 20rem !important; }
      .w-96 { width: 24rem !important; }
      .h-\\[32em\\] { height: 32em !important; }

      /* Mobile chat window class */
      .mobile-chat-window { 
        /* Will be styled via other utility classes */ 
      }

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
      }      /* Chat window positioning */
      #${this.options.containerId} .fixed.bottom-25 {
        position: fixed !important;
        bottom: 6.25rem !important;
        right: 3rem !important;
        z-index: 50 !important;
      }

      /* Chat header styles */
      #${this.options.containerId} .bg-Blue {
        background-color: var(--color-Blue) !important;
      }

      /* Chat input styles */
      #${this.options.containerId} textarea {
        background-color: var(--color-Black) !important;
        border-color: rgba(68, 176, 222, 0.3) !important;
        color: var(--color-blueGray) !important;
      }

      #${this.options.containerId} textarea:focus {
        border-color: var(--color-lightBlue) !important;
        box-shadow: 0 0 0 2px var(--color-lightBlue) !important;
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
      }

      /* Send button styles */
      #${this.options.containerId} .bg-lightBlue {
        background-color: var(--color-lightBlue) !important;
      }

      #${this.options.containerId} .hover\\:bg-lightBlueHover:hover {
        background-color: var(--color-lightBlueHover) !important;
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
      }      /* Responsive for mobile */
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
}

// Asegurar que SegurBotWidget esté disponible globalmente INMEDIATAMENTE
if (typeof window !== 'undefined') {
  window.SegurBotWidget = SegurBotWidget;
}

// Auto-inicialización si hay configuración global o data-attributes
if (typeof window !== 'undefined' && window.SegurBotConfig) {
  const widget = new SegurBotWidget(window.SegurBotConfig)
  widget.init()
  window.segurBotWidget = widget
}

// NUEVA FUNCIONALIDAD: Auto-detección desde script tag
if (typeof document !== 'undefined') {
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
}

// Exportar para uso como módulo
export default SegurBotWidget
