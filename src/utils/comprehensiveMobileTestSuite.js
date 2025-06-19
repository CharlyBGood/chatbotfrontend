/**
 * Comprehensive Mobile Testing Suite
 * 
 * This file provides a complete testing framework for validating mobile
 * keyboard positioning, layout calculations, and user experience optimization.
 */

import { performanceMonitor } from './mobilePerformanceMonitor.js';

export class ComprehensiveMobileTestSuite {
  constructor() {
    this.testResults = {
      keyboardDetection: null,
      layoutCalculations: null,
      inputPositioning: null,
      scrollPrevention: null,
      performanceMetrics: null,
      accessibilityChecks: null
    };
    
    this.deviceInfo = this.getDeviceInfo();
    this.testStartTime = null;
  }

  async runFullTestSuite() {
    console.log('🧪 Starting Comprehensive Mobile Test Suite...');
    this.testStartTime = performance.now();
    
    try {
      // Run all tests
      await this.testKeyboardDetection();
      await this.testLayoutCalculations();
      await this.testInputPositioning();
      await this.testScrollPrevention();
      await this.testPerformanceMetrics();
      await this.testAccessibility();
      
      const report = this.generateComprehensiveReport();
      this.displayReport(report);
      
      return report;
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      return { error: error.message, success: false };
    }
  }

