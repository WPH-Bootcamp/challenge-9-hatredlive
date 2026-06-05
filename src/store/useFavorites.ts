import { create } from 'zustand';

type MovieSummary = {
  id: number;
  title?: string;
  poster_path?: string | null;
  release_date?: string;
  vote_average?: number;
  overview?: string;
};

export type FavoritesState = {
  favorites: Record<number, MovieSummary>;
  add: (m: MovieSummary) => void;
  remove: (id: number) => void;
  toggle: (m: MovieSummary) => void;
};

const STORAGE_KEY = 'favorites_movies';

const useFavorites = create<FavoritesState>()((set, get) => ({
  favorites: {},
  add: (m) => set((s) => ({ favorites: { ...s.favorites, [m.id]: m } })),
  remove: (id) =>
    set((s) => {
      const next = { ...s.favorites };
      delete next[id];
      return { favorites: next };
    }),
  toggle: (m) => {
    const exists = Boolean(get().favorites[m.id]);
    if (exists) get().remove(m.id);
    else get().add(m);
  },
}));

// Persist/load manually (avoids adding zustand middleware dep)
export function initFavoritesPersistence() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<number, MovieSummary>;
      useFavorites.setState({ favorites: parsed });
    }
  } catch {
    // ignore
  }

  useFavorites.subscribe((state) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.favorites));
    } catch {
      // ignore
    }
  });
}

export default useFavorites;
