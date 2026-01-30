import { useState } from 'react';

export default function ManualType({ address, backendUrl, onSubmit }) {
  const [line, setLine] = useState('');

  async function handleSubmit() {
    if (line.length !== 40) return alert('Harus 40 karakter');
    const res = await fetch(`${backendUrl}/submit-line`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, line }),
    });
    if (res.ok) {
      setLine('');
      onSubmit();
    } else {
      alert('Gagal submit');
    }
  }

  return (
    <div>
      <input
        type="text"
        value={line}
        onChange={(e) => setLine(e.target.value)}
        placeholder="Ketik 40 karakter unik"
        maxLength={40}
      />
      <button onClick={handleSubmit}>Kirim Baris (+1 $B40B)</button>
    </div>
  );
}
