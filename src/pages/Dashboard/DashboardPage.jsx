/**
 * SGHASH — Executive Dashboard
 * 
 * Owner / Super Admin Executive Control Center
 */

import { useState, useEffect } from 'react';
import { useBranch } from '../../hooks/useBranch';
import BranchFilterDropdown from '../../components/ui/BranchFilterDropdown';
import SegmentedToggle from '../../components/ui/SegmentedToggle';
import DateRangePicker from '../../components/ui/DateRangePicker';
import SalesAnalytics from './components/SalesAnalytics';
import TenderSplitWidget from './components/TenderSplitWidget';
import MultiBranchPerformanceChart from './components/MultiBranchPerformanceChart';
import ConsolidatedInventoryGrid from './components/ConsolidatedInventoryGrid';
import TransferAuditQueue from './components/TransferAuditQueue';
import GSTExportControl from './components/GSTExportControl';
import StaffDirectoryPanel from './components/StaffDirectoryPanel';
import { CalendarDays, Calendar, CalendarRange, Clock } from 'lucide-react';
import './DashboardPage.css';

const TIME_PERIOD_OPTIONS = [
  { label: 'Daily', value: 'daily', icon: Clock },
  { label: 'Monthly', value: 'monthly', icon: CalendarDays },
  { label: 'Yearly', value: 'yearly', icon: Calendar },
  { label: 'Custom', value: 'custom', icon: CalendarRange },
];

export default function DashboardPage() {
  const { timePeriod, setTimePeriod, selectedBranch } = useBranch();

  return (
    <div className="dashboard-page anim-fade-in">
      
      {/* ── Global Context Controls ─────────────────────────────── */}
      <div className="dashboard__controls-bar">
        <div className="dashboard__controls-left">
          <SegmentedToggle
            options={TIME_PERIOD_OPTIONS}
            value={timePeriod}
            onChange={setTimePeriod}
          />
          {timePeriod === 'custom' && <DateRangePicker />}
        </div>
        <div className="dashboard__controls-right">
          <BranchFilterDropdown />
        </div>
      </div>

      <div className="dashboard__content">
        
        {/* ── Top Level KPIs & Charts ────────────────────────────── */}
        <section className="dashboard__section">
          <h2 className="text-section-header">Revenue & Operations</h2>
          <div className="dashboard__top-grid">
            <div className="dashboard__kpi-area">
              <SalesAnalytics />
            </div>
            <div className="dashboard__tender-area">
              <TenderSplitWidget />
            </div>
          </div>
        </section>

        {/* ── Multi-Branch Comparison (Only visible if 'all' branches selected) */}
        {selectedBranch === 'all' && (
          <section className="dashboard__section">
            <h2 className="text-section-header">Branch Performance Matrix</h2>
            <MultiBranchPerformanceChart />
          </section>
        )}

        {/* ── Logistics & Stock ────────────────────────────────── */}
        <section className="dashboard__section">
          <h2 className="text-section-header">Global Logistics & Stock</h2>
          <div className="dashboard__logistics-grid">
            <div className="dashboard__inventory-area">
              <ConsolidatedInventoryGrid />
            </div>
            <div className="dashboard__transfers-area">
              <TransferAuditQueue />
            </div>
          </div>
        </section>

        {/* ── Compliance & IAM ─────────────────────────────────── */}
        <section className="dashboard__section">
          <h2 className="text-section-header">Compliance & Security</h2>
          <div className="dashboard__compliance-grid">
            <div className="dashboard__gst-area">
              <GSTExportControl />
            </div>
            <div className="dashboard__staff-area">
              <StaffDirectoryPanel />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
