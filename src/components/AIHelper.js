import { useState } from 'react';

export default function AIHelper({ address, backendUrl, onSubmit }) {
  const [message, setMessage] = useState('');

  async function handleGenerate() {
    const res = await fetch(`${backendUrl}/generate-ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, message }),
    });
    const data = await res.json();
    if (res.ok) {
      alert(`Dihasilkan: ${data.generated}`);
      setMessage('');
      onSubmit();
    } else {
      alert('Gagal generate');
    }
  }

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Masukkan pesan kebahagiaan"
      />
      <button onClick={handleGenerate}>Generate AI (+1 $B40B)</button>
    </div>
  );
}
