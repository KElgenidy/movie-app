import { create } from "zustand";
import { persist } from "zustand/middleware";


// This file defines a Zustand store for managing favorite movies.
// It uses the `persist` middleware to save the favorites in local storage.
type Movie = {
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
};

type FavoritesState = {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (id: number) => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favorites: [],
      addFavorite: (movie) =>
        set((state) =>
          state.favorites.some((fav) => fav.id === movie.id)
            ? state
            : { favorites: [...state.favorites, movie] }
        ),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.id !== id),
        })),
    }),
    { name: "favorites-storage" }
  )
);
