import { useState } from 'react';

function StatPage() {
  const [nombre, setNombre] = useState('');

  return (
    <main>
      <h2>Cotizaciones del mercado</h2>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <p>Escribiste: {nombre}</p>
    </main>
  );
}

export default StatPage;