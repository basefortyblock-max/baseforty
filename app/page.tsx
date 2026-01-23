// app/page.tsx - Updated with Early User Bonus & Fixed Colors
'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Providers } from './providers';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Session {
  linesCompleted: number;
  blockNumber: number;
  proofType: 'humanity' | 'happiness';
  timeRemaining?: number;
}

export default function BasefortyDApp() {
  const { address, isConnected } = useAccount();
  
  const [session, setSession] = useState<Session | null>(null);
  const [currentLine, setCurrentLine] = useState('');
  const [lines, setLines] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'typing' | 'submitting' | 'completed'>('idle');
  const [error, setError] = useState('');
  const [showAI, setShowAI] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(40 * 60);

  useEffect(() => {
    if (isConnected && address) {
      initSession();
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (status === 'typing' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, timeRemaining]);

  const initSession = async () => {
    try {
      const response = await fetch(`${API_URL}/api/session/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      });

      const data = await response.json();
      if (data.success) {
        setSession(data.session);
        setStatus('typing');
        if (data.session.timeRemaining) {
          setTimeRemaining(Math.floor(data.session.timeRemaining / 1000));
        }
      }
    } catch (err) {
      setError('Failed to connect to backend. Please ensure backend is running.');
      console.error(err);
    }
  };

  const validateLine = (line: string) => {
    if (line.length !== 40) {
      return 'Must be exactly 40 characters';
    }

    const uniqueChars = new Set(line.split(''));
    if (uniqueChars.size !== 40) {
      return 'All 40 characters must be unique';
    }

    const textOnlyRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]+$/;
    if (!textOnlyRegex.test(line)) {
      return 'Only text characters allowed';
    }

    return null;
  };

  const submitLine = async () => {
    if (!address || !session) return;

    const validationError = validateLine(currentLine);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setStatus('submitting');
      setError('');

      const response = await fetch(`${API_URL}/api/line/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          line: currentLine,
          isAIGenerated: false
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      setLines([...lines, data.line]);
      setCurrentLine('');
      setSession({
        ...session,
        linesCompleted: data.linesCompleted,
        proofType: data.proofType
      });
      setTimeRemaining(40 * 60);

      if (data.blockComplete) {
        setStatus('completed');
        setTimeout(() => {
          setLines([]);
          setSession({
            ...session,
            linesCompleted: 0,
            blockNumber: session.blockNumber + 1
          });
          setStatus('typing');
        }, 5000);
      } else {
        setStatus('typing');
      }

    } catch (err: any) {
      setError(err.message || 'Submission failed. Check if backend is running.');
      setStatus('typing');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const charCount = currentLine.length;
  const uniqueCount = new Set(currentLine).size;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center p-4">
        <div className="text-center max-w-3xl">
          {/* Logo */}
          <div className="text-7xl mb-6">🎯</div>
          
          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Baseforty
          </h1>
          
          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-6">
            Express your happiness. Type 40 characters, earn $B40B.
          </p>
          
          {/* Early User Bonus Banner - NEW */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 mb-8 shadow-2xl border-2 border-yellow-400">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-4xl">🎁</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Early User Bonus!
              </h2>
              <span className="text-4xl">🎁</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-white mb-2">
              First 1,600 Users Get <span className="text-yellow-200 text-3xl">100 $B40B</span>
            </p>
            <p className="text-sm text-white opacity-90">
              Join now and receive bonus rewards on top of regular earnings!
            </p>
          </div>

          {/* Connect Button */}
          <div className="mb-8">
            <ConnectButton />
          </div>
          
          {/* Feature Cards - FIXED COLORS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* Card 1 - Type */}
            <div className="bg-gray-800 backdrop-blur-lg rounded-xl p-6 border border-gray-600 shadow-xl hover:bg-gray-700 transition-all">
              <div className="text-3xl mb-3">⌨️</div>
              <h3 className="text-white font-semibold mb-2 text-lg">Type</h3>
              <p className="text-gray-300 text-sm">
                40 unique characters per line
              </p>
            </div>
            
            {/* Card 2 - Earn */}
            <div className="bg-gray-800 backdrop-blur-lg rounded-xl p-6 border border-gray-600 shadow-xl hover:bg-gray-700 transition-all">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-white font-semibold mb-2 text-lg">Earn</h3>
              <p className="text-gray-300 text-sm">
                1 $B40B per line, 40 per block
              </p>
            </div>
            
            {/* Card 3 - No Fees */}
            <div className="bg-gray-800 backdrop-blur-lg rounded-xl p-6 border border-gray-600 shadow-xl hover:bg-gray-700 transition-all">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-white font-semibold mb-2 text-lg">Gasless</h3>
              <p className="text-gray-300 text-sm">
                Gasless rewards on Base
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-gray-400 text-sm">
            <p>Built on Base • Proof of Humanity • Proof of Happiness</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Baseforty</h1>
            <p className="text-gray-300">Block #{session?.blockNumber || 1}</p>
          </div>
          <ConnectButton />
        </div>

        {/* Progress Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white border-opacity-20">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-300 text-sm mb-1">Your Progress</p>
              <p className="text-4xl font-bold text-white">
                {session?.linesCompleted || 0} / 40
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {session?.proofType === 'humanity' ? '🧑 Proof of Humanity' : '😊 Proof of Happiness'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-300 text-sm mb-1">Time Left</p>
              <p className="text-3xl font-bold text-yellow-400">
                {formatTime(timeRemaining)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((session?.linesCompleted || 0) / 40) * 100}%` }}
            />
          </div>

          <div className="text-center">
            <p className="text-xl text-white font-semibold">
              Earned: {session?.linesCompleted || 0} $B40B
            </p>
            <p className="text-sm text-gray-400">
              {40 - (session?.linesCompleted || 0)} more lines to complete block
            </p>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white border-opacity-20">
          <div className="flex justify-between mb-4">
            <button
              onClick={() => setShowAI(false)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                !showAI 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-transparent text-white border border-white border-opacity-30 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              ⌨️ Manual Type
            </button>
            <button
              onClick={() => setShowAI(true)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                showAI 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-transparent text-white border border-white border-opacity-30 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              🤖 AI Helper
            </button>
          </div>

          {!showAI ? (
            // Manual Input
            <div>
              <label className="block text-white text-sm mb-2 font-semibold">
                Type 40 unique characters (Recommended for Proof of Humanity)
              </label>
              <input
                type="text"
                value={currentLine}
                onChange={(e) => setCurrentLine(e.target.value)}
                maxLength={40}
                placeholder="Example: 0123456789qwertyuiopasdfghjklzxcvb!@#$"
                className="w-full bg-gray-900 text-white text-lg border-2 border-blue-500 rounded-lg px-4 py-4 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition-all font-mono placeholder-gray-500"
                disabled={status !== 'typing'}
              />
              <div className="flex justify-between mt-3 text-sm">
                <span className={charCount === 40 ? 'text-green-400 font-bold' : 'text-gray-400'}>
                  Length: {charCount} / 40
                </span>
                <span className={uniqueCount === 40 ? 'text-green-400 font-bold' : 'text-gray-400'}>
                  Unique: {uniqueCount} / 40
                </span>
              </div>
              <button
                onClick={submitLine}
                disabled={status !== 'typing' || charCount !== 40 || uniqueCount !== 40}
                className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg shadow-lg"
              >
                {status === 'submitting' ? '⏳ Submitting...' : '✨ Submit Line (+1 $B40B)'}
              </button>
            </div>
          ) : (
            // AI Helper
            <div>
              <label className="block text-white text-sm mb-2 font-semibold">
                Share your happy message (Proof of Happiness)
              </label>
              <textarea
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                placeholder="Example: Today I'm so happy because I got promoted! 🎉"
                rows={3}
                className="w-full bg-gray-900 text-white text-lg border-2 border-green-500 rounded-lg px-4 py-3 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400 transition-all placeholder-gray-500"
                disabled={status !== 'typing'}
              />
              <p className="text-xs text-gray-400 mt-2">
                ⚠️ Express genuine happiness. Commands like "generate 40 characters" will reset your block!
              </p>
              <button
                onClick={() => {/* TODO: Implement AI generation */}}
                disabled={status !== 'typing' || !aiMessage.trim()}
                className="w-full mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-4 rounded-lg hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg shadow-lg"
              >
                {status === 'submitting' ? 'Generating...' : '✨ Generate & Submit'}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-500 bg-opacity-20 border-2 border-red-500 text-red-200 px-4 py-3 rounded-lg">
              <p className="font-semibold">⚠️ {error}</p>
            </div>
          )}
        </div>

        {/* Completed Lines */}
        {lines.length > 0 && (
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
            <h3 className="text-xl font-bold text-white mb-4">
              ✅ Completed Lines ({lines.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {lines.map((line, index) => (
                <div key={index} className="bg-gray-900 border border-gray-700 p-3 rounded-lg">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Line {index + 1}</span>
                    <span className="text-green-400 font-bold">+1 $B40B</span>
                  </div>
                  <p className="text-white font-mono text-sm break-all">{line}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Block Complete Modal */}
        {status === 'completed' && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl p-8 text-center max-w-md animate-bounce">
              <div className="text-7xl mb-4">🎉</div>
              <h2 className="text-4xl font-bold text-white mb-3">Block Complete!</h2>
              <p className="text-2xl text-white mb-2">
                You earned <span className="font-bold">40 $B40B</span>
              </p>
              <p className="text-white opacity-90 mb-4">
                Reward sent to your wallet (no gas fee)
              </p>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <p className="text-sm text-white font-semibold">
                  🏅 Proof of Humanity Certified
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}