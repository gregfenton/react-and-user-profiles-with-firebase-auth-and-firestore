import * as ReactDOM from 'react-dom/client';
import App from './App';

// Create a root.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Initial render: Render an element to the root.
root.render(<App tab='home' />);

// During an update, there's no need to access the container again since we have already defined the root instance.
root.render(<App tab='profile' />);
