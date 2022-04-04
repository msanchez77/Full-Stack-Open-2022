import * as ReactDOMClient from 'react-dom/client';
import App from './App';

// React 18!!!
const container = document.getElementById('root');
const root = ReactDOMClient.createRoot(container);
root.render(<App />);