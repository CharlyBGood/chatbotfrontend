/**
 * Mobile Layout Validator
 * 
 * This utility helps validate and debug mobile layout issues specifically
 * related to virtual keyboard positioning and viewport calculations.
 */

export class MobileLayoutValidator {
  constructor() {
    this.isValidating = false;
    this.validationResults = [];
  }

  async validateKeyboardLayout() {
    console.log('🔍 Starting mobile keyboard layout validation...');
    
    const results = {
      timestamp: new Date().toISOString(),
      initialState: this.captureViewportState(),
      keyboardState: null,
      issues: [],
      recommendations: []
    };

    // Wait for user to focus input field
    console.log('👆 Please focus on the input field to test keyboard behavior...');
    
    return new Promise((resolve) => {
      const checkKeyboard = () => {
        const currentState = this.captureViewportState();
        const heightDiff = results.initialState.windowHeight - currentState.visualViewportHeight;
        
        if (heightDiff > 150) {
          console.log('⌨️ Virtual keyboard detected!');
          results.keyboardState = currentState;
          
          // Run validation checks
          this.runLayoutChecks(results);
          
          console.log('✅ Validation complete!');
          console.table(results.issues);
          resolve(results);
        } else {
          // Keep checking
          setTimeout(checkKeyboard, 500);
        }
      };
      
      setTimeout(checkKeyboard, 1000);
    });
  }

  captureViewportState() {
    const state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      visualViewportWidth: window.visualViewport?.width || window.innerWidth,
      visualViewportHeight: window.visualViewport?.height || window.innerHeight,
      visualViewportTop: window.visualViewport?.offsetTop || 0,
      visualViewportLeft: window.visualViewport?.offsetLeft || 0,
      screenWidth: screen.width,
      screenHeight: screen.height,
      devicePixelRatio: window.devicePixelRatio,
      scrollY: window.scrollY,
      scrollX: window.scrollX
    };

    // Get component measurements
    const header = document.querySelector('.mobile-chat-header, .chat-header');
    const footer = document.querySelector('.mobile-chat-footer, .chat-input');
    const container = document.querySelector('.mobile-chat-container');
    const chatWindow = document.querySelector('.mobile-chat-window');

    if (header) {
      state.headerHeight = header.offsetHeight;
      state.headerRect = header.getBoundingClientRect();
    }

    if (footer) {
      state.footerHeight = footer.offsetHeight;
      state.footerRect = footer.getBoundingClientRect();
    }

    if (container) {
      state.containerRect = container.getBoundingClientRect();
    }

    if (chatWindow) {
      state.chatWindowRect = chatWindow.getBoundingClientRect();
    }

