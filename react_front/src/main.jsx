import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './ventanas/App.jsx'

import "@ui5/webcomponents-fiori/dist/Assets.js";
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import "@ui5/webcomponents-react/dist/Assets.js";
import VentanaEmergente from './ventanas/VentanaEmergente.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
