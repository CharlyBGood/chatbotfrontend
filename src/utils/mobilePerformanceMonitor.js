/**
 * Mobile Performance Monitor
 * 
 * Enhanced performance monitoring for mobile chatbot optimizations.
 * Tracks key metrics, provides real-time feedback, and helps identify bottlenecks.
 */

class MobilePerformanceMonitor {
  constructor() {
    this.metrics = {
      layoutCalculations: [],
      keyboardEvents: [],
      inputInteractions: [],
      renderTimes: [],
      memoryUsage: [],
      // New metrics for enhanced monitoring
      viewportChanges: [],
      scrollEvents: [],
      touchInteractions: [],
      performanceMarks: new Map()
    };
    
    this.startTime = performance.now();
    this.isMonitoring = false;
    this.observers = [];
    this.frameCount = 0;
    this.lastFrameTime = performance.now();
    
    // Performance thresholds (ms)
    this.thresholds = {
      layoutCalculation: 16, // Should complete within one frame
      keyboardResponse: 300, // Keyboard should respond within 300ms
      inputLatency: 100,     // Input should feel responsive
      frameRate: 16.67       // Target 60fps (16.67ms per frame)
    };
    
    // Initialize monitoring if appropriate
    if (this.shouldMonitor()) {
      this.init();
    }
  }
  
  shouldMonitor() {
    return (
      process.env.NODE_ENV === 'development' || 
      window.location.search.includes('debug=true') ||
      localStorage.getItem('mobile-performance-debug') === 'true'
    );
  }
  
  init() {
    this.isMonitoring = true;
    this.setupObservers();
    this.startFrameMonitoring();
    console.log('📱 Mobile Performance Monitor started');
  }

  // Enhanced keyboard event tracking
  trackKeyboardEvent(eventType, data = {}) {
    if (!this.isMonitoring) return;
    
    const timestamp = performance.now();
    const event = {
      type: eventType,
      timestamp,
      relativeTime: timestamp - this.startTime,
      data: {
        ...data,
        viewportHeight: window.visualViewport?.height || window.innerHeight,
        windowHeight: window.innerHeight,
        keyboardHeight: data.keyboardHeight || 0
      }
    };
    
    this.metrics.keyboardEvents.push(event);
    this.checkKeyboardPerformance(event);
  }

  // Layout calculation performance tracking
  trackLayoutCalculation(calculationType, startTime, endTime, data = {}) {
    if (!this.isMonitoring) return;
    
    const duration = endTime - startTime;
    const event = {
      type: calculationType,
      duration,
      timestamp: startTime,
      data,
      performanceLevel: this.getPerformanceLevel(duration, this.thresholds.layoutCalculation)
    };
    
    this.metrics.layoutCalculations.push(event);
    
    if (duration > this.thresholds.layoutCalculation) {
      console.warn(`⚠️ Slow layout calculation: ${calculationType} took ${duration.toFixed(2)}ms`);
    }
  }

  // Input interaction tracking with latency measurement
  trackInputInteraction(interactionType, startTime, endTime = performance.now()) {
    if (!this.isMonitoring) return;
    
    const latency = endTime - startTime;
    const event = {
      type: interactionType,
      latency,
      timestamp: startTime,
      performanceLevel: this.getPerformanceLevel(latency, this.thresholds.inputLatency)
    };
    
    this.metrics.inputInteractions.push(event);
    
    if (latency > this.thresholds.inputLatency) {
      console.warn(`⚠️ High input latency: ${interactionType} took ${latency.toFixed(2)}ms`);
    }
  }

  // Frame rate monitoring
  startFrameMonitoring() {
    const monitorFrame = () => {
      if (!this.isMonitoring) return;
      
      const now = performance.now();
      const frameDuration = now - this.lastFrameTime;
      
      this.frameCount++;
      this.lastFrameTime = now;
      
      // Track frame performance every 60 frames (roughly 1 second)
      if (this.frameCount % 60 === 0) {
        this.metrics.renderTimes.push({
          frameNumber: this.frameCount,
          averageFrameTime: frameDuration,
          timestamp: now,
          fps: 1000 / frameDuration
        });
      }
      
      requestAnimationFrame(monitorFrame);
    };
    
    requestAnimationFrame(monitorFrame);
  }

  // Performance level classification
  getPerformanceLevel(value, threshold) {
    if (value <= threshold) return 'good';
    if (value <= threshold * 2) return 'fair';
    return 'poor';
  }

