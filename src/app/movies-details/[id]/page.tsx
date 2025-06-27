"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useFavoritesStore } from "@/stores/favorites-store";

import styles from "./MD.module.css";

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

type Genre = { id: number; name: string };
type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string;
};

type Crew = { id: number; name: string; job: string };

type MovieDetails = {
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  genres: Genre[];
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
  runtime: number;
  vote_average: number;
};

export default function MovieDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const movieId = parseInt(params.id);
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [director, setDirector] = useState<string>("");
  const [cast, setCast] = useState<Cast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { favorites, addFavorite, removeFavorite } = useFavoritesStore();

  const isFavorite = (id: number) => favorites.some((f) => f.id === id);

  useEffect(() => {
    if (isNaN(movieId)) {
      setError("Invalid movie ID");
      setLoading(false);
      return;
    }

    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const [movieResponse, creditsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/movie/${movieId}`, API_OPTIONS),
          fetch(`${API_BASE_URL}/movie/${movieId}/credits`, API_OPTIONS),
        ]);

        if (!movieResponse.ok || !creditsResponse.ok) {
          throw new Error("Failed to fetch movie details or credits");
        }
        const movieData: MovieDetails = await movieResponse.json();
        const creditsData = await creditsResponse.json();
        setMovieDetails(movieData);
        const directorObj = creditsData.crew.find(
          (member: Crew) => member.job === "Director"
        );

        setDirector(directorObj ? directorObj.name : "Unknown Director");
        setCast(creditsData.cast.slice(0, 5)); // Get top 5 cast members
      } catch (err) {
        setError(
          (err as Error).message ||
            "An error occurred while fetching movie details"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [movieId]);

  if (isNaN(movieId)) {
    return <div>Invalid movie ID</div>;
  }
  if (loading) {
    return <div>Loading movie details...</div>;
  }

  if (error || !movieDetails) return <div>{error || "Movie not found"}</div>;

  return (
    <section
      className={styles.movieDetails}
      style={{
        backgroundImage: movieDetails.backdrop_path
          ? `url(https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path})`
          : "none",
      }}
    >
      <div className={styles.movieInfo}>
        <Image
          src={`https://image.tmdb.org/t/p/w300${movieDetails.poster_path}`}
          alt={movieDetails.original_title}
          width={300}
          height={300}
        />

        <div className={styles.details}>
          <h1>
            {movieDetails.original_title} (
            {movieDetails.release_date?.slice(0, 4)})
          </h1>
          <p>
            <strong>Rating:</strong> {movieDetails.vote_average.toFixed(1)} / 10
          </p>
          <p>
            <strong>Runtime:</strong> {movieDetails.runtime} min
          </p>
          <p>
            <strong>Genres:</strong>{" "}
            {movieDetails.genres.map((g) => g.name).join(", ")}
          </p>
          <p>
            <strong>Director:</strong> {director}
          </p>
          <p>
            <strong>Cast:</strong> {cast.map((c) => c.name).join(", ")}
          </p>
          <p style={{ marginTop: "1rem" }}>
            <strong>Synopsis:</strong> {movieDetails.overview}
          </p>

          {isFavorite(movieDetails.id) ? (
            <button
              type="button"
              className={styles.favoriteBtn}
              onClick={() => removeFavorite(movieDetails.id)}
              aria-label="Remove from favorites"
            >
              Remove from Favorites
            </button>
          ) : (
            <button
              type="button"
              className={styles.favoriteBtn}
              onClick={() =>
                movieDetails.poster_path &&
                addFavorite({ ...movieDetails, poster_path: movieDetails.poster_path })
              }
              aria-label="Add to favorites"
            >
              Add to Favorites
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
