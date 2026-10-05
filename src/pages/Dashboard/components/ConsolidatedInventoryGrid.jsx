/**
 * SGHASH — ConsolidatedInventoryGrid
 * Global logistics master data table.
 */

import { useState, useEffect } from 'react';
import { getInventory } from '../../../services/inventoryService';
import DataTable from '../../../components/ui/DataTable';
import Spinner from '../../../components/ui/Spinner';
import CustomDropdown from '../../../components/ui/CustomDropdown';

export default function ConsolidatedInventoryGrid() {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [brandFilter, setBrandFilter] = useState('');
  const [modelFilter, setModelFilter] = useState('');
  const [variantFilter, setVariantFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    const fetchInv = async () => {
      setLoading(true);
      const res = await getInventory('all');
      if (isMounted && res.success) {
        setInventoryData(res.data);
      }
      if (isMounted) setLoading(false);
    };

    fetchInv();
    return () => { isMounted = false; };
  }, []);

  const brands = [...new Set(inventoryData.map(item => item.brand).filter(Boolean))];
  const models = [...new Set(inventoryData.filter(i => !brandFilter || i.brand === brandFilter).map(item => item.name).filter(Boolean))];
  const variants = [...new Set(inventoryData.filter(i => !modelFilter || i.name === modelFilter).map(item => item.storage).filter(Boolean))];
  const colors = [...new Set(inventoryData.filter(i => !modelFilter || i.name === modelFilter).map(item => item.color).filter(Boolean))];

  const filteredData = inventoryData.filter(item => {
    return (
      (!brandFilter || item.brand === brandFilter) &&
      (!modelFilter || item.name === modelFilter) &&
      (!variantFilter || item.storage === variantFilter) &&
      (!colorFilter || item.color === colorFilter)
    );
  });

  const columns = [
    { key: 'sku', label: 'SKU', sortable: true },
    { key: 'name', label: 'Product Name', sortable: true },
    { 
      key: 'totalStock', 
      label: 'Global Stock', 
      sortable: true,
      align: 'center',
      render: (val) => <span style={{ fontWeight: 600 }}>{val}</span>
    },
    { key: 'kochi', label: 'Kochi', align: 'center', render: (_, row) => row.stock.kochi || 0 },
    { key: 'trivandrum', label: 'Tvm', align: 'center', render: (_, row) => row.stock.trivandrum || 0 },
    { key: 'thrissur', label: 'TsR', align: 'center', render: (_, row) => row.stock.thrissur || 0 },
    { key: 'webstore', label: 'Web', align: 'center', render: (_, row) => row.stock.webstore || 0 },
  ];

  if (loading) return <div className="flex-center" style={{ height: 200 }}><Spinner size={24} /></div>;

  const brandOptions = [{ label: 'All Brands', value: '' }, ...brands.map(b => ({ label: b, value: b }))];
  const modelOptions = [{ label: 'All Models', value: '' }, ...models.map(m => ({ label: m, value: m }))];
  const variantOptions = [{ label: 'All Variants', value: '' }, ...variants.map(v => ({ label: v, value: v }))];
  const colorOptions = [{ label: 'All Colors', value: '' }, ...colors.map(c => ({ label: c, value: c }))];

  const handleBrandChange = (val) => {
    setBrandFilter(val);
    setModelFilter('');
    setVariantFilter('');
    setColorFilter('');
  };

  const handleModelChange = (val) => {
    setModelFilter(val);
    setVariantFilter('');
    setColorFilter('');
  };

  const handleVariantChange = (val) => {
    setVariantFilter(val);
    setColorFilter('');
  };

  const resetSearch = () => {
    setBrandFilter('');
    setModelFilter('');
    setVariantFilter('');
    setColorFilter('');
  };

  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
        <h3 style={{ margin: 0, color: 'var(--color-panel-text)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
          Overall Stock
        </h3>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ width: '200px' }}>
          <CustomDropdown 
            value={brandFilter} 
            onChange={handleBrandChange} 
            options={brandOptions} 
            placeholder="All Brands" 
          />
        </div>
        
        {brandFilter && (
          <div style={{ width: '200px' }}>
            <CustomDropdown 
              value={modelFilter} 
              onChange={handleModelChange} 
              options={modelOptions} 
              placeholder="All Models" 
            />
          </div>
        )}

        {modelFilter && (
          <div style={{ width: '200px' }}>
            <CustomDropdown 
              value={variantFilter} 
              onChange={handleVariantChange} 
              options={variantOptions} 
              placeholder="All Variants" 
            />
          </div>
        )}

        {variantFilter && (
          <div style={{ width: '200px' }}>
            <CustomDropdown 
              value={colorFilter} 
              onChange={setColorFilter} 
              options={colorOptions} 
              placeholder="All Colors" 
            />
          </div>
        )}

        {(brandFilter || modelFilter || variantFilter || colorFilter) && (
          <button 
            onClick={resetSearch}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 16px',
              background: 'rgba(255, 60, 60, 0.15)',
              border: '1px solid rgba(255, 60, 60, 0.3)',
              borderRadius: 'var(--radius-pill)',
              color: '#ff6b6b',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s ease',
              height: '38px',
              marginLeft: 'auto'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 60, 60, 0.25)' }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 60, 60, 0.15)' }}
          >
            Reset Filters
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        keyField="sku"
        className="flex-1"
      />
    </div>
  );
}