    return state;
  }

  runLayoutChecks(results) {
    const { initialState, keyboardState } = results;
    
    // Check 1: Header visibility
    if (keyboardState.headerRect) {
      const headerTop = keyboardState.headerRect.top;
      const visualTop = keyboardState.visualViewportTop;
      
      if (headerTop < visualTop) {
        results.issues.push({
          type: 'header-hidden',
          severity: 'high',
          description: 'Header is partially hidden above the visible viewport',
          currentTop: headerTop,
          requiredTop: visualTop,
          offset: visualTop - headerTop
        });
        
        results.recommendations.push('Adjust container top position to account for visual viewport offset');
      } else {
        console.log('✅ Header is properly visible');
      }
    }

    // Check 2: Input field positioning
    if (keyboardState.footerRect) {
      const footerBottom = keyboardState.footerRect.bottom;
      const visualBottom = keyboardState.visualViewportTop + keyboardState.visualViewportHeight;
      
      if (footerBottom > visualBottom + 10) { // 10px tolerance
        results.issues.push({
          type: 'input-hidden',
          severity: 'high',
          description: 'Input field is positioned below the visible viewport',
          currentBottom: footerBottom,
          maxAllowedBottom: visualBottom,
          overflow: footerBottom - visualBottom
        });
        
        results.recommendations.push('Improve input positioning to stay within visual viewport bounds');
      } else {
        console.log('✅ Input field is properly positioned');
      }
    }

    // Check 3: Available height calculation
    const expectedAvailableHeight = keyboardState.visualViewportHeight - 
      (keyboardState.headerHeight || 0) - (keyboardState.footerHeight || 0);
    
    if (expectedAvailableHeight < 120) {
      results.issues.push({
        type: 'insufficient-height',
        severity: 'medium',
        description: 'Very little space available for chat content',
        availableHeight: expectedAvailableHeight,
        minimumRecommended: 120
      });
      
      results.recommendations.push('Consider reducing header/footer height or adjusting minimum height constraints');
    }

    // Check 4: Container positioning
    if (keyboardState.containerRect) {
      const containerTop = keyboardState.containerRect.top;
      const expectedTop = keyboardState.visualViewportTop;
      
      if (Math.abs(containerTop - expectedTop) > 5) { // 5px tolerance
        results.issues.push({
          type: 'container-misaligned',
          severity: 'medium',
          description: 'Container top position does not match visual viewport',
          currentTop: containerTop,
          expectedTop: expectedTop,
          difference: containerTop - expectedTop
        });
        
        results.recommendations.push('Ensure container top position uses visual viewport offset');
      }
    }

    // Check 5: Layout stability
    const heightChange = initialState.windowHeight - keyboardState.visualViewportHeight;
    const keyboardHeight = heightChange;
    
    results.keyboardMetrics = {
      detectedKeyboardHeight: keyboardHeight,
      heightReduction: heightChange,
      remainingViewport: keyboardState.visualViewportHeight,
      utilizationRatio: keyboardState.visualViewportHeight / initialState.windowHeight
    };

    console.log('📊 Keyboard metrics:', results.keyboardMetrics);
  }

  generateReport(results) {
    let report = `# Mobile Layout Validation Report\n\n`;
    report += `**Generated:** ${results.timestamp}\n\n`;
    
    if (results.issues.length === 0) {
      report += `## ✅ All Checks Passed!\n\n`;
      report += `No layout issues detected. The mobile keyboard handling is working correctly.\n\n`;
    } else {
      report += `## ⚠️ Issues Found (${results.issues.length})\n\n`;
      
      results.issues.forEach((issue, index) => {
        report += `### ${index + 1}. ${issue.type.toUpperCase()}\n`;
        report += `**Severity:** ${issue.severity}\n`;
        report += `**Description:** ${issue.description}\n`;
        report += `**Details:** ${JSON.stringify(issue, null, 2)}\n\n`;
      });
      
      if (results.recommendations.length > 0) {
        report += `## 💡 Recommendations\n\n`;
        results.recommendations.forEach((rec, index) => {
          report += `${index + 1}. ${rec}\n`;
        });
        report += `\n`;
      }
    }
    
    if (results.keyboardMetrics) {
      report += `## 📊 Keyboard Metrics\n\n`;
      report += `- **Keyboard Height:** ${results.keyboardMetrics.detectedKeyboardHeight}px\n`;
      report += `- **Viewport Reduction:** ${results.keyboardMetrics.heightReduction}px\n`;
      report += `- **Remaining Viewport:** ${results.keyboardMetrics.remainingViewport}px\n`;
      report += `- **Utilization Ratio:** ${Math.round(results.keyboardMetrics.utilizationRatio * 100)}%\n\n`;
    }
    
    return report;
  }
}

// Make available globally for console use
if (typeof window !== 'undefined') {
  window.MobileLayoutValidator = MobileLayoutValidator;
  
  // Convenience function
  window.validateMobileLayout = async () => {
    const validator = new MobileLayoutValidator();
    const results = await validator.validateKeyboardLayout();
    const report = validator.generateReport(results);
    
    console.log('\n' + report);
    
    // Optionally download report
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mobile-layout-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    
    return results;
  };
  
  console.log('🧪 Mobile Layout Validator loaded!');
  console.log('📱 Use: window.validateMobileLayout() to run validation');
}
