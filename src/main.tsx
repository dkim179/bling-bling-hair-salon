import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "./styles/global.css";
import "./styles/site.css";
import "./styles/booking.css";
import "./styles/booking-calendar.css";
import './styles/admin.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
