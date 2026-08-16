/**
 * SGHASH UI — DateRangePicker
 * Constraint: "Build a lightweight custom date-range picker...
 * Do not use the browser's native date input as the primary UI."
 * 
 * Implements a simple custom dropdown calendar simulating a date range selector
 * to fulfill the UI constraint while staying lightweight.
 */

import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useBranch } from '../../hooks/useBranch';
import './DateRangePicker.css';

// Utility for rendering month days
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function DateRangePicker({ className = '' }) {
  const { customDateRange, setCustomDateRange } = useBranch();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Local state for selection process
  const [selecting, setSelecting] = useState(false);
  const [tempStart, setTempStart] = useState(customDateRange.startDate);
  const [tempEnd, setTempEnd] = useState(customDateRange.endDate);

  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Sync temp state when opening
  useEffect(() => {
    if (isOpen) {
      setTempStart(customDateRange.startDate);
      setTempEnd(customDateRange.endDate);
      setSelecting(false);
      
      if (customDateRange.startDate) {
        const d = new Date(customDateRange.startDate);
        setCurrentMonth(d.getMonth());
        setCurrentYear(d.getFullYear());
      }
    }
  }, [isOpen, customDateRange]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const handleDateClick = (day) => {
    const selectedDate = new Date(currentYear, currentMonth, day).toISOString();

    if (!selecting) {
      setTempStart(selectedDate);
      setTempEnd(null);
      setSelecting(true);
    } else {
      if (new Date(selectedDate) < new Date(tempStart)) {
        setTempEnd(tempStart);
        setTempStart(selectedDate);
      } else {
        setTempEnd(selectedDate);
      }
      setSelecting(false);
    }
  };

  const handleApply = () => {
    if (tempStart && tempEnd) {
      setCustomDateRange(tempStart, tempEnd);
      setIsOpen(false);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setCustomDateRange(null, null);
    setTempStart(null);
    setTempEnd(null);
    setSelecting(false);
  };

  const formatDisplay = () => {
    if (customDateRange.startDate && customDateRange.endDate) {
      const s = new Date(customDateRange.startDate);
      const e = new Date(customDateRange.endDate);
      return `${s.getDate()} ${MONTHS[s.getMonth()]} - ${e.getDate()} ${MONTHS[e.getMonth()]}, ${e.getFullYear()}`;
    }
    return 'Select Date Range';
  };

  // Calendar rendering logic
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="date-picker__day date-picker__day--empty" />);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const cellDateISO = new Date(currentYear, currentMonth, i).toISOString();
    const isStart = tempStart && cellDateISO.split('T')[0] === tempStart.split('T')[0];
    const isEnd = tempEnd && cellDateISO.split('T')[0] === tempEnd.split('T')[0];
    
    let inRange = false;
    if (tempStart && tempEnd) {
      const cellD = new Date(cellDateISO);
      const startD = new Date(tempStart);
      const endD = new Date(tempEnd);
      inRange = cellD > startD && cellD < endD;
    }

    let classNames = 'date-picker__day';
    if (isStart) classNames += ' date-picker__day--start';
    if (isEnd) classNames += ' date-picker__day--end';
    if (inRange) classNames += ' date-picker__day--in-range';
    if (isStart && isEnd) classNames += ' date-picker__day--single';

    calendarDays.push(
      <button
        key={i}
        className={classNames}
        onClick={() => handleDateClick(i)}
      >
        {i}
      </button>
    );
  }

  return (
    <div className={`date-picker-wrapper ${className}`} ref={containerRef}>
      <button
        className={`date-picker__trigger ${isOpen ? 'date-picker__trigger--active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar size={16} className="date-picker__icon" />
        <span className="date-picker__display">{formatDisplay()}</span>
        {customDateRange.startDate && (
          <div
            className="date-picker__clear"
            onClick={handleClear}
            role="button"
            aria-label="Clear date range"
          >
            <X size={14} />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="date-picker__dropdown anim-fade-in-scale">
          <div className="date-picker__header">
            <button className="date-picker__nav-btn" onClick={handlePrevMonth}>
              <ChevronLeft size={16} />
            </button>
            <span className="date-picker__month-label">
              {MONTHS[currentMonth]} {currentYear}
            </span>
            <button className="date-picker__nav-btn" onClick={handleNextMonth}>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="date-picker__grid">
            {DAYS.map((d) => (
              <div key={d} className="date-picker__day-header">{d}</div>
            ))}
            {calendarDays}
          </div>

          <div className="date-picker__footer">
            <button
              className="pill-btn pill-btn--ghost pill-btn--sm"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              className="pill-btn pill-btn--primary pill-btn--sm"
              onClick={handleApply}
              disabled={!tempStart || !tempEnd}
            >
              Apply Range
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
