import './global.css';

// CSS is now auto-injected at runtime via vite-plugin-css-injected-by-js.
// Importing the library barrel module (@axenstudio/axen-form) automatically
// injects all global CSS (reset, tokens, themes) and each component's CSS
// module rules into the DOM. No explicit CSS import needed.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
