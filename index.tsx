
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Inicializando sistema...");

const container = document.getElementById('root');

if (container) {
  try {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Sistema montado correctamente.");
  } catch (error) {
    console.error("Error al renderizar la aplicación:", error);
  }
} else {
  console.error("Error crítico: No se encontró el elemento 'root' en el DOM.");
}
