/**
 * SGHASH — IMEIScannerBar
 */

import { useState, useRef, useEffect } from 'react';
import { getInventorySuggestions } from '../../../services/inventoryService';
import SearchBar from '../../../components/ui/SearchBar';
import Spinner from '../../../components/ui/Spinner';
import { ScanBarcode } from 'lucide-react';

export default function IMEIScannerBar({ onScan, loading }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Auto-focus the scanner input on mount
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      const res = await getInventorySuggestions(input);
      if (res.success) {
        setSuggestions(res.data);
      }
    };
    
    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [input]);

  const handleSubmit = (e, forcedInput = null) => {
    if (e) e.preventDefault();
    const submitVal = forcedInput !== null ? forcedInput : input;
    if (!submitVal.trim()) return;
    
    setShowSuggestions(false);
    onScan(submitVal);
    if (!forcedInput) setInput(''); 
  };

  const handleSuggestionClick = (suggestion) => {
    setInput('');
    handleSubmit(null, suggestion.sku);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 'var(--space-md)' }}>
      <div ref={wrapperRef} style={{ flex: 1, position: 'relative', zIndex: 50 }}>
        <input
          ref={inputRef}
          type="text"
          className="search-bar__input"
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Scan or enter SKU / 15-digit IMEI to add to cart..."
          disabled={loading}
          autoComplete="off"
          style={{ 
            width: '100%', 
            padding: 'var(--space-md) var(--space-xl) var(--space-md) 48px',
            fontSize: 'var(--font-size-lg)',
            background: 'var(--color-input-bg)',
            border: '2px solid var(--color-primary)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--color-input-text)'
          }}
        />
        <ScanBarcode size={24} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
        
        {showSuggestions && suggestions.length > 0 && (
          <ul style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--color-body-bg)', // Opaque to prevent text bleeding
            border: '1px solid var(--color-input-border)',
            borderRadius: 'var(--radius-md)',
            marginTop: '4px',
            padding: 0,
            listStyle: 'none',
            zIndex: 50,
            maxHeight: '300px',
            overflowY: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            {suggestions.map((item) => (
              <li
                key={item.sku}
                onClick={() => handleSuggestionClick(item)}
                style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-bg-hover)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontWeight: 500, color: 'var(--color-text-main)' }}>{item.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted-text)' }}>SKU: {item.sku} • {item.brand}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button 
        type="submit" 
        className="pill-btn pill-btn--primary" 
        disabled={loading || input.trim().length === 0}
        style={{ padding: '0 var(--space-xl)', fontSize: 'var(--font-size-md)' }}
      >
        {loading ? <Spinner size={20} /> : 'Add'}
      </button>
    </form>
  );
}
