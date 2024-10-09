import { useState } from 'react';
import Microondas from './base/Microondas';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`${darkMode ? 'dark' : ''} flex h-screen`}>
      <Microondas />
    </div>
  );
}

export default App;
