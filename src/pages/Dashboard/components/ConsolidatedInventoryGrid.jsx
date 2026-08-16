/**
 * SGHASH — ConsolidatedInventoryGrid
 * Global logistics master data table.
 */

import { useState, useEffect } from 'react';
import { getInventory } from '../../../services/inventoryService';
import DataTable from '../../../components/ui/DataTable';
import Spinner from '../../../components/ui/Spinner';

export default function ConsolidatedInventoryGrid() {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <DataTable
        columns={columns}
        data={inventoryData}
        keyField="sku"
        className="flex-1"
      />
    </div>
  );
}
