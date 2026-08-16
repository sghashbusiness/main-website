/**
 * SGHASH Service Layer — Analytics
 * 
 * Serves dashboard metrics, chart data, and GST export.
 * All functions are async for backend-ready architecture.
 */

import {
  getBranchMetrics,
  getMultiBranchComparison,
  getConsolidatedMetrics,
  recentTransactions,
} from '../mock-data/sales';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get sales metrics for a branch and time period.
 * Architecture Spec §3.2: "Total Revenue, Bill Volume, AOV, Total Discounts."
 */
export async function getMetrics(branch = 'all', period = 'monthly') {
  await delay(400 + Math.random() * 300);

  const metrics = getBranchMetrics(branch, period);
  if (!metrics) {
    return { success: false, data: null, error: 'No data available for the selected period.' };
  }

  return { success: true, data: metrics, error: null };
}

/**
 * Get multi-branch comparison for charts.
 * Architecture Spec §3.2: "<MultiBranchPerformanceChart>: A comparative
 * bar/line chart plotting the revenue of physical branches and the webstore."
 */
export async function getBranchComparison(period = 'monthly') {
  await delay(300 + Math.random() * 200);

  const comparison = getMultiBranchComparison(period);
  return { success: true, data: comparison, error: null };
}

/**
 * Get consolidated metrics.
 */
export async function getConsolidated(period = 'monthly') {
  await delay(300 + Math.random() * 200);

  const data = getConsolidatedMetrics(period);
  return { success: true, data, error: null };
}

/**
 * Get recent transactions for activity feed.
 */
export async function getRecentTransactions(branch = 'all', limit = 10) {
  await delay(200 + Math.random() * 200);

  let filtered = recentTransactions;
  if (branch !== 'all') {
    filtered = filtered.filter((t) => t.branch === branch);
  }

  return {
    success: true,
    data: filtered.slice(0, limit),
    error: null,
  };
}

/**
 * Export GSTR1 data.
 * Architecture Spec §3.4: "<GSTExportControl>: Select a tax period, toggle
 * between 'Consolidated' or 'Specific Branch,' and click <DownloadGSTR1>."
 * 
 * In the prototype this generates a mock CSV blob.
 */
export async function exportGSTR1(period, branch = 'all') {
  await delay(1500 + Math.random() * 500);

  // Simulate CSV generation
  const csvHeader = 'Invoice No,Invoice Date,Customer GSTIN,Customer Name,HSN Code,Taxable Value,CGST Rate,CGST Amount,SGST Rate,SGST Amount,Total\n';
  const csvRows = [
    'INV-2608-001,15-08-2026,32AABCT5678K1ZP,Techno Solutions Pvt Ltd,8517,114406.78,9,10296.61,9,10296.61,134999.00',
    'INV-2608-002,15-08-2026,,Meera S,8517,36990.68,9,3329.16,9,3329.16,43649.00',
    'INV-2608-003,15-08-2026,,Walk-in Customer,8517,1397.46,9,125.77,9,125.77,1649.00',
    'INV-2608-004,15-08-2026,32AABCR7890H1ZM,RK Enterprises,8517,59321.19,9,5338.91,9,5338.91,69999.00',
    'INV-2608-005,15-08-2026,,Arjun M,8517,33897.46,9,3050.77,9,3050.77,39999.00',
  ];

  const csvContent = csvHeader + csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  return {
    success: true,
    data: { blob, filename: `GSTR1_${branch}_${period}_${Date.now()}.csv` },
    error: null,
  };
}
