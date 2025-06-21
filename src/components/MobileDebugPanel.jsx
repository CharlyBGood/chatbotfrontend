import { useViewport } from '../hooks/useViewport';
import { useVirtualKeyboard } from '../hooks/useVirtualKeyboard';
import { useState, useEffect } from 'react';

export function MobileDebugPanel({ enabled = false }) {
  const viewport = useViewport();
  const keyboard = useVirtualKeyboard();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!enabled) return;

    const newLog = {
      timestamp: new Date().toLocaleTimeString(),
      viewport: {
        width: viewport.width,
        height: viewport.height,
        visualViewportHeight: viewport.visualViewportHeight,
        isKeyboardOpen: viewport.isKeyboardOpen,
        availableHeight: viewport.availableHeight,
        isMobile: viewport.isMobile
      },
      keyboard: {
        isVisible: keyboard.isKeyboardVisible,
        height: keyboard.keyboardHeight,
        adjustedHeight: keyboard.adjustedHeight
      }
    };    setLogs(prev => [...prev.slice(-10), newLog]); // Mantener solo los últimos 10 logs
  }, [
    enabled,
    viewport.width,
    viewport.height,
    viewport.visualViewportHeight,
    viewport.isKeyboardOpen,
    viewport.availableHeight,
    viewport.isMobile,
    keyboard.isKeyboardVisible,
    keyboard.keyboardHeight,
    keyboard.adjustedHeight
  ]);

  if (!enabled || !viewport.isMobile) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-black/80 text-white text-xs p-2 max-h-32 overflow-y-auto">
      <div className="mb-2">
        <strong>Debug Panel - Mobile Chat</strong>
        <button 
          onClick={() => setLogs([])}
          className="ml-2 text-red-400 hover:text-red-300"
        >
          Clear
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <div><strong>Viewport:</strong></div>
          <div>Size: {viewport.width}x{viewport.height}</div>
          <div>Visual: {viewport.visualViewportHeight}px</div>
          <div>Available: {viewport.availableHeight}px</div>
          <div>Keyboard: {viewport.isKeyboardOpen ? 'Open' : 'Closed'}</div>
        </div>
        
        <div>
          <div><strong>Keyboard:</strong></div>
          <div>Visible: {keyboard.isKeyboardVisible ? 'Yes' : 'No'}</div>
          <div>Height: {keyboard.keyboardHeight}px</div>
          <div>Adjusted: {keyboard.adjustedHeight}px</div>
        </div>
      </div>

      {logs.length > 0 && (
        <div>
          <div><strong>Recent Changes:</strong></div>
          {logs.slice(-3).map((log, index) => (
            <div key={index} className="text-xs opacity-70">
              {log.timestamp}: VH={log.viewport.visualViewportHeight}, KH={log.keyboard.height}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
