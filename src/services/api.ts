const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const api = {
  getTodos: () => fetch(`${BASE_URL}/todos`).then(res => res.json()),
  getUsers: () => fetch(`${BASE_URL}/users`).then(res => res.json()),
};
