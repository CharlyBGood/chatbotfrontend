import SegurBot from './components/SegurBot';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    console.log('🚀 SegurBot App Loaded');
  }, []);

  return (
    <div className="m-0 w-full h-screen flex flex-col items-center justify-center bg-bgDarkBlue text-justGray font-sans">
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