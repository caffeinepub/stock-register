import { useState, useEffect } from 'react';
import { RegisterFilters } from '../types';

export function useRegisterFilters() {
  const now = new Date();
  const [filters, setFilters] = useState<RegisterFilters>({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    focusedDay: undefined,
  });

  const setYear = (year: number) => {
    setFilters((prev) => ({ ...prev, year }));
  };

  const setMonth = (month: number) => {
    setFilters((prev) => ({ ...prev, month }));
  };

  const setFocusedDay = (day: number | undefined) => {
    setFilters((prev) => ({ ...prev, focusedDay: day }));
  };

  return {
    filters,
    setYear,
    setMonth,
    setFocusedDay,
  };
}
