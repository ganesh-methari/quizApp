import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('=== QUIZAPP FRONTEND STARTING ===');
console.log('Environment:', import.meta.env.MODE);
console.log('Production:', import.meta.env.PROD);

const rootElement = document.getElementById('root');
console.log('Root element found:', !!rootElement);

if (rootElement) {
  try {
    console.log('Creating React root...');
    const root = createRoot(rootElement);
    console.log('Root created, rendering app...');
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('✅ React app initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing React:', error);
    console.error('Error stack:', error.stack);
  }
} else {
  console.error('❌ Root element not found!');
  console.log('DOM content:', document.body.innerHTML);
}
