import api from '../lib/axios';

export type MovieVideo = {
  key: string;
  name: string;
  site: string;
  type: string;
};

export type MovieCast = {
  cast_id: number;
  character: string;
  name: string;
  profile_path?: string | null;
};

export type MovieSummary = {
  id: number;
  title: string;
  overview?: string;
  poster_path?: string | null;
  release_date?: string;
  vote_average?: number;
  adult?: boolean;
  backdrop_path?: string | null;
  runtime?: number;
  genres?: Array<{ id: number; name: string }>;
  videos?: { results: MovieVideo[] };
  credits?: { cast: MovieCast[] };
  similar?: { results: MovieSummary[] };
};

export type MovieListResponse = {
  page: number;
  results: MovieSummary[];
  total_pages: number;
  total_results: number;
};

export type MovieDetailResponse = MovieSummary & {
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  videos: { results: MovieVideo[] };
  credits: { cast: MovieCast[] };
  similar: { results: MovieSummary[] };
};

export const getPopularMovies = (page = 1) => {
  return api.get<MovieListResponse>('/movie/popular', { params: { page } }).then((r) => r.data);
};

export const getNowPlaying = (page = 1) => {
  return api.get<MovieListResponse>('/movie/now_playing', { params: { page } }).then((r) => r.data);
};

export const getMovieDetail = (id: number) => {
  return api
    .get<MovieDetailResponse>(`/movie/${id}`, {
      params: { append_to_response: 'videos,credits,similar' },
    })
    .then((r) => r.data);
};

export const searchMovies = (query: string, page = 1) => {
  return api
    .get<MovieListResponse>('/search/movie', { params: { query, page } })
    .then((r) => r.data);
};
