/**
 * SGHASH — GlobalSearch
 * Search inventory by IMEI or SKU.
 */

import { useState, useEffect, useRef } from 'react';
import { searchInventory, getInventorySuggestions } from '../../../services/inventoryService';
import SearchBar from '../../../components/ui/SearchBar';
import DataTable from '../../../components/ui/DataTable';
import Spinner from '../../../components/ui/Spinner';
import { Search, AlertCircle } from 'lucide-react';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

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
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      const res = await getInventorySuggestions(query);
      if (res.success) {
        setSuggestions(res.data);
      }
    };
    
    // Simple debounce
    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async (e, forcedQuery = null) => {
    if (e) e.preventDefault();
    const searchQuery = forcedQuery !== null ? forcedQuery : query;
    if (!searchQuery.trim()) return;

    setShowSuggestions(false);
    setLoading(true);
    setHasSearched(true);
    const res = await searchInventory(searchQuery);
    setLoading(false);

    if (res.success) {
      setResults(res.data);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.sku);
    handleSearch(null, suggestion.sku);
  };

  const columns = [
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Product Name' },
    { key: 'brand', label: 'Brand' },
    { key: 'color', label: 'Color' },
    { 
      key: 'totalStock', 
      label: 'Global Stock', 
      align: 'center',
      render: (val) => <span style={{ fontWeight: 600 }}>{val}</span>
    },
    { 
      key: 'matchedIMEI', 
      label: 'Matched IMEI Details',
      render: (val) => {
        if (!val) return <span className="text-xs text-on-canvas-muted">—</span>;
        return (
          <div className="text-xs">
            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{val.imei}</span>
            <span className="text-on-canvas-muted ml-2">({val.status})</span>
          </div>
        );
      }
    }
  ];

  return (
    <div className="inventory-panel">
      <div className="inventory-panel__title">
        <Search size={20} className="text-primary" />
        Global IMEI / SKU Lookup
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--space-md)' }}>
        <div ref={wrapperRef} style={{ flex: 1, maxWidth: 500, position: 'relative', zIndex: 50 }}>
          <SearchBar
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Scan or enter 15-digit IMEI, or type SKU..."
            shortcutHint=""
          />
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
        <button type="submit" className="pill-btn pill-btn--primary pill-btn--md" disabled={loading || !query.trim()}>
          {loading ? <Spinner size={16} /> : 'Search'}
        </button>
      </form>

      <div style={{ marginTop: 'var(--space-lg)' }}>
        {loading && (
          <div className="flex-center" style={{ height: 200 }}><Spinner size={24} /></div>
        )}
        
        {!loading && hasSearched && results.length === 0 && (
          <div className="flex-center flex-column" style={{ height: 200, color: 'var(--color-text-tertiary)' }}>
            <AlertCircle size={32} style={{ marginBottom: 'var(--space-sm)', opacity: 0.5 }} />
            <p>No results found for "{query}"</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <DataTable columns={columns} data={results} keyField="sku" />
        )}
      </div>
    </div>
  );
}
