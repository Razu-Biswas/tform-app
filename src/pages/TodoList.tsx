import { useMemo } from 'react';
import { useTodos } from '../hooks/useTodos';
import { useTodoStore } from '../store/todoStore';
import styles from '../styles/TodoList.module.css';

const PAGE_SIZE = 10;

export default function TodoList() {
  const { todos, users, loading, error } = useTodos();
  const { filters, setFilters, resetFilters } = useTodoStore();

  const userMap = useMemo(() => {
    const map: Record<number, string> = {};
    users.forEach((u) => (map[u.id] = u.name));
    return map;
  }, [users]);

  const filtered = useMemo(() => {
    return todos.filter((todo) => {
      const matchUser = filters.userId
        ? todo.userId === Number(filters.userId)
        : true;
      const matchStatus =
        filters.status === 'completed'
          ? todo.completed
          : filters.status === 'pending'
            ? !todo.completed
            : true;
      const matchSearch = filters.search
        ? todo.title.toLowerCase().includes(filters.search.toLowerCase())
        : true;
      return matchUser && matchStatus && matchSearch;
    });
  }, [todos, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(filters.page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const hasActiveFilters =
    !!filters.userId || !!filters.status || !!filters.search;

  if (loading) {
    return (
      <div className={styles.center}>
        <div className={styles.spinner} />
        <p>Loading todos…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.center}>
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Todo List</h1>
        <span className={styles.totalBadge}>{filtered.length} results</span>
      </div>
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="16" height="16"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search todos…"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
          />
          {filters.search && (
            <button
              className={styles.clearIcon}
              onClick={() => setFilters({ search: '', page: 1 })}
            >
              ✕
            </button>
          )}
        </div>

        <select
          className={styles.select}
          value={filters.userId}
          onChange={(e) => setFilters({ userId: e.target.value, page: 1 })}
        >
          <option value="">All Users</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>

        <select
          className={styles.select}
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value, page: 1 })}
        >
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>

        {hasActiveFilters && (
          <button className={styles.resetBtn} onClick={resetFilters}>
            Reset All
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <div className={styles.tagRow}>
          {filters.search && (
            <span className={styles.tag}>
              Search: "{filters.search}"
              <button onClick={() => setFilters({ search: '', page: 1 })}>✕</button>
            </span>
          )}
          {filters.userId && (
            <span className={styles.tag}>
              User: {userMap[Number(filters.userId)]}
              <button onClick={() => setFilters({ userId: '', page: 1 })}>✕</button>
            </span>
          )}
          {filters.status && (
            <span className={styles.tag}>
              Status: {filters.status}
              <button onClick={() => setFilters({ status: '', page: 1 })}>✕</button>
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <div className={styles.tableWrap}>
        {paginated.length === 0 ? (
          <div className={styles.empty}>
            <p>No todos match your filters.</p>
            <button className={styles.resetBtn} onClick={resetFilters}>
              Clear filters
            </button>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sl</th>
                <th>Title</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((todo) => (
                <tr
                  key={todo.id}
                  className={todo.completed ? styles.completedRow : ""}
                >
                  <td className={styles.idCell}>{todo.id}</td>

                  <td className={styles.titleCell}>
                    <div className={styles.todoContent}>
                      <h4 className={todo.completed ? styles.completedText : ""}>
                        {filters.search
                          ? highlight(todo.title, filters.search)
                          : todo.title}
                      </h4>

                      <p className={styles.byText}>
                        By: {userMap[todo.userId] ?? `User ${todo.userId}`}
                      </p>
                    </div>
                  </td>

                  <td>
                    <span
                      className={
                        todo.completed
                          ? styles.badgeCompleted
                          : styles.badgePending
                      }
                    >
                      {todo.completed ? "Completed" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

       {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button className={styles.pageBtn}
            disabled={safePage === 1}
            onClick={() => setFilters({ page: 1 })}>«</button>
          <button className={styles.pageBtn}
            disabled={safePage === 1}
            onClick={() => setFilters({ page: safePage - 1 })}>‹ Prev</button>

          {pageNumbers(safePage, totalPages).map((p, i) =>
            p === '…' ? (
              <span key={`d${i}`} className={styles.dots}>…</span>
            ) : (
              <button
                key={p}
                className={`${styles.pageNum} ${safePage === p ? styles.pageNumActive : ''}`}
                onClick={() => setFilters({ page: p as number })}
              >{p}</button>
            )
          )}

          <button className={styles.pageBtn}
            disabled={safePage === totalPages}
            onClick={() => setFilters({ page: safePage + 1 })}>Next ›</button>
          <button className={styles.pageBtn}
            disabled={safePage === totalPages}
            onClick={() => setFilters({ page: totalPages })}>»</button>
        </div>
      )}

      <p className={styles.pageInfo}>
        Page {safePage} of {totalPages} · {filtered.length} todos
      </p>
    </div>
  );
}

function highlight(text: string, query: string) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function pageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '…')[] = [1];
  if (current > 3) pages.push('…');
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push('…');
  pages.push(total);
  return pages;
}