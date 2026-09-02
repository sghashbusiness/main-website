/**
 * SGHASH — GlobalSearch
 * Search inventory by IMEI or SKU.
 */

import { useState } from 'react';
import { searchInventory } from '../../../services/inventoryService';
import SearchBar from '../../../components/ui/SearchBar';
import DataTable from '../../../components/ui/DataTable';
import Spinner from '../../../components/ui/Spinner';
import { Search, AlertCircle } from 'lucide-react';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    const res = await searchInventory(query);
    setLoading(false);

    if (res.success) {
      setResults(res.data);
    }
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
        <div style={{ flex: 1, maxWidth: 500 }}>
          <SearchBar
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Scan or enter 15-digit IMEI, or type SKU..."
            shortcutHint=""
          />
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
