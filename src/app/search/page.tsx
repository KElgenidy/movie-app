"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useFavoritesStore } from "@/stores/favorites-store";
import styles from "./Search.module.css";
import { useDebounce } from "react-use";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

// API URL
const API_BASE_URL = "https://api.themoviedb.org/3";

// API Key
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

type Movie = {
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
};

export default function SearchPage() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { favorites, addFavorite, removeFavorite } = useFavoritesStore();

  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useDebounce(
    () => {
      setDebouncedQuery(query);
    },
    500,
    [query]
  );

  const fetchSearchResults = async (searchQuery = "") => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      setError(null);
      console.log("No search query provided.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);
    console.log("Fetching search results for:", searchQuery);
    try {
      const endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
        query
      )}`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Search results:", data.results);
      setResults(data.results || []);
    } catch (err) {
      setError((err as Error).message || "An error occurred");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults(debouncedQuery);
  }, [debouncedQuery]);

  const isFavorite = (id: number) => favorites.some((m) => m.id === id);

  return (
    <section className={styles.search}>
      <h1 className={styles.headertitle}>Search Movies</h1>
      <div>
        <input
        
          type="text"
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <section>
        <ul className={styles.results}>
          {results && ( results.map((movie) => (
            <li key={movie.id}>
              <article className={styles.card}>
                <Image
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/No-Poster.png"
                  }
                  alt={movie.original_title}
                  width={500}
                  height={750}
                  placeholder="blur"
                  blurDataURL="/No-Poster.png"
                  className={styles.poster}
                  loading="lazy"
                  onClick={() => router.push(`/movies-details/${movie.id}`)}
                  aria-label={`View details for ${movie.original_title}`}
                  role="button"
                />

                <h3 className={styles.title}>{movie.original_title}</h3>

                <div className={styles.content}>
                  <div className={styles.rating}>
                    <Image
                      src="/star.png"
                      alt="star-rating"
                      width={20}
                      height={20}
                      className={styles.starRating}
                    />
                    <p className={styles.voteAverage}>
                      {movie.vote_average
                        ? movie.vote_average.toFixed(1)
                        : "N/A"}
                    </p>
                  </div>
                  <span className={styles.dot}>●</span>
                  <p className={styles.lang}>{movie.original_language}</p>
                  <span className={styles.dot}>●</span>
                  <p className={styles.year}>
                    {movie.release_date
                      ? movie.release_date.split("-")[0]
                      : "N/A"}
                  </p>
                </div>

                {isFavorite(movie.id) ? (
                  <button
                    type="button"
                    className={styles.favoriteBtn}
                    onClick={() => removeFavorite(movie.id)}
                    aria-label="Remove from favorites"
                  >
                    Remove from Favorites
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.favoriteBtn}
                    onClick={() => addFavorite(movie)}
                    aria-label="Add to favorites"
                  >
                    Add to Favorites
                  </button>
                )}
              </article>
            </li>
          )))}
        </ul>
        {loading && <ClipLoader color="#ffb400" size={40}/>}
        {query === "" && results.length === 0 && !loading && !error && (
          <div className={styles.noResults}>
            Start typing to search for movies...
          </div>
        )}
        {query && results.length === 0 && !loading && (
          <div className={styles.noResults}>No results found.</div>
        )}
        {error && <div className={styles.error}>Error: {error}</div>}
      </section>
    </section>
  );
}
