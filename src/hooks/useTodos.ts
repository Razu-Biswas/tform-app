import { useState, useEffect } from 'react';
import type { Todo, User } from '../types';
import { api } from '../services/api';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     setLoading(true);
    //     const [todosRes, usersRes] = await Promise.all([
    //       // fetch('https://jsonplaceholder.typicode.com/todos'),
    //       // fetch('https://jsonplaceholder.typicode.com/users'),
    //       api.getTodos(),
    //       api.getUsers(),
    //     ]);
    //     const todosData: Todo[] = await todosRes.json();
    //     const usersData: User[] = await usersRes.json();
    //     setTodos(todosData);
    //     setUsers(usersData);
    //   } catch {
    //     setError('Failed to fetch data');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();
    const fetchData = async () => {
      try {
        setLoading(true);

        const [todosData, usersData] = await Promise.all([
          api.getTodos(),
          api.getUsers(),
        ]);

        setTodos(todosData);
        setUsers(usersData);
      } catch {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, []);

  return { todos, users, loading, error };
}