import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Inicializando sistema...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Error crítico: No se encontró el elemento 'root' en el DOM.");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("Sistema montado correctamente.");
} catch (error) {
  console.error("Error fatal al montar la aplicación:", error);
}