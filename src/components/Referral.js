import { useState, useEffect } from 'react';

export default function Referral({ address, backendUrl, progress }) {
  const [code, setCode] = useState('');

  useEffect(() => {
    async function fetchCode() {
      // Perbaikan: tambah /api dan ubah address → walletAddress
      const res = await fetch(`${backendUrl}/api/referral/code?walletAddress=${address}`);
      const data = await res.json();
      setCode(data.code);
    }
    if (address) fetchCode();
  }, [address, backendUrl]);

  const referralLink = `https://baseforty.vercel.app?ref=${code}`;

  return (
    <div>
      <p>Kode Referral Anda: {code}</p>
      <p>Link Bagikan: {referralLink}</p>
      <p>Jumlah Undangan: {progress}</p>
    </div>
  );
}