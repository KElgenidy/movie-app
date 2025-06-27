"use client";
import { useFavoritesStore } from "@/stores/favorites-store";
import Image from "next/image";
import styles from "../search/Search.module.css"; // Or create a new CSS module for favorites
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavoritesStore();
  const router = useRouter();

  if (favorites.length === 0) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>No favorite movies yet.</div>;
  }

  return (
    <section className={styles.search}>
      <h1>Your Favorite Movies</h1>
      <ul className={styles.results}>
        {favorites.map((movie) => (
          <li key={movie.id}>
            <article className={styles.card}>
              <Image
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/No-Poster.png"}
                alt={movie.original_title}
                width={120}
                height={180}
                className={styles.poster}
                onClick={() => router.push(`/movies-details/${movie.id}`)}
                aria-label={`View details for ${movie.original_title}`}
                role="button"
              />
              <h2 className={styles.title}>{movie.original_title}</h2>
              <div className={styles.content}>
                <span className={styles.lang}>{movie.original_language}</span>
                <span className={styles.year}>{movie.release_date ? movie.release_date.split("-")[0] : "N/A"}</span>
                <span className={styles.rating}>{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</span>
              </div>
              <button
                type="button"
                className={styles.favoriteBtn}
                onClick={() => removeFavorite(movie.id)}
                aria-label="Remove from favorites"
              >
                Remove from Favorites
              </button>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}