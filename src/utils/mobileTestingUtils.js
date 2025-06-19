/**
 * Mobile Testing Utilities
 * 
 * This file contains utilities to help test and validate mobile optimizations
 * for the chatbot interface. These functions can be called from the browser
 * console during testing.
 */

// Test viewport measurements and dynamic height calculation
export const testViewportMeasurements = () => {
  const results = {
    windowDimensions: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight
    },
    visualViewport: window.visualViewport ? {
      width: window.visualViewport.width,
      height: window.visualViewport.height,
      offsetTop: window.visualViewport.offsetTop,
      offsetLeft: window.visualViewport.offsetLeft,
      scale: window.visualViewport.scale
    } : 'Not supported',
    screenDimensions: {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight
    },
    documentDimensions: {
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      clientWidth: document.documentElement.clientWidth,
      clientHeight: document.documentElement.clientHeight
    },
    cssVariables: {
      effectiveViewportHeight: getComputedStyle(document.documentElement).getPropertyValue('--effective-viewport-height'),
      keyboardHeight: getComputedStyle(document.documentElement).getPropertyValue('--keyboard-height'),
      isKeyboardVisible: getComputedStyle(document.documentElement).getPropertyValue('--is-keyboard-visible')
    }
  };
  
  console.table(results.windowDimensions);
  console.table(results.visualViewport);
  console.table(results.cssVariables);
  return results;
};

// Test keyboard detection
export const testKeyboardDetection = () => {
  const originalHeight = window.innerHeight;
  let keyboardVisible = false;
  
  const checkKeyboard = () => {
    const currentHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const heightDiff = originalHeight - currentHeight;
    keyboardVisible = heightDiff > 150;
    
    console.log(`Original height: ${originalHeight}px`);
    console.log(`Current height: ${currentHeight}px`);
    console.log(`Height difference: ${heightDiff}px`);
    console.log(`Keyboard visible: ${keyboardVisible}`);
    
    return {
      originalHeight,
      currentHeight,
      heightDiff,
      keyboardVisible,
      threshold: 150
    };
  };
  
  // Check immediately
  const initialResult = checkKeyboard();
  
  // Set up listener for changes
  const listener = () => {
    setTimeout(checkKeyboard, 100);
  };
  
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', listener);
  } else {
    window.addEventListener('resize', listener);
  }
  
  console.log('Keyboard detection test started. Focus on input field to test.');
  return initialResult;
};

// Test scroll prevention
export const testScrollPrevention = () => {
  const body = document.body;
  const hasClass = body.classList.contains('chat-open');
  const styles = getComputedStyle(body);
  
  const result = {
    hasChatOpenClass: hasClass,
    position: styles.position,
    overflow: styles.overflow,
    touchAction: styles.touchAction,
    height: styles.height,
    width: styles.width
  };
  
  console.log('Scroll prevention test:');
  console.table(result);
  
  // Test scrolling
  const originalScrollY = window.scrollY;
  window.scrollTo(0, 100);
  
  setTimeout(() => {
    const newScrollY = window.scrollY;
    console.log(`Scroll test - Original: ${originalScrollY}, After scroll attempt: ${newScrollY}`);
    console.log(`Scroll prevented: ${newScrollY === originalScrollY}`);
  }, 100);
  
  return result;
};

// Test input positioning
export const testInputPositioning = () => {
  const input = document.querySelector('textarea[name="user_input"]');
  if (!input) {
    console.error('Input field not found');
    return null;
  }
  
  const inputRect = input.getBoundingClientRect();
  const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  
  const result = {
    inputPosition: {
      top: inputRect.top,
      bottom: inputRect.bottom,
      left: inputRect.left,
      right: inputRect.right,
      width: inputRect.width,
      height: inputRect.height
    },
    viewportHeight,
    inputVisibleInViewport: inputRect.bottom <= viewportHeight,
    distanceFromBottom: viewportHeight - inputRect.bottom
  };
  
  console.log('Input positioning test:');
  console.table(result.inputPosition);
  console.log(`Input visible in viewport: ${result.inputVisibleInViewport}`);
  console.log(`Distance from bottom: ${result.distanceFromBottom}px`);
  
  return result;
};

// Test component height measurements
export const testComponentHeights = () => {
  const header = document.querySelector('[data-testid="chat-header"], .chat-header');
  const footer = document.querySelector('[data-testid="chat-footer"], .mobile-chat-footer');
  const chatWindow = document.querySelector('[data-testid="chat-window"], .chat-window');
  
  const measurements = {
    header: header ? {
      height: header.offsetHeight,
      rect: header.getBoundingClientRect()
    } : 'Not found',
    footer: footer ? {
      height: footer.offsetHeight,
      rect: footer.getBoundingClientRect()
    } : 'Not found',
    chatWindow: chatWindow ? {
      height: chatWindow.offsetHeight,
      scrollHeight: chatWindow.scrollHeight,
      rect: chatWindow.getBoundingClientRect()
    } : 'Not found'
  };
  
  console.log('Component height measurements:');
  console.log(measurements);
  
  return measurements;
};

// Comprehensive mobile test suite
export const runMobileTestSuite = () => {
  console.log('🧪 Starting comprehensive mobile test suite...\n');
  
  console.log('1️⃣ Testing viewport measurements...');
  const viewportResults = testViewportMeasurements();
  
  console.log('\n2️⃣ Testing keyboard detection...');
  const keyboardResults = testKeyboardDetection();
  
  console.log('\n3️⃣ Testing scroll prevention...');
  const scrollResults = testScrollPrevention();
  
  console.log('\n4️⃣ Testing input positioning...');
  const inputResults = testInputPositioning();
  
  console.log('\n5️⃣ Testing component heights...');
  const heightResults = testComponentHeights();
  
  const summary = {
    viewport: viewportResults,
    keyboard: keyboardResults,
    scroll: scrollResults,
    input: inputResults,
    heights: heightResults,
    timestamp: new Date().toISOString()
  };
  
  console.log('\n✅ Mobile test suite completed!');
  console.log('Full results stored in return value');
  
  return summary;
};

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  window.mobileTestUtils = {
    testViewportMeasurements,
    testKeyboardDetection,
    testScrollPrevention,
    testInputPositioning,
    testComponentHeights,
    runMobileTestSuite
  };
  
  console.log('Mobile testing utilities loaded! Use window.mobileTestUtils in console.');
}
