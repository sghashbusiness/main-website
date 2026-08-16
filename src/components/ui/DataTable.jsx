/**
 * SGHASH UI — DataTable
 * Reusable table primitive per Architecture Spec (Inventory, Staff, Transfers).
 */

import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import './DataTable.css';

export default function DataTable({
  columns,
  data,
  keyField = 'id',
  onRowClick,
  className = '',
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  return (
    <div className={`data-table-container ${className}`}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`data-table__th ${col.sortable ? 'data-table__th--sortable' : ''} ${col.align === 'right' ? 'data-table__align-right' : ''} ${col.align === 'center' ? 'data-table__align-center' : ''}`}
                onClick={() => col.sortable && handleSort(col.key)}
                style={{ width: col.width }}
              >
                <div className="data-table__th-content">
                  {col.label}
                  {col.sortable && (
                    <span className="data-table__sort-icon">
                      {sortConfig.key === col.key ? (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      ) : (
                        <span className="data-table__sort-placeholder" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((row) => (
              <tr
                key={row[keyField]}
                className={`data-table__tr ${onRowClick ? 'data-table__tr--clickable' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`data-table__td ${col.align === 'right' ? 'data-table__align-right' : ''} ${col.align === 'center' ? 'data-table__align-center' : ''}`}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="data-table__empty">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
