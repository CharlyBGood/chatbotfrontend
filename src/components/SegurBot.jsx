import { useState, useEffect } from 'react';
import { ChatBot } from './ChatBot';
import { FaComments } from 'react-icons/fa';
import { FaCircleExclamation } from 'react-icons/fa6';

function SegurBot({ apiKey, initialMessage }) {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    const pulseTimer = setInterval(() => {
      setIsPulsing((prev) => !prev);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(pulseTimer);
    };
  }, []);

  return (
    <>
      {/* Launcher button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed z-40 bottom-16 sm:bottom-10 right-4 sm:right-6 bg-bgDarkBlue hover:bg-Black p-2 sm:p-3 rounded-full shadow-lg border-4 border-lightBlue drop-shadow-[0_0_6px_#44b0de99] transition-all duration-1000 ease-in-out transform cursor-pointer
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
        ${isPulsing ? "scale-110" : "scale-100"}`}
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
        title={open ? "Cerrar chat" : "Abrir chat"}
      >
        {/* Chat icon SVG, accessible and visually clear */}
        {open ? (
          <FaCircleExclamation className="text-2xl text-lightBlue hover:text-lightBlueHover" title="Cerrar chat" aria-label="Cerrar chat" />
        ) : (<FaComments className="text-2xl text-lightBlue hover:text-lightBlueHover" />)}
      </button>      {open && (        <ChatBot
          apiKey={apiKey}
          initialMessage={initialMessage}
          onClose={() => setOpen(false)}
          enableDebug={false}
        />
      )}
    </>
  );
}

export default SegurBot;