import { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getMovieDetail,
  searchMovies,
  type MovieDetailResponse,
  type MovieListResponse,
  type MovieSummary,
} from '../services/movieService';
import Skeleton from '../components/Skeleton';
import FavoriteButton from '../components/FavoriteButton';
import { usePageLoading } from '../contexts/PageLoadingContext';
import PlayIcon from '../assets/Design System/Components & Variants/Icon/Play.png';
import StarFillIcon from '../assets/Design System/Components & Variants/Icon/Rating.png';
import SearchEmptyIllustration from '../assets/Design System/Components & Variants/Movie Vector Search Empty.png';

const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

function useQueryValue(key: string) {
  return new URLSearchParams(useLocation().search).get(key) ?? '';
}

export default function Search() {
  const queryParam = useQueryValue('q');
  const navigate = useNavigate();
  const { setReady } = usePageLoading();
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerMovieId, setTrailerMovieId] = useState<number | null>(null);

  const searchQuery = useQuery<MovieListResponse>({
    queryKey: ['search', queryParam],
    queryFn: () => searchMovies(queryParam),
    enabled: queryParam.length > 0,
  });

  const trailerQuery = useQuery<MovieDetailResponse>({
    queryKey: ['movie-detail', trailerMovieId],
    queryFn: () => getMovieDetail(trailerMovieId!),
    enabled: showTrailer && !!trailerMovieId,
  });

  const trailerKey = useMemo(() => {
    const results = trailerQuery.data?.videos?.results || [];
    const trailer = results.find((video) => video.site === 'YouTube' && video.type === 'Trailer');
    return trailer?.key || results[0]?.key || null;
  }, [trailerQuery.data]);

  const movies = searchQuery.data?.results || [];
  const isLoading = queryParam ? searchQuery.isFetching : false;
  const isError = searchQuery.isError;

  // Handle page loading state
  useEffect(() => {
    if (isLoading) {
      setReady(false);
    } else if (!isLoading && !isError) {
      setReady(true);
    }
  }, [isLoading, isError, setReady]);

  const handleWatchTrailer = (movieId: number) => {
    setTrailerMovieId(movieId);
    setShowTrailer(true);
  };

  return (
    <div className="mx-auto max-w-[1160px] px-4 pt-[154px] pb-[286px] space-y-10">
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-80 rounded-[32px]" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-[32px] border border-rose-300/20 bg-rose-500/10 p-8 text-sm text-rose-100">
          Failed to load search results. Please try again later.
        </div>
      )}

      {!queryParam && !isLoading && (
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center text-slate-300">
          Search for a movie to start browsing the catalogue.
        </div>
      )}

      {queryParam && !isLoading && !isError && movies.length > 0 && (
        <div className="space-y-6">
          {movies.map((movie: MovieSummary, index) => (
            <div
              key={movie.id}
              className="group relative overflow-hidden rounded-[32px] bg-[#080a0f] p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <FavoriteButton
                movie={movie}
                wrapperClassName="absolute right-6 top-6"
                buttonClassName="inline-flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[rgba(10,13,18,0.6)] border border-white/10 transition hover:bg-white/10"
                iconClassName="h-6 w-6"
              />

              <div className="flex items-start gap-6">
                <img
                  src={
                    movie.poster_path
                      ? `${IMAGE_BASE}/w300${movie.poster_path}`
                      : '/placeholder.png'
                  }
                  alt={movie.title}
                  className="h-[270px] w-[182px] flex-shrink-0 rounded-[12px] object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[24px] font-bold leading-[36px] text-white">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[18px] font-medium leading-[32px] text-white">
                      <img src={StarFillIcon} alt="Rating" className="h-6 w-6" />
                      <span>{movie.vote_average?.toFixed(1) ?? '—'}/10</span>
                    </div>
                  </div>

                  {movie.overview ? (
                    <p
                      className="max-w-[772px] text-[16px] leading-[30px] text-[#A4A7AE]"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxHeight: '60px',
                        whiteSpace: 'normal',
                      }}
                    >
                      {movie.overview}
                    </p>
                  ) : null}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWatchTrailer(movie.id);
                    }}
                    className="inline-flex h-[52px] w-[230px] items-center justify-center gap-2 rounded-full bg-[#961200] px-4 text-[16px] font-semibold leading-[30px] text-white shadow-lg shadow-[#961200]/20 transition hover:bg-[#7a0f00]"
                  >
                    <span className="w-[110px] text-center">Watch Trailer</span>
                    <img src={PlayIcon} alt="Play" className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {index !== movies.length - 1 && <div className="mt-6 h-px bg-white/10" />}
            </div>
          ))}
        </div>
      )}

      {queryParam && !isLoading && !isError && movies.length === 0 && (
        <div className="mt-[104px]">
          <div className="mx-auto flex w-[300px] flex-col items-center gap-6 rounded-[32px] bg-[#090b10] px-6 py-8 shadow-soft">
            <img
              src={SearchEmptyIllustration}
              alt="Search empty illustration"
              className="h-[200px] w-[200px] object-contain"
            />
            <div className="flex w-[246px] flex-col items-center gap-2 text-center">
              <p className="text-[16px] font-semibold leading-[30px] text-white">Data Not Found</p>
              <p className="text-[14px] leading-[28px] text-[#A4A7AE]">Try other keywords</p>
            </div>
          </div>
        </div>
      )}

      {showTrailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-[32px] bg-slate-950 shadow-soft">
            <button
              type="button"
              onClick={() => setShowTrailer(false)}
              className="absolute right-4 top-4 rounded-full bg-black/70 p-3 text-white transition hover:bg-white/10"
            >
              Close
            </button>
            <div className="min-h-[320px] bg-black">
              {trailerQuery.isLoading ? (
                <div className="flex h-80 items-center justify-center text-sm text-slate-300">
                  Loading trailer...
                </div>
              ) : trailerKey ? (
                <iframe
                  title="Movie trailer"
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                  className="h-[450px] w-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-80 items-center justify-center p-8 text-center text-slate-300">
                  Trailer tidak tersedia untuk film ini.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
