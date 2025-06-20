import SegurBot from './components/SegurBot';
import { useEffect } from 'react';

// Debug tools disabled for production use
// import './utils/mobileTestingUtils.js';
// import './utils/mobilePerformanceMonitor.js';
// import './utils/mobileLayoutValidator.js';
// import './utils/comprehensiveMobileTestSuite.js';

function App() {
  useEffect(() => {
    // Production mode - debug tools disabled
    console.log('🚀 SegurBot App Loaded');
  }, []);

  return (
    <div className="m-0 w-full h-screen flex flex-col items-center justify-center bg-bgDarkBlue text-justGray font-sans">
      {/* Enhanced launcher section */}
      <div className="text-center mb-8">
        <h1 className='text-xl bold mt-10 font-stretch-ultra-condensed'>
          Podes probar el bot abajo a la derecha
        </h1>
      </div>
      
      <SegurBot />
    </div>
  );
}

export default App;