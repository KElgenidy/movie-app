import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        App Developed by <span className={styles.text}>Karim Elgenidy</span>
      </p>
    </footer>
  );
}
