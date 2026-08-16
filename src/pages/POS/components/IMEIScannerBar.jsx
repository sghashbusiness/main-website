/**
 * SGHASH — IMEIScannerBar
 */

import { useState, useRef, useEffect } from 'react';
import SearchBar from '../../../components/ui/SearchBar';
import Spinner from '../../../components/ui/Spinner';
import { ScanBarcode } from 'lucide-react';

export default function IMEIScannerBar({ onScan, loading }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus the scanner input on mount
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanImei = input.replace(/\D/g, '').slice(0, 15);
    
    if (cleanImei.length === 15) {
      onScan(cleanImei);
      setInput(''); // clear input after scan
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 'var(--space-md)' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          className="search-bar__input"
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/\D/g, '').slice(0, 15))}
          placeholder="Scan or enter 15-digit IMEI to add to cart..."
          disabled={loading}
          autoComplete="off"
          style={{ 
            width: '100%', 
            padding: 'var(--space-md) var(--space-xl) var(--space-md) 48px',
            fontSize: 'var(--font-size-lg)',
            background: 'var(--color-canvas)',
            border: '2px solid var(--color-primary)',
            borderRadius: 'var(--radius-lg)'
          }}
        />
        <ScanBarcode size={24} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
      </div>
      <button 
        type="submit" 
        className="pill-btn pill-btn--primary" 
        disabled={loading || input.length !== 15}
        style={{ padding: '0 var(--space-xl)', fontSize: 'var(--font-size-md)' }}
      >
        {loading ? <Spinner size={20} /> : 'Add'}
      </button>
    </form>
  );
}
