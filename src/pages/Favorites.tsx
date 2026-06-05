import { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { MovieSummary } from '../services/movieService';
import { getMovieDetail, type MovieDetailResponse } from '../services/movieService';
import FavoriteButton from '../components/FavoriteButton';
import useFavorites from '../store/useFavorites';
import { usePageLoading } from '../contexts/PageLoadingContext';
import PlayIcon from '../assets/Design System/Components & Variants/Icon/Play.png';
import StarFillIcon from '../assets/Design System/Components & Variants/Icon/Rating.png';
import EmptyFavoritesIllustration from '../assets/Design System/Components & Variants/Movie Vector Favorites Empty.png';

export default function Favorites() {
  const { setReady } = usePageLoading();
  const favorites = useFavorites((state) => state.favorites);
  const toggle = useFavorites((state) => state.toggle);
  const items = Object.values(favorites) as MovieSummary[];
  const [removingIds, setRemovingIds] = useState<number[]>([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerMovieId, setTrailerMovieId] = useState<number | null>(null);
  const [overviews, setOverviews] = useState<Record<number, string>>({});

  // Handle page loading state
  useEffect(() => {
    setReady(true);
  }, [setReady]);

  const trailerQuery = useQuery<MovieDetailResponse>({
    queryKey: ['movie-detail', trailerMovieId],
    queryFn: () => getMovieDetail(trailerMovieId!),
    enabled: showTrailer && !!trailerMovieId,
  });

  const trailerKey = useMemo(() => {
    const results = trailerQuery.data?.videos?.results || [];
    return (
      results.find((video) => video.site === 'YouTube' && video.type === 'Trailer')?.key ||
      results[0]?.key ||
      null
    );
  }, [trailerQuery.data]);

  const handleWatchTrailer = (movieId: number) => {
    setTrailerMovieId(movieId);
    setShowTrailer(true);
  };

  const handleUnfavorite = (movie: MovieSummary) => {
    if (removingIds.includes(movie.id)) return;
    setRemovingIds((current) => [...current, movie.id]);
    window.setTimeout(() => {
      toggle(movie);
      setRemovingIds((current) => current.filter((id) => id !== movie.id));
    }, 520);
  };

  // Fetch overview for movies that don't have it
  const moviesNeedingOverview = items.filter((m) => !m.overview && !overviews[m.id]);

  useQuery({
    queryKey: ['fetch-overviews', moviesNeedingOverview.map((m) => m.id).join(',')],
    queryFn: async () => {
      if (moviesNeedingOverview.length === 0) return;
      const newOverviews: Record<number, string> = {};
      for (const movie of moviesNeedingOverview) {
        try {
          const data = await getMovieDetail(movie.id);
          if (data.overview) {
            newOverviews[movie.id] = data.overview;
          }
        } catch {
          // ignore errors
        }
      }
      setOverviews((prev) => ({ ...prev, ...newOverviews }));
    },
    enabled: moviesNeedingOverview.length > 0,
  });
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-[1160px] px-4 pt-[154px] pb-[286px]">
      <h2 className="mb-[104px] text-3xl font-bold text-white">Favorites</h2>

      {items.length === 0 ? (
        <div className="mx-auto flex w-[300px] flex-col items-center gap-6 rounded-[32px] bg-[#090b10] px-6 py-8 shadow-soft">
          <img
            src={EmptyFavoritesIllustration}
            alt="Empty favorites illustration"
            className="h-[200px] w-[200px] object-contain"
          />
          <div className="flex w-[246px] flex-col items-center gap-2 text-center">
            <p className="text-[16px] font-semibold leading-[30px] text-white">Data Empty</p>
            <p className="text-[14px] leading-[28px] text-[#A4A7AE]">
              You don't have a favorite movie yet
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex h-[52px] w-[300px] items-center justify-center rounded-full bg-[#961200] px-4 text-[16px] font-semibold text-white shadow-lg shadow-[#961200]/20 transition hover:bg-[#7a0f00]"
          >
            Explore Movie
          </button>
        </div>
      ) : (
        <div className="space-y-6 favorites-list">
          {items.map((movie: MovieSummary, index) => {
            const isRemoving = removingIds.includes(movie.id);
            return (
              <div
                key={movie.id}
                className={`group relative overflow-hidden rounded-[32px] bg-[#080a0f] p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer ${
                  isRemoving ? 'fade-out-item pointer-events-none' : 'translate-y-0'
                }`}
                onClick={() => navigate('/movie/' + movie.id)}
              >
                <FavoriteButton
                  movie={movie}
                  wrapperClassName="absolute right-6 top-6"
                  buttonClassName="inline-flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[rgba(10,13,18,0.6)] border border-white/10 transition hover:bg-white/10"
                  iconClassName="h-6 w-6"
                  onUnfavorite={handleUnfavorite}
                />

                <div className="flex items-start gap-6">
                  <img
                    src={
                      movie.poster_path
                        ? `${import.meta.env.VITE_TMDB_IMAGE_BASE_URL}/w300${movie.poster_path}`
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
                    {movie.overview || overviews[movie.id] ? (
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
                        {movie.overview || overviews[movie.id]}
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
                      <span className="w-[110px] text-center font-poppins font-semibold text-[16px] leading-[30px]">
                        Watch Trailer
                      </span>
                      <img src={PlayIcon} alt="Play" className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {index !== items.length - 1 && <div className="mt-6 h-px bg-white/10" />}
              </div>
            );
          })}
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
