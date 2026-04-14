import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FormField, SubmittedEntry } from '../types';

//Fields Store (in-memory) 
interface FieldState {
  fields: FormField[];
  addField: (field: FormField) => void;
  removeField: (id: string) => void;
  moveField: (from: number, to: number) => void;
  clearFields: () => void;
}

export const useFieldStore = create<FieldState>()((set) => ({
  fields: [],

  addField: (field) =>
    set((s) => ({ fields: [...s.fields, field] })),

  removeField: (id) =>
    set((s) => ({ fields: s.fields.filter((f) => f.id !== id) })),

  moveField: (from, to) =>
    set((s) => {
      const arr = [...s.fields];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return { fields: arr };
    }),

  clearFields: () => set({ fields: [] }),
}));

//  Submissions Store (localStorage persist) 
interface SubmissionState {
  submissions: SubmittedEntry[];
  addSubmission: (entry: SubmittedEntry) => void;
  clearSubmissions: () => void;
}

export const useSubmissionStore = create<SubmissionState>()(
  persist(
    (set) => ({
      submissions: [],

      addSubmission: (entry) =>
        set((s) => ({ submissions: [entry, ...s.submissions] })),

      clearSubmissions: () => set({ submissions: [] }),
    }),
    { name: 'form-submissions' }
  )
);