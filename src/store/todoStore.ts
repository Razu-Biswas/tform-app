import { create } from 'zustand';
import type { TodoFilters } from '../types';

interface TodoState {
  filters: TodoFilters;
  setFilters: (partial: Partial<TodoFilters>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: TodoFilters = {
  userId: '',
  status: '',
  search: '',
  page: 1,
};

export const useTodoStore = create<TodoState>()((set) => ({
  filters: { ...DEFAULT_FILTERS },

  setFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial },
    })),

  resetFilters: () =>
    set({ filters: { ...DEFAULT_FILTERS } }),
}));