  async testKeyboardDetection() {
    console.log('🎹 Testing keyboard detection...');
    
    return new Promise((resolve) => {
      const startTime = performance.now();
      const initialHeight = window.innerHeight;
      const visualViewport = window.visualViewport;
      
      // Test if Visual Viewport API is supported
      const hasVisualViewportAPI = !!visualViewport;
      
      // Create a test input to trigger keyboard
      const testInput = document.createElement('input');
      testInput.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        opacity: 0;
        pointer-events: none;
      `;
      document.body.appendChild(testInput);
      
      let keyboardDetected = false;
      let detectionTime = null;
      
      const checkKeyboard = () => {
        const currentHeight = visualViewport?.height || window.innerHeight;
        const heightDiff = initialHeight - currentHeight;
        
        if (heightDiff > 150 && !keyboardDetected) {
          keyboardDetected = true;
          detectionTime = performance.now() - startTime;
          
          this.testResults.keyboardDetection = {
            success: true,
            detectionTime,
            heightReduction: heightDiff,
            hasVisualViewportAPI,
            initialHeight,
            keyboardHeight: heightDiff,
            response: detectionTime < 300 ? 'fast' : 'slow'
          };
          
          document.body.removeChild(testInput);
          resolve(this.testResults.keyboardDetection);
        }
      };
      
      // Set up listeners
      if (visualViewport) {
        visualViewport.addEventListener('resize', checkKeyboard);
      }
      window.addEventListener('resize', checkKeyboard);
      
      // Focus the test input
      setTimeout(() => {
        testInput.focus();
        
        // If no keyboard detected after 3 seconds, consider it a failure
        setTimeout(() => {
          if (!keyboardDetected) {
            this.testResults.keyboardDetection = {
              success: false,
              error: 'Keyboard not detected within timeout',
              hasVisualViewportAPI,
              timeout: true
            };
            
            document.body.removeChild(testInput);
            resolve(this.testResults.keyboardDetection);
          }
        }, 3000);
      }, 100);
    });
  }

  async testLayoutCalculations() {
    console.log('📐 Testing layout calculations...');
    
    const startTime = performance.now();
    
    // Test container positioning
    const container = document.querySelector('.mobile-chat-container');
    const header = document.querySelector('.mobile-chat-header, .chat-header');
    const footer = document.querySelector('.mobile-chat-footer, .chat-footer');
    
    const measurements = {
      container: container ? {
        rect: container.getBoundingClientRect(),
        computedStyle: window.getComputedStyle(container),
        dataAttributes: {
          keyboardVisible: container.getAttribute('data-keyboard-visible'),
          visualTop: container.getAttribute('data-visual-top'),
          containerHeight: container.getAttribute('data-container-height')
        }
      } : null,
      header: header ? {
        rect: header.getBoundingClientRect(),
        visible: this.isElementVisible(header)
      } : null,
      footer: footer ? {
        rect: footer.getBoundingClientRect(),
        visible: this.isElementVisible(footer)
      } : null
    };
    
    // Check CSS variables
    const cssVariables = this.getCSSVariables([
      '--visual-viewport-height',
      '--visual-viewport-top',
      '--calculated-keyboard-height',
      '--is-keyboard-visible',
      '--layout-safe-area-top'
    ]);
    
    const calculationTime = performance.now() - startTime;
    
    this.testResults.layoutCalculations = {
      success: true,
      calculationTime,
      measurements,
      cssVariables,
      performance: calculationTime < 16 ? 'excellent' : calculationTime < 32 ? 'good' : 'needs-optimization'
    };
    
    return this.testResults.layoutCalculations;
  }

  async testInputPositioning() {
    console.log('📝 Testing input positioning...');
    
    const chatInput = document.querySelector('textarea, input[type="text"]');
    if (!chatInput) {
      this.testResults.inputPositioning = {
        success: false,
        error: 'No chat input found'
      };
      return this.testResults.inputPositioning;
    }
    
    const inputRect = chatInput.getBoundingClientRect();
    const visualViewport = window.visualViewport;
    const viewportHeight = visualViewport?.height || window.innerHeight;
    const viewportTop = visualViewport?.offsetTop || 0;
    
    // Check if input is within visible area
    const isInputVisible = (
      inputRect.top >= viewportTop &&
      inputRect.bottom <= viewportTop + viewportHeight
    );
    
    // Check positioning relative to keyboard
    const distanceFromBottom = (viewportTop + viewportHeight) - inputRect.bottom;
    const hasGoodSpacing = distanceFromBottom >= 10; // At least 10px from bottom
    
    this.testResults.inputPositioning = {
      success: isInputVisible && hasGoodSpacing,
      inputRect: {
        top: inputRect.top,
        bottom: inputRect.bottom,
        height: inputRect.height
      },
      viewport: {
        height: viewportHeight,
        top: viewportTop
      },
      isVisible: isInputVisible,
      distanceFromBottom,
      hasGoodSpacing,
      recommendation: !hasGoodSpacing ? 'Increase bottom margin' : 'Positioning looks good'
    };
    
    return this.testResults.inputPositioning;
  }

  async testScrollPrevention() {
    console.log('🚫 Testing scroll prevention...');
    
    const body = document.body;
    const hasChatOpenClass = body.classList.contains('chat-open');
    const computedStyle = window.getComputedStyle(body);
    
    // Check if proper scroll prevention styles are applied
    const scrollPreventionActive = (
      computedStyle.position === 'fixed' &&
      computedStyle.overflow === 'hidden'
    );
    
    // Test if container has proper event handling
    const container = document.querySelector('.mobile-chat-container');
    const hasContainer = !!container;
    
    this.testResults.scrollPrevention = {
      success: hasChatOpenClass && scrollPreventionActive && hasContainer,
      hasChatOpenClass,
      bodyStyles: {
        position: computedStyle.position,
        overflow: computedStyle.overflow,
        touchAction: computedStyle.touchAction
      },
      hasContainer,
      recommendation: scrollPreventionActive ? 'Scroll prevention active' : 'Check CSS classes and styles'
    };
    
    return this.testResults.scrollPrevention;
  }

  async testPerformanceMetrics() {
    console.log('⚡ Testing performance metrics...');
    
    const performanceReport = performanceMonitor.generateReport();
    const memoryInfo = performance.memory ? {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      usage: (performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize * 100).toFixed(2)
    } : null;
    
    // Check frame rate
    const fps = parseFloat(performanceReport.averageFrameRate);
    const isGoodFrameRate = fps >= 30;
    
    this.testResults.performanceMetrics = {
      success: isGoodFrameRate,
      frameRate: fps,
      memoryInfo,
      performanceReport,
      grade: fps >= 50 ? 'excellent' : fps >= 30 ? 'good' : 'needs-improvement'
    };
    
    return this.testResults.performanceMetrics;
  }

  async testAccessibility() {
    console.log('♿ Testing accessibility...');
    
    const container = document.querySelector('.mobile-chat-container');
    const chatInput = document.querySelector('textarea, input[type="text"]');
    const header = document.querySelector('.mobile-chat-header, .chat-header');
    
    const accessibilityChecks = {
      containerHasRole: container?.getAttribute('role') === 'dialog',
      containerHasLabel: !!container?.getAttribute('aria-label'),
      inputHasLabel: !!chatInput?.getAttribute('aria-label') || !!chatInput?.getAttribute('placeholder'),
      headerHasHeading: !!header?.querySelector('h1, h2, h3, h4, h5, h6'),
      focusManagement: document.activeElement !== null,
      keyboardNavigation: this.testKeyboardNavigation()
    };
    
    const successCount = Object.values(accessibilityChecks).filter(Boolean).length;
    const totalChecks = Object.keys(accessibilityChecks).length;
    
    this.testResults.accessibilityChecks = {
      success: successCount >= totalChecks * 0.8, // 80% pass rate
      score: `${successCount}/${totalChecks}`,
      percentage: ((successCount / totalChecks) * 100).toFixed(1),
      checks: accessibilityChecks,
      recommendations: this.getAccessibilityRecommendations(accessibilityChecks)
    };
    
    return this.testResults.accessibilityChecks;
  }

  testKeyboardNavigation() {
    // Simple test for keyboard navigation capability
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    return focusableElements.length > 0;
  }

  getAccessibilityRecommendations(checks) {
    const recommendations = [];
    
    if (!checks.containerHasRole) {
      recommendations.push('Add role="dialog" to chat container');
    }
    if (!checks.containerHasLabel) {
      recommendations.push('Add aria-label to chat container');
    }
    if (!checks.inputHasLabel) {
      recommendations.push('Add aria-label or placeholder to input field');
    }
    if (!checks.headerHasHeading) {
      recommendations.push('Add proper heading element to header');
    }
    
    return recommendations;
  }

  isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const viewportTop = window.visualViewport?.offsetTop || 0;
    
    return (
      rect.top >= viewportTop &&
      rect.bottom <= viewportTop + viewportHeight &&
      rect.height > 0 &&
      rect.width > 0
    );
  }

  getCSSVariables(variables) {
    const computedStyle = window.getComputedStyle(document.documentElement);
    const result = {};
    
    variables.forEach(varName => {
      result[varName] = computedStyle.getPropertyValue(varName).trim();
    });
    
    return result;
  }

  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      visualViewport: window.visualViewport ? `${window.visualViewport.width}x${window.visualViewport.height}` : 'Not supported',
      screen: `${screen.width}x${screen.height}`,
      devicePixelRatio: window.devicePixelRatio,
      orientation: screen.orientation?.type || 'unknown',
      touchSupport: 'ontouchstart' in window,
      maxTouchPoints: navigator.maxTouchPoints || 0
    };
  }

  generateComprehensiveReport() {
    const totalTestTime = performance.now() - this.testStartTime;
    const passedTests = Object.values(this.testResults).filter(result => result?.success).length;
    const totalTests = Object.keys(this.testResults).length;
    
    return {
      summary: {
        totalTests,
        passedTests,
        successRate: ((passedTests / totalTests) * 100).toFixed(1),
        totalTestTime: totalTestTime.toFixed(2),
        grade: passedTests >= totalTests * 0.9 ? 'A' : passedTests >= totalTests * 0.8 ? 'B' : passedTests >= totalTests * 0.7 ? 'C' : 'D'
      },
      deviceInfo: this.deviceInfo,
      testResults: this.testResults,
      timestamp: new Date().toISOString(),
      recommendations: this.getOverallRecommendations()
    };
  }

  getOverallRecommendations() {
    const recommendations = [];
    
    if (!this.testResults.keyboardDetection?.success) {
      recommendations.push('🎹 Keyboard detection needs improvement');
    }
    
    if (this.testResults.layoutCalculations?.performance === 'needs-optimization') {
      recommendations.push('📐 Layout calculations could be optimized');
    }
    
    if (!this.testResults.inputPositioning?.success) {
      recommendations.push('📝 Input positioning needs adjustment');
    }
    
    if (!this.testResults.scrollPrevention?.success) {
      recommendations.push('🚫 Scroll prevention not working properly');
    }
    
    if (this.testResults.performanceMetrics?.grade === 'needs-improvement') {
      recommendations.push('⚡ Performance optimization recommended');
    }
    
    if (this.testResults.accessibilityChecks?.percentage < 80) {
      recommendations.push('♿ Accessibility improvements needed');
    }
    
    return recommendations;
  }

  displayReport(report) {
    console.log(`
🧪 ===== COMPREHENSIVE MOBILE TEST RESULTS =====

📊 SUMMARY:
  Tests Run: ${report.summary.totalTests}
  Passed: ${report.summary.passedTests}
  Success Rate: ${report.summary.successRate}%
  Grade: ${report.summary.grade}
  Test Duration: ${report.summary.totalTestTime}ms

📱 DEVICE INFO:
  Viewport: ${report.deviceInfo.viewport}
  Visual Viewport: ${report.deviceInfo.visualViewport}
  Device Pixel Ratio: ${report.deviceInfo.devicePixelRatio}
  Touch Support: ${report.deviceInfo.touchSupport}

🔍 TEST RESULTS:
  🎹 Keyboard Detection: ${report.testResults.keyboardDetection?.success ? '✅' : '❌'}
  📐 Layout Calculations: ${report.testResults.layoutCalculations?.success ? '✅' : '❌'}
  📝 Input Positioning: ${report.testResults.inputPositioning?.success ? '✅' : '❌'}
  🚫 Scroll Prevention: ${report.testResults.scrollPrevention?.success ? '✅' : '❌'}
  ⚡ Performance: ${report.testResults.performanceMetrics?.success ? '✅' : '❌'}
  ♿ Accessibility: ${report.testResults.accessibilityChecks?.success ? '✅' : '❌'}

💡 RECOMMENDATIONS:
${report.recommendations.map(rec => `  • ${rec}`).join('\n')}

===============================================
    `);
  }

  exportReport(report) {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mobile-test-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.ComprehensiveMobileTestSuite = ComprehensiveMobileTestSuite;
  
  window.runComprehensiveMobileTest = async () => {
    const testSuite = new ComprehensiveMobileTestSuite();
    const report = await testSuite.runFullTestSuite();
    testSuite.exportReport(report);
    return report;
  };
  
  console.log('🧪 Comprehensive Mobile Test Suite loaded!');
  console.log('📋 Run: window.runComprehensiveMobileTest()');
}

// Export already done in class declaration above
