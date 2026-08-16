/**
 * SGHASH — Branch Context
 * 
 * Global branch filter and time period state for the Executive Dashboard.
 * 
 * Architecture Spec §3.1: "<BranchFilterDropdown>: The master override switch.
 * Adjusting this re-renders all subsequent child components."
 * 
 * Architecture Spec §3.1: "<TimePeriodSelector>: Segmented pill toggle for
 * Daily, Monthly, Yearly, or Custom Date limits."
 */

import { createContext, useReducer, useCallback } from 'react';

const initialState = {
  selectedBranch: 'all',
  timePeriod: 'monthly',       // 'daily' | 'monthly' | 'yearly' | 'custom'
  customDateRange: {
    startDate: null,
    endDate: null,
  },
};

const branchReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BRANCH':
      return { ...state, selectedBranch: action.payload };

    case 'SET_TIME_PERIOD':
      return {
        ...state,
        timePeriod: action.payload,
        // Reset custom range when switching away from custom
        customDateRange: action.payload !== 'custom'
          ? { startDate: null, endDate: null }
          : state.customDateRange,
      };

    case 'SET_CUSTOM_DATE_RANGE':
      return {
        ...state,
        timePeriod: 'custom',
        customDateRange: action.payload,
      };

    case 'RESET_FILTERS':
      return { ...initialState };

    default:
      return state;
  }
};

export const BranchContext = createContext(null);

export function BranchProvider({ children }) {
  const [state, dispatch] = useReducer(branchReducer, initialState);

  const setBranch = useCallback((branch) => {
    dispatch({ type: 'SET_BRANCH', payload: branch });
  }, []);

  const setTimePeriod = useCallback((period) => {
    dispatch({ type: 'SET_TIME_PERIOD', payload: period });
  }, []);

  const setCustomDateRange = useCallback((startDate, endDate) => {
    dispatch({ type: 'SET_CUSTOM_DATE_RANGE', payload: { startDate, endDate } });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  const value = {
    ...state,
    setBranch,
    setTimePeriod,
    setCustomDateRange,
    resetFilters,
  };

  return (
    <BranchContext.Provider value={value}>
      {children}
    </BranchContext.Provider>
  );
}
