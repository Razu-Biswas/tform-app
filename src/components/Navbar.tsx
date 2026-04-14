import { NavLink } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <span className={styles.brand}>⚡ T.Form App</span>
      <div className={styles.links}>
        <NavLink
          to="/todos"
          className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
        >
          Todo List
        </NavLink>
        <NavLink
          to="/form-builder"
          className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
        >
          Form Builder
        </NavLink>
        <NavLink
          to="/form-preview"
          className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
        >
          Form Preview
        </NavLink>
      </div>
    </nav>
  );
}