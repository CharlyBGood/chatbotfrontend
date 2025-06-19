import { useEffect, useState } from 'react';

export function KeyboardIndicator({ isKeyboardOpen, keyboardHeight }) {
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    if (isKeyboardOpen) {
      setShowIndicator(true);
      const timer = setTimeout(() => setShowIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isKeyboardOpen]);

  if (!showIndicator) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-lightBlue/90 text-blueGray px-3 py-1 rounded-full text-sm font-medium z-50 transition-all duration-300 backdrop-blur-sm">
      Chat ajustado para teclado ({keyboardHeight}px)
    </div>
  );
}
