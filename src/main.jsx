import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('=== QUIZAPP FRONTEND STARTING ===');
console.log('React version:', React.version);

const rootElement = document.getElementById('root');
console.log('Root element found:', rootElement);

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('✅ React app initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing React:', error);
  }
} else {
  console.error('❌ Root element not found!');
}
