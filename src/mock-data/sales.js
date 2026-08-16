/**
 * SGHASH Mock Data — Sales & Revenue Analytics
 * 
 * Revenue, bill counts, AOV, discounts per branch and time period.
 * Architecture Spec §3.2: "Total Revenue, Bill Volume, Average Order Value (AOV),
 * and Total Discounts."
 */

/**
 * Sales metrics per branch per time period.
 * Time periods: daily, monthly, yearly.
 */
export const salesMetrics = {
  daily: {
    kochi: {
      totalRevenue: 485200,
      billVolume: 32,
      avgOrderValue: 15163,
      totalDiscounts: 24800,
      revenueGrowth: 8.5,
      tenderSplit: { cash: 145600, upi: 218340, card: 121260 },
    },
    trivandrum: {
      totalRevenue: 372600,
      billVolume: 26,
      avgOrderValue: 14331,
      totalDiscounts: 18200,
      revenueGrowth: 5.2,
      tenderSplit: { cash: 111780, upi: 186300, card: 74520 },
    },
    thrissur: {
      totalRevenue: 298400,
      billVolume: 21,
      avgOrderValue: 14210,
      totalDiscounts: 14500,
      revenueGrowth: -2.1,
      tenderSplit: { cash: 119360, upi: 134280, card: 44760 },
    },
    webstore: {
      totalRevenue: 196800,
      billVolume: 14,
      avgOrderValue: 14057,
      totalDiscounts: 12400,
      revenueGrowth: 22.8,
      tenderSplit: { cash: 0, upi: 137760, card: 59040 },
    },
  },
  monthly: {
    kochi: {
      totalRevenue: 12450000,
      billVolume: 847,
      avgOrderValue: 14698,
      totalDiscounts: 624000,
      revenueGrowth: 12.5,
      tenderSplit: { cash: 3735000, upi: 5602500, card: 3112500 },
    },
    trivandrum: {
      totalRevenue: 9870000,
      billVolume: 692,
      avgOrderValue: 14262,
      totalDiscounts: 498000,
      revenueGrowth: 8.3,
      tenderSplit: { cash: 2961000, upi: 4935000, card: 1974000 },
    },
    thrissur: {
      totalRevenue: 7640000,
      billVolume: 534,
      avgOrderValue: 14307,
      totalDiscounts: 382000,
      revenueGrowth: 3.7,
      tenderSplit: { cash: 3056000, upi: 3438000, card: 1146000 },
    },
    webstore: {
      totalRevenue: 5280000,
      billVolume: 376,
      avgOrderValue: 14043,
      totalDiscounts: 316800,
      revenueGrowth: 34.2,
      tenderSplit: { cash: 0, upi: 3696000, card: 1584000 },
    },
  },
  yearly: {
    kochi: {
      totalRevenue: 148500000,
      billVolume: 10124,
      avgOrderValue: 14670,
      totalDiscounts: 7425000,
      revenueGrowth: 18.4,
      tenderSplit: { cash: 44550000, upi: 66825000, card: 37125000 },
    },
    trivandrum: {
      totalRevenue: 118200000,
      billVolume: 8284,
      avgOrderValue: 14271,
      totalDiscounts: 5910000,
      revenueGrowth: 14.1,
      tenderSplit: { cash: 35460000, upi: 59100000, card: 23640000 },
    },
    thrissur: {
      totalRevenue: 91500000,
      billVolume: 6405,
      avgOrderValue: 14285,
      totalDiscounts: 4575000,
      revenueGrowth: 9.8,
      tenderSplit: { cash: 36600000, upi: 41175000, card: 13725000 },
    },
    webstore: {
      totalRevenue: 63200000,
      billVolume: 4507,
      avgOrderValue: 14023,
      totalDiscounts: 3792000,
      revenueGrowth: 52.3,
      tenderSplit: { cash: 0, upi: 44240000, card: 18960000 },
    },
  },
};

/**
 * Get consolidated metrics across all branches for a given period.
 */
export function getConsolidatedMetrics(period = 'monthly') {
  const periodData = salesMetrics[period];
  if (!periodData) return null;

  const branches = Object.values(periodData);
  const consolidated = {
    totalRevenue: branches.reduce((s, b) => s + b.totalRevenue, 0),
    billVolume: branches.reduce((s, b) => s + b.billVolume, 0),
    totalDiscounts: branches.reduce((s, b) => s + b.totalDiscounts, 0),
    tenderSplit: {
      cash: branches.reduce((s, b) => s + b.tenderSplit.cash, 0),
      upi: branches.reduce((s, b) => s + b.tenderSplit.upi, 0),
      card: branches.reduce((s, b) => s + b.tenderSplit.card, 0),
    },
  };
  consolidated.avgOrderValue = Math.round(
    consolidated.totalRevenue / consolidated.billVolume
  );
  consolidated.revenueGrowth = +(
    branches.reduce((s, b) => s + b.revenueGrowth, 0) / branches.length
  ).toFixed(1);

  return consolidated;
}

/**
 * Get metrics for a specific branch and period.
 */
export function getBranchMetrics(branch, period = 'monthly') {
  if (branch === 'all') return getConsolidatedMetrics(period);
  return salesMetrics[period]?.[branch] || null;
}

/**
 * Get multi-branch comparison data for charts.
 * Returns an array of { branch, revenue, bills } for each physical branch + webstore.
 */
export function getMultiBranchComparison(period = 'monthly') {
  const periodData = salesMetrics[period];
  if (!periodData) return [];

  return Object.entries(periodData).map(([branchKey, data]) => ({
    branch: branchKey,
    revenue: data.totalRevenue,
    bills: data.billVolume,
    aov: data.avgOrderValue,
  }));
}

/**
 * Recent transactions for the activity feed.
 */
export const recentTransactions = [
  {
    id: 'TXN-2608-001',
    date: '2026-08-15T18:45:00+05:30',
    branch: 'kochi',
    items: ['Samsung Galaxy S24 Ultra'],
    amount: 134999,
    paymentMethod: 'card',
    customerName: 'Deepak R',
  },
  {
    id: 'TXN-2608-002',
    date: '2026-08-15T17:30:00+05:30',
    branch: 'trivandrum',
    items: ['Vivo V30 Pro', 'Screen Protector'],
    amount: 43648,
    paymentMethod: 'upi',
    customerName: 'Meera S',
  },
  {
    id: 'TXN-2608-003',
    date: '2026-08-15T16:15:00+05:30',
    branch: 'kochi',
    items: ['Nokia 105 Dual SIM'],
    amount: 1649,
    paymentMethod: 'cash',
    customerName: 'Walk-in',
  },
  {
    id: 'TXN-2608-004',
    date: '2026-08-15T15:00:00+05:30',
    branch: 'thrissur',
    items: ['OnePlus 12'],
    amount: 69999,
    paymentMethod: 'upi',
    customerName: 'Vishnu K',
  },
  {
    id: 'TXN-2608-005',
    date: '2026-08-15T14:20:00+05:30',
    branch: 'webstore',
    items: ['Samsung Galaxy A55 5G'],
    amount: 39999,
    paymentMethod: 'card',
    customerName: 'Arjun M',
  },
];
