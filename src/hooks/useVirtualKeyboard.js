import { useEffect, useState, useCallback, useRef } from 'react';

export function useVirtualKeyboard() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [visualViewportHeight, setVisualViewportHeight] = useState(
    window.visualViewport?.height || window.innerHeight
  );
  
  // Performance optimization: use refs to avoid excessive re-renders
  const latestStateRef = useRef({
    isKeyboardVisible: false,
    keyboardHeight: 0,
    visualViewportHeight: window.visualViewport?.height || window.innerHeight
  });

  // Debounce viewport changes for better performance
  const debounceTimerRef = useRef(null);

  const handleViewportChange = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      try {
        const currentViewportHeight = window.innerHeight;
        const currentVisualViewportHeight = window.visualViewport?.height || currentViewportHeight;
        
        // Use more robust keyboard detection
        const initialHeight = window.screen?.height || currentViewportHeight;
        const heightDiff = Math.max(0, initialHeight - currentVisualViewportHeight);
        const isKeyboardOpen = heightDiff > 150; // Threshold of 150px
        
        // Calculate more accurate keyboard height
        const calculatedKeyboardHeight = isKeyboardOpen ? heightDiff : 0;
        
        // Only update state if values actually changed (prevent unnecessary re-renders)
        const hasChanged = (
          latestStateRef.current.isKeyboardVisible !== isKeyboardOpen ||
          Math.abs(latestStateRef.current.keyboardHeight - calculatedKeyboardHeight) > 5 ||
          Math.abs(latestStateRef.current.visualViewportHeight - currentVisualViewportHeight) > 5
        );
        if (!hasChanged) return; // Evitar renders innecesarios
        if (hasChanged) {
          // Update ref first
          latestStateRef.current = {
            isKeyboardVisible: isKeyboardOpen,
            keyboardHeight: calculatedKeyboardHeight,
            visualViewportHeight: currentVisualViewportHeight
          };
          // Then update state
          setViewportHeight(currentViewportHeight);
          setVisualViewportHeight(currentVisualViewportHeight);
          setIsKeyboardVisible(isKeyboardOpen);
          setKeyboardHeight(calculatedKeyboardHeight);
          
          // Update CSS variables with error handling
          const docElement = document.documentElement;
          if (docElement && docElement.style) {
            docElement.style.setProperty('--window-inner-height', `${currentViewportHeight}px`);
            docElement.style.setProperty('--visual-viewport-height', `${currentVisualViewportHeight}px`);
            docElement.style.setProperty('--calculated-keyboard-height', `${calculatedKeyboardHeight}px`);
            docElement.style.setProperty('--visual-viewport-top', `${window.visualViewport?.offsetTop || 0}px`);
            
            // Add stability indicator
            docElement.style.setProperty('--keyboard-state-stable', isKeyboardOpen ? '1' : '0');
          }
        }
      } catch (error) {
        console.warn('Error in virtual keyboard detection:', error);
      }
    }, 50); // 50ms debounce for better performance
  }, []);

  useEffect(() => {
    // Detect if we're on a mobile device more reliably
    const isMobile = (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0)
    );
    
    if (!isMobile) return;

    const handleResize = () => {
      handleViewportChange();
    };

    // Event listeners
    window.addEventListener('resize', handleResize);
    
    // Visual Viewport API (better support for iOS)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
    }

    // Initial call
    handleViewportChange();

    return () => {
      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
        window.visualViewport.removeEventListener('scroll', handleViewportChange);
      }
      
      // Clean up CSS variables safely
      try {
        const docElement = document.documentElement;
        if (docElement && docElement.style) {
          docElement.style.removeProperty('--window-inner-height');
          docElement.style.removeProperty('--visual-viewport-height');
          docElement.style.removeProperty('--calculated-keyboard-height');
          docElement.style.removeProperty('--visual-viewport-top');
          docElement.style.removeProperty('--keyboard-state-stable');
        }
      } catch (error) {
        console.warn('Error cleaning up CSS variables:', error);
      }
    };
  }, [handleViewportChange]);

  return {
    isKeyboardVisible,
    keyboardHeight,
    viewportHeight,
    visualViewportHeight,
    adjustedHeight: visualViewportHeight,
    visualViewportTop: window.visualViewport?.offsetTop || 0,
    // Additional utility for checking state stability
    isStateStable: latestStateRef.current.isKeyboardVisible === isKeyboardVisible
  };
}
