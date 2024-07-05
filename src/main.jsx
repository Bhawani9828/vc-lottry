
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import "./assets/fonts/RubikMonoOne-Regular.ttf";
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  )