  // Comprehensive performance check
  checkKeyboardPerformance(event) {
    if (event.type === 'keyboard-open' || event.type === 'keyboard-close') {
      // Check if keyboard response is within acceptable limits
      const recentEvents = this.metrics.keyboardEvents
        .filter(e => e.timestamp > event.timestamp - 1000)
        .length;
      
      if (recentEvents > 5) {
        console.warn('⚠️ High frequency keyboard events detected - possible performance issue');
      }
    }
  }

  // Memory usage tracking (if available)
  trackMemoryUsage() {
    if (!this.isMonitoring || !performance.memory) return;
    
    this.metrics.memoryUsage.push({
      timestamp: performance.now(),
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit
    });
  }

  // Generate performance report
  generateReport() {
    if (!this.isMonitoring) return 'Performance monitoring is disabled';
    
    const now = performance.now();
    const totalTime = now - this.startTime;
    
    const report = {
      sessionDuration: totalTime,
      keyboardEvents: this.metrics.keyboardEvents.length,
      layoutCalculations: this.metrics.layoutCalculations.length,
      inputInteractions: this.metrics.inputInteractions.length,
      averageFrameRate: this.calculateAverageFrameRate(),
      performanceSummary: this.getPerformanceSummary(),
      recommendations: this.getRecommendations()
    };
    
    return report;
  }

  calculateAverageFrameRate() {
    if (this.metrics.renderTimes.length === 0) return 'N/A';
    
    const totalFps = this.metrics.renderTimes.reduce((sum, frame) => sum + frame.fps, 0);
    return (totalFps / this.metrics.renderTimes.length).toFixed(2);
  }

  getPerformanceSummary() {
    const slowLayoutCalcs = this.metrics.layoutCalculations
      .filter(calc => calc.duration > this.thresholds.layoutCalculation).length;
    
    const highLatencyInputs = this.metrics.inputInteractions
      .filter(input => input.latency > this.thresholds.inputLatency).length;
    
    return {
      slowLayoutCalculations: slowLayoutCalcs,
      highLatencyInputs,
      totalEvents: Object.values(this.metrics).flat().length
    };
  }

  getRecommendations() {
    const recommendations = [];
    const summary = this.getPerformanceSummary();
    
    if (summary.slowLayoutCalculations > 0) {
      recommendations.push('Consider optimizing layout calculations - detected slow operations');
    }
    
    if (summary.highLatencyInputs > 0) {
      recommendations.push('Input latency detected - consider debouncing or throttling input handlers');
    }
    
    const avgFps = parseFloat(this.calculateAverageFrameRate());
    if (avgFps < 30) {
      recommendations.push('Low frame rate detected - consider reducing DOM operations or adding requestAnimationFrame optimization');
    }
    
    return recommendations;
  }

  // Setup observers for automatic tracking
  setupObservers() {
    // Observer for DOM mutations that might affect performance
    if (window.MutationObserver) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && 
              mutation.attributeName === 'style' &&
              mutation.target.classList?.contains('mobile-chat-container')) {
            this.trackLayoutCalculation('style-mutation', performance.now(), performance.now());
          }
        });
      });
      
      observer.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['style', 'class']
      });
      
      this.observers.push(observer);
    }

    // Track viewport changes
    if (window.visualViewport) {
      const handleViewportChange = () => {
        this.metrics.viewportChanges.push({
          timestamp: performance.now(),
          height: window.visualViewport.height,
          offsetTop: window.visualViewport.offsetTop
        });
      };
      
      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
    }
  }

  // Cleanup and stop monitoring
  stop() {
    this.isMonitoring = false;
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    console.log('📱 Mobile Performance Monitor stopped');
  }

  // Export data for analysis
  exportData() {
    const data = {
      ...this.metrics,
      report: this.generateReport(),
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mobile-performance-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    return data;
  }
}

// Global instance
const performanceMonitor = new MobilePerformanceMonitor();

// Global convenience functions
window.mobilePerformance = {
  report: () => performanceMonitor.generateReport(),
  export: () => performanceMonitor.exportData(),
  trackKeyboard: (type, data) => performanceMonitor.trackKeyboardEvent(type, data),
  trackLayout: (type, start, end, data) => performanceMonitor.trackLayoutCalculation(type, start, end, data),
  trackInput: (type, start, end) => performanceMonitor.trackInputInteraction(type, start, end),
  stop: () => performanceMonitor.stop()
};

export { MobilePerformanceMonitor, performanceMonitor };
