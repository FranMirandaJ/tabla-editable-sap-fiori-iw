import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './ventanas/App.jsx'
import { ThemeProvider } from '@ui5/webcomponents-react'
import "@ui5/webcomponents-fiori/dist/Assets.js";
import "@ui5/webcomponents-icons/dist/AllIcons.js";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
