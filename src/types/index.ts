export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface User {
  id: number;
  name: string;
}

export interface TodoFilters {
  userId: string;
  status: string;
  search: string;
  page: number;
}

export type FieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio';

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
  required: boolean;
}

export interface SubmittedEntry {
  id: string;
  submittedAt: string;
  data: Record<string, string | boolean>;
}