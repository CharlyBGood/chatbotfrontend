import { useViewport } from '../hooks/useViewport';
import { useVirtualKeyboard } from '../hooks/useVirtualKeyboard';
import { useEffect, useRef, useCallback } from 'react';

export function MobileChatLayout({ children, isMobile }) {
  const viewport = useViewport();
  const keyboard = useVirtualKeyboard();
  const containerRef = useRef(null);
  
  // Performance optimization: memoize expensive calculations
  const layoutCalculations = useCallback(() => {
    if (!isMobile) return null;
    
    const visualHeight = window.visualViewport?.height || window.innerHeight;
    const visualTop = window.visualViewport?.offsetTop || 0;
    
    // Enhanced safety checks for edge cases
    const safeVisualHeight = Math.max(120, Math.min(visualHeight, window.screen?.height || visualHeight));
    const safeVisualTop = Math.max(0, visualTop);
    
    return {
      containerHeight: keyboard.isKeyboardVisible ? safeVisualHeight : viewport.visualViewportHeight,
      containerTop: keyboard.isKeyboardVisible ? safeVisualTop : 0,
      visualHeight: safeVisualHeight,
      visualTop: safeVisualTop
    };
  }, [isMobile, keyboard.isKeyboardVisible, viewport.visualViewportHeight]);

  // CSS variables management with better error handling
  useEffect(() => {
    if (!isMobile) return;

    const calc = layoutCalculations();
    if (!calc) return;

    try {
      const docElement = document.documentElement;
      if (!docElement?.style) return;

      // Update CSS variables atomically to prevent layout thrashing
      const updates = [
        ['--effective-viewport-height', `${calc.containerHeight}px`],
        ['--visual-viewport-height', `${calc.visualHeight}px`],
        ['--visual-viewport-top', `${calc.visualTop}px`],
        ['--keyboard-height', `${keyboard.keyboardHeight}px`],
        ['--is-keyboard-visible', keyboard.isKeyboardVisible ? '1' : '0'],
        ['--layout-safe-area-top', `${Math.max(0, calc.visualTop)}px`]
      ];

      // Batch DOM updates for better performance
      requestAnimationFrame(() => {
        updates.forEach(([prop, value]) => {
          docElement.style.setProperty(prop, value);
        });
      });

      return () => {
        try {
          updates.forEach(([prop]) => {
            docElement.style.removeProperty(prop);
          });
        } catch (error) {
          console.warn('Error removing CSS properties:', error);
        }
      };
    } catch (error) {
      console.warn('Error updating CSS variables:', error);
    }
  }, [isMobile, keyboard.isKeyboardVisible, keyboard.keyboardHeight, layoutCalculations]);

  // Enhanced scroll prevention with better event handling
  useEffect(() => {
    if (!isMobile || !containerRef.current) return;

    const container = containerRef.current;
    
    const preventScroll = (e) => {
      try {
        if (keyboard.isKeyboardVisible) {
          const target = e.target;
          const chatWindow = target?.closest('.mobile-chat-window');
          
          if (!chatWindow) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        }
      } catch (error) {
        console.warn('Error in scroll prevention:', error);
      }
    };

    const preventTouchMove = (e) => {
      try {
        if (keyboard.isKeyboardVisible) {
          const target = e.target;
          const chatWindow = target?.closest('.mobile-chat-window');
          
          if (!chatWindow) {
            e.preventDefault();
          }
        }
      } catch (error) {
        console.warn('Error in touch prevention:', error);
      }
    };

    // Add passive: false only when necessary for better scroll performance
    const wheelOptions = { passive: false };
    const touchOptions = { passive: false };

    container.addEventListener('wheel', preventScroll, wheelOptions);
    container.addEventListener('touchmove', preventTouchMove, touchOptions);

    return () => {
      container.removeEventListener('wheel', preventScroll, wheelOptions);
      container.removeEventListener('touchmove', preventTouchMove, touchOptions);
    };
  }, [isMobile, keyboard.isKeyboardVisible]);

  if (!isMobile) {
    return children;
  }

  const calc = layoutCalculations();
  if (!calc) return children;

  const layoutStyle = {
    height: `${calc.containerHeight}px`,
    maxHeight: `${calc.containerHeight}px`,
    minHeight: '120px', // Ensure minimum usable height
    position: 'fixed',
    top: `${calc.containerTop}px`,
    left: '0',
    right: '0',
    bottom: 'auto',
    transition: 'height 0.2s ease-in-out, top 0.2s ease-in-out',
    zIndex: 50,
    overflow: 'hidden',
    transform: 'translateZ(0)',
    willChange: keyboard.isKeyboardVisible ? 'height, top' : 'auto', // Optimize only when needed
    backfaceVisibility: 'hidden', // Improve rendering performance
  };

  return (
    <div 
      ref={containerRef}
      className="mobile-chat-container flex flex-col w-screen bg-bgDarkBlue"
      style={layoutStyle}
      data-keyboard-visible={keyboard.isKeyboardVisible}
      data-visual-top={calc.containerTop}
      data-container-height={calc.containerHeight}
      data-keyboard-stable={keyboard.isStateStable}
      role="dialog"
      aria-label="Chat Interface"
    >
      {children}
    </div>
  );
}
