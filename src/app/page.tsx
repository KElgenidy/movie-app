import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.main}>
        <h1>Welcome to the Movie App</h1>
        <p className={styles.description}>
          Discover your favorite movies and TV shows.
        </p>
        <div className={styles.button}>
          <Link href="/search" className={styles.link}>
            Search Movies
          </Link>
        </div>
      </section>
    </div>
  );
}
