'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Progress {
  linesCompleted: number;
  totalBlocks: number;
  rewardBalance: number;
  claimedEarly: boolean;
  referralCount: number;
  referralCode: string | null;
}

export default function BasefortyDApp() {
  const { address, isConnected } = useAccount();

  const [progress, setProgress] = useState<Progress | null>(null);
  const [currentLine, setCurrentLine] = useState('');
  const [aiMessage, setAiMessage] = useState('');
  const [showAI, setShowAI] = useState(false);
  const [status, setStatus] = useState<'idle' | 'typing' | 'submitting' | 'completed'>('idle');
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(40 * 60);

  // Fetch progress setiap connect atau setelah action
  const fetchProgress = async () => {
    if (!address) return;
    try {
      const res = await fetch(`${API_URL}/api/progress?walletAddress=${address}`);
      const data = await res.json();
      if (data.success) {
        setProgress(data.progress);
        // Reset timer jika baru mulai block
        if (data.progress.linesCompleted === 0) {
          setTimeRemaining(40 * 60);
        }
      }
    } catch (err) {
      setError('Gagal konek ke backend. Cek apakah server jalan.');
      console.error(err);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchProgress();
    }
  }, [isConnected, address]);

  // Timer countdown
  useEffect(() => {
    if (status === 'typing' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, timeRemaining]);

  // Auto-refresh progress setiap 10 detik (opsional)
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(fetchProgress, 10000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const claimEarlyBonus = async () => {
    if (!address) return;
    try {
      setStatus('submitting');
      const res = await fetch(`${API_URL}/api/claim/early`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      });
      const data = await res.json();
      if (data.success) {
        setError('');
        fetchProgress();
        alert(`Sukses! 100 $B40B dikirim ke wallet kamu. Tx: ${data.txHash}`);
      } else {
        setError(data.error || 'Gagal claim bonus');
      }
    } catch (err) {
      setError('Gagal claim. Coba lagi nanti.');
    } finally {
      setStatus('idle');
    }
  };

  const submitManualLine = async () => {
    if (!address || currentLine.length !== 40) return;
    const unique = new Set(currentLine).size === 40;
    if (!unique) {
      setError('Karakter harus 40 unik semua');
      return;
    }

    try {
      setStatus('submitting');
      setError('');
      const res = await fetch(`${API_URL}/api/line/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address, line: currentLine }),
      });
      const data = await res.json();

      if (data.success) {
        setCurrentLine('');
        fetchProgress();
        if (data.blockComplete) {
          setStatus('completed');
          setTimeout(() => setStatus('typing'), 5000);
        }
      } else {
        setError(data.error || data.message || 'Gagal submit');
      }
    } catch (err) {
      setError('Gagal submit. Backend mungkin down.');
    } finally {
      setStatus('typing');
    }
  };

  const generateAILine = async () => {
    if (!address || !aiMessage.trim()) return;

    try {
      setStatus('submitting');
      setError('');
      const res = await fetch(`${API_URL}/api/line/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address, happinessMessage: aiMessage }),
      });
      const data = await res.json();

      if (data.success) {
        alert(`AI berhasil generate: ${data.generated}`);
        setAiMessage('');
        fetchProgress();
        if (data.blockComplete) {
          setStatus('completed');
          setTimeout(() => setStatus('typing'), 5000);
        }
      } else {
        setError(data.error || 'Gagal generate AI');
      }
    } catch (err) {
      setError('Gagal generate. Coba pesan lain.');
    } finally {
      setStatus('typing');
    }
  };

  const copyReferralLink = () => {
    if (progress?.referralCode) {
      const link = `https://baseforty.vercel.app?ref=${progress.referralCode}`;
      navigator.clipboard.writeText(link);
      alert('Link referral disalin!');
    }
  };

  if (!isConnected) {
    // Bagian landing page kamu (sudah bagus, aku biarin hampir sama)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center p-4">
        <div className="text-center max-w-3xl">
          <div className="text-7xl mb-6">🎯</div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Baseforty</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-6">
            Express your happiness. Type 40 characters, earn $B40B.
          </p>

          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 mb-8 shadow-2xl border-2 border-yellow-400">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-4xl">🎁</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Early User Bonus!</h2>
              <span className="text-4xl">🎁</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-white mb-2">
              First 1,600 Users Get <span className="text-yellow-200 text-3xl">100 $B40B</span>
            </p>
          </div>

          <div className="mb-8">
            <ConnectButton />
          </div>

          {/* Feature cards tetap */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-gray-800 backdrop-blur-lg rounded-xl p-6 border border-gray-600 shadow-xl hover:bg-gray-700 transition-all">
              <div className="text-3xl mb-3">⌨️</div>
              <h3 className="text-white font-semibold mb-2 text-lg">Type</h3>
              <p className="text-gray-300 text-sm">40 unique characters per line</p>
            </div>
            <div className="bg-gray-800 backdrop-blur-lg rounded-xl p-6 border border-gray-600 shadow-xl hover:bg-gray-700 transition-all">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-white font-semibold mb-2 text-lg">Earn</h3>
              <p className="text-gray-300 text-sm">1 $B40B per line, 40 per block</p>
            </div>
            <div className="bg-gray-800 backdrop-blur-lg rounded-xl p-6 border border-gray-600 shadow-xl hover:bg-gray-700 transition-all">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-white font-semibold mb-2 text-lg">Gasless</h3>
              <p className="text-gray-300 text-sm">Gasless rewards on Base</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Halaman utama setelah connect
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Baseforty</h1>
            <p className="text-gray-300">Block #{progress?.totalBlocks + 1 || 1}</p>
          </div>
          <ConnectButton />
        </div>

        {!progress?.claimedEarly && (
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 mb-6 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-3">Early User Bonus Masih Tersedia!</h2>
            <p className="text-xl text-white mb-4">
              Claim <span className="font-bold text-yellow-200">100 $B40B</span> sekarang (hanya untuk 1600 user pertama)
            </p>
            <button
              onClick={claimEarlyBonus}
              disabled={status === 'submitting'}
              className="bg-white text-purple-900 font-bold px-8 py-4 rounded-xl text-xl hover:bg-gray-100 transition-all shadow-lg"
            >
              {status === 'submitting' ? 'Claiming...' : 'Claim 100 $B40B Now!'}
            </button>
          </div>
        )}

        {/* Referral Section */}
        {progress && (
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white border-opacity-20">
            <h3 className="text-xl font-bold text-white mb-3">Referral Program</h3>
            <p className="text-gray-300 mb-2">
              Undang teman, dapat bonus besar: 40 → 400 → 4000 → 40000 $B40B
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-400">Kode Referral Kamu:</p>
                <p className="text-2xl font-bold text-yellow-400 break-all">{progress.referralCode || 'Loading...'}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400">Jumlah Undangan:</p>
                <p className="text-2xl font-bold text-green-400">{progress.referralCount}</p>
              </div>
            </div>
            <button
              onClick={copyReferralLink}
              className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
            >
              Copy Link Referral
            </button>
          </div>
        )}

        {/* Progress Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white border-opacity-20">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-300 text-sm mb-1">Progres Kamu</p>
              <p className="text-4xl font-bold text-white">
                {progress?.linesCompleted || 0} / 40
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-300 text-sm mb-1">Waktu Tersisa</p>
              <p className="text-3xl font-bold text-yellow-400">
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((progress?.linesCompleted || 0) / 40) * 100}%` }}
            />
          </div>

          <p className="text-center text-xl text-white font-semibold">
            Total Earned: {progress?.rewardBalance || 0} $B40B
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
          <div className="flex justify-between mb-4">
            <button
              onClick={() => setShowAI(false)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                !showAI ? 'bg-blue-500 text-white' : 'bg-transparent text-white border border-white'
              }`}
            >
              Manual Type
            </button>
            <button
              onClick={() => setShowAI(true)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                showAI ? 'bg-green-500 text-white' : 'bg-transparent text-white border border-white'
              }`}
            >
              AI Helper
            </button>
          </div>

          {!showAI ? (
            <div>
              <input
                type="text"
                value={currentLine}
                onChange={(e) => setCurrentLine(e.target.value)}
                maxLength={40}
                placeholder="Ketik 40 karakter unik..."
                className="w-full bg-gray-900 text-white p-4 rounded-lg border-2 border-blue-500 focus:border-blue-400"
              />
              <div className="mt-2 text-sm text-gray-400 flex justify-between">
                <span>Length: {currentLine.length}/40</span>
                <span>Unique: {new Set(currentLine).size}/40</span>
              </div>
              <button
                onClick={submitManualLine}
                disabled={currentLine.length !== 40 || new Set(currentLine).size !== 40 || status === 'submitting'}
                className="mt-4 w-full bg-blue-600 py-4 rounded-lg text-white font-bold disabled:opacity-50"
              >
                Submit Line (+1 $B40B)
              </button>
            </div>
          ) : (
            <div>
              <textarea
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                placeholder="Ceritakan apa yang bikin kamu bahagia hari ini..."
                className="w-full bg-gray-900 text-white p-4 rounded-lg border-2 border-green-500 focus:border-green-400"
                rows={4}
              />
              <button
                onClick={generateAILine}
                disabled={!aiMessage.trim() || status === 'submitting'}
                className="mt-4 w-full bg-green-600 py-4 rounded-lg text-white font-bold disabled:opacity-50"
              >
                Generate & Submit (+1 $B40B)
              </button>
            </div>
          )}

          {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}
