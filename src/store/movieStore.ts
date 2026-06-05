import { create } from 'zustand';

type MovieStore = Record<string, never>;

export const useMovieStore = create<MovieStore>(() => ({}));
