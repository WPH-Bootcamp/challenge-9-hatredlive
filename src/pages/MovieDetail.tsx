import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMovieDetail, type MovieCast, type MovieDetailResponse } from '../services/movieService';
import useFavorites from '../store/useFavorites';
import { usePageLoading } from '../contexts/PageLoadingContext';
import CalendarIcon from '../assets/Design System/Components & Variants/Icon/Calendar.png';
import CheckIcon from '../assets/Design System/Components & Variants/Icon/Check.png';
import HeartIcon from '../assets/Design System/Components & Variants/Icon/Heart.png';
import HeartFillIcon from '../assets/Design System/Components & Variants/Icon/HeartFill.png';
import PlayIcon from '../assets/Design System/Components & Variants/Icon/Play.png';
import StarFillIcon from '../assets/Design System/Components & Variants/Icon/Rating.png';
import VideoIcon from '../assets/Design System/Components & Variants/Icon/Video.png';
import EmojiHappyIcon from '../assets/Design System/Components & Variants/Icon/emoji-happy.png';

const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

export default function MovieDetail() {
  const { id } = useParams();
  const movieId = Number(id);
  const { setReady } = usePageLoading();
  const { data, isLoading, isError } = useQuery<MovieDetailResponse>({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: !!movieId,
  });

  const favorites = useFavorites((state) => state.favorites);
  const toggle = useFavorites((state) => state.toggle);
  const isFav = Boolean(favorites[movieId]);
  const [showToast, setShowToast] = useState(false);
  const [hideToast, setHideToast] = useState(false);
  const [showHeartParticles, setShowHeartParticles] = useState(false);
  const [showUnfavorite, setShowUnfavorite] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  // Handle page loading state
  useEffect(() => {
    if (isLoading) {
      setReady(false);
    } else if (!isLoading && !isError && data) {
      setReady(true);
    }
  }, [isLoading, isError, data, setReady]);

  useEffect(() => {
    if (!showHeartParticles) return;
    const heartTimeout = window.setTimeout(() => {
      setShowHeartParticles(false);
    }, 900);
    return () => window.clearTimeout(heartTimeout);
  }, [showHeartParticles]);

  useEffect(() => {
    if (!showUnfavorite) return;
    const timeout = window.setTimeout(() => {
      setShowUnfavorite(false);
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [showUnfavorite]);

  useEffect(() => {
    if (!showToast) return;
    const timeout = window.setTimeout(() => {
      setHideToast(true);
      const hideTimeout = window.setTimeout(() => setShowToast(false), 300);
      return () => window.clearTimeout(hideTimeout);
    }, 2600);
    return () => window.clearTimeout(timeout);
  }, [showToast]);

  const trailerKey = useMemo(() => {
    const trailer =
      data?.videos?.results?.find(
        (video: { type: string; site: string; key: string }) =>
          video.type === 'Trailer' && video.site === 'YouTube'
      ) || data?.videos?.results?.[0];
    return trailer ? trailer.key : null;
  }, [data]);

  if (!movieId) {
    return <div className="text-rose-300">Invalid movie ID.</div>;
  }

  if (isLoading) {
    return <div className="text-slate-300">Loading movie...</div>;
  }

  if (isError) {
    return <div className="text-rose-300">Failed to load movie.</div>;
  }

  if (!data) {
    return <div className="text-slate-300">Movie data not found.</div>;
  }

  const handleFavorite = () => {
    const willAdd = !isFav;
    toggle({
      id: Number(id),
      title: data?.title ?? '',
      poster_path: data?.poster_path ?? null,
      release_date: data?.release_date ?? '',
      vote_average: data?.vote_average ?? 0,
      overview: data?.overview ?? '',
    });
    if (willAdd) {
      setShowToast(true);
      setShowHeartParticles(true);
    } else {
      setShowUnfavorite(true);
    }
  };

  const backdrop = data.backdrop_path || data.poster_path;
  const releaseDate = data.release_date
    ? new Date(data.release_date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'Unknown';
  const genres = data.genres?.map((genre) => genre.name).join(', ') || 'Unknown';
  const ageLimit = data.adult ? '18+' : '13';
  const cast = data.credits?.cast?.slice(0, 6) || [];

  return (
    <div className="space-y-6 lg:space-y-10">
      <section className="relative w-[calc(100vw-2rem)] mx-[calc(50%-50vw)] overflow-hidden rounded-[32px] bg-slate-950 shadow-soft min-h-[740px] lg:min-h-[810px]">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: backdrop ? `url(${IMAGE_BASE}/w1280${backdrop})` : undefined,
            }}
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-x-0 bottom-0 h-[160px] bg-gradient-to-t from-black to-transparent" />
        </div>

        {showToast && (
          <div
            className={`fixed left-1/2 top-24 z-50 flex h-[52px] w-[531px] -translate-x-1/2 items-center justify-center gap-3 rounded-[16px] bg-black/25 px-6 text-white backdrop-blur-[20px] border border-white/10 ${hideToast ? 'toast-hide' : 'toast-popup'}`}
          >
            <img src={CheckIcon} alt="Success" className="h-6 w-6" />
            <span className="text-sm font-medium">Success Add to Favorites</span>
          </div>
        )}

        <div className="absolute inset-x-0 top-[440px] lg:top-[412px] mx-auto w-full max-w-[1160px] lg:h-[912px] px-4 pb-[40px] lg:pb-0">
          <div className="flex flex-row gap-4 items-start lg:flex-row lg:gap-8 lg:items-start lg:w-[1160px]">
            <div className="flex-shrink-0 mr-4 lg:mr-0">
              {data.poster_path ? (
                <img
                  src={`${IMAGE_BASE}/w500${data.poster_path}`}
                  alt={data.title}
                  className="h-[171px] w-[116px] lg:h-[384px] lg:w-[260px] rounded-[12px] border border-white/10 object-cover shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                />
              ) : (
                <div className="h-[140px] w-[100px] lg:h-[384px] lg:w-[260px] rounded-[8px] lg:rounded-[12px] bg-slate-800" />
              )}
            </div>

            <div className="flex flex-col gap-2 lg:gap-6 flex-1 min-w-0 lg:w-[868px] text-white">
              <div className="space-y-1 lg:space-y-3">
                <h1 className="text-[20px] lg:text-[40px] font-bold leading-[34px] lg:leading-[56px] tracking-[-0.02em] text-[#FDFDFD]">
                  {data.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-[14px] lg:text-sm text-slate-200">
                  <span className="inline-flex items-center gap-2 text-white">
                    <img
                      src={CalendarIcon}
                      alt="Calendar"
                      className="h-5 lg:h-5 w-5 lg:w-5 object-contain"
                    />
                    <span className="truncate leading-[28px]">{releaseDate}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 lg:gap-4 w-full lg:w-auto justify-start mb-6 lg:mb-0">
                {trailerKey && (
                  <button
                    type="button"
                    onClick={() => setShowTrailer(true)}
                    className="flex-1 h-[44px] lg:w-[301px] lg:flex-none mx-auto lg:mx-0 lg:h-[52px] items-center justify-center gap-2 rounded-full bg-[#961200] px-4 lg:px-6 text-white text-sm lg:text-base shadow-lg shadow-[#961200]/20 transition hover:bg-[#7a0f00] inline-flex"
                  >
                    <span className="font-semibold">Watch Trailer</span>
                    <img src={PlayIcon} alt="Play" className="h-4 lg:h-5 w-4 lg:w-5" />
                  </button>
                )}
                <div className="relative flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleFavorite}
                    className="inline-flex h-[44px] lg:h-[52px] w-[44px] lg:w-[52px] items-center justify-center rounded-full bg-white/10 border border-white/10 transition hover:bg-white/20"
                  >
                    <img
                      src={isFav ? HeartFillIcon : HeartIcon}
                      alt={isFav ? 'Favorited' : 'Favorite'}
                      className="h-4 lg:h-6 w-4 lg:w-6"
                    />
                  </button>
                  {showHeartParticles && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <img
                          key={index}
                          src={HeartFillIcon}
                          alt=""
                          className={`heart-particle heart-particle-${index}`}
                        />
                      ))}
                    </div>
                  )}
                  {showUnfavorite && (
                    <div className="absolute inset-0 pointer-events-none">
                      <svg
                        viewBox="0 0 24 24"
                        className="broken-heart-piece broken-heart-piece-1"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 4.5c1.7 0 3.2 1 4 2.5 0 0 2-3.4 6-1.9 4 1.5 3.4 7.4-1.5 11.1L12 21l0-18.5z"
                          fill="currentColor"
                        />
                      </svg>
                      <svg
                        viewBox="0 0 24 24"
                        className="broken-heart-piece broken-heart-piece-0"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 4.5c-1.7 0-3.2 1-4 2.5 0 0-2-3.4-6-1.9-4 1.5-3.4 7.4 1.5 11.1L12 21l0-18.5z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-3 grid-cols-3 lg:grid-cols-3 lg:gap-4 w-full lg:w-auto">
                <div className="rounded-[16px] border border-[#252B37] bg-[#000000] p-4 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                  <img src={StarFillIcon} alt="Rating" className="mx-auto h-6 lg:h-8 w-6 lg:w-8" />
                  <p className="mt-3 text-[12px] lg:text-[16px] font-normal text-[#D5D7DA]">
                    Rating
                  </p>
                  <p className="mt-1 text-[18px] lg:text-[20px] font-semibold text-[#FDFDFD]">
                    {data.vote_average?.toFixed(1) ?? '—'}/10
                  </p>
                </div>
                <div className="rounded-[16px] border border-[#252B37] bg-[#000000] p-4 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                  <img src={VideoIcon} alt="Genre" className="mx-auto h-6 lg:h-8 w-6 lg:w-8" />
                  <p className="mt-3 text-[12px] lg:text-[16px] font-normal text-[#D5D7DA]">
                    Genre
                  </p>
                  <p className="mt-1 text-[18px] lg:text-[20px] font-semibold text-[#FDFDFD]">
                    {genres.split(',')[0] || 'Action'}
                  </p>
                </div>
                <div className="rounded-[16px] border border-[#252B37] bg-[#000000] p-4 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                  <img
                    src={EmojiHappyIcon}
                    alt="Age Limit"
                    className="mx-auto h-6 lg:h-8 w-6 lg:w-8"
                  />
                  <p className="mt-3 text-[12px] lg:text-[16px] font-normal text-[#D5D7DA]">
                    Age Limit
                  </p>
                  <p className="mt-1 text-[18px] lg:text-[20px] font-semibold text-[#FDFDFD]">
                    {ageLimit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showTrailer && trailerKey && (
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
              <iframe
                title="Movie trailer"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                className="h-[450px] w-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <section className="space-y-3 lg:space-y-4 mt-10 lg:mt-10 max-w-[1160px] mx-auto px-4">
        <h2 className="text-[20px] lg:text-[32px] font-bold text-[#FDFDFD]">Overview</h2>
        <p className="w-full text-[14px] lg:text-[16px] leading-6 lg:leading-7 text-[#A4A7AE] text-justify">
          {data.overview}
        </p>
      </section>

      <section className="space-y-4 lg:space-y-6 max-w-[1160px] mx-auto px-4 pb-[80px] lg:pb-[149px]">
        <div className="flex flex-col gap-4 lg:gap-6 w-full">
          <h2 className="text-[20px] lg:text-[32px] font-bold text-[#FDFDFD]">Cast & Crew</h2>
          <div className="grid gap-3 lg:gap-4 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
            {cast.map((c: MovieCast) => (
              <div
                key={c.cast_id}
                className="flex h-[84px] lg:h-[104px] w-full lg:w-auto items-center gap-3 lg:gap-4 rounded-none bg-transparent p-0"
              >
                {c.profile_path ? (
                  <img
                    src={`${IMAGE_BASE}/w185${c.profile_path}`}
                    alt={c.name}
                    className="h-[84px] w-[55px] lg:h-[104px] lg:w-[69px] rounded-[8px] lg:rounded-[10px] object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="h-[84px] w-[55px] lg:h-[104px] lg:w-[69px] rounded-[8px] lg:rounded-[10px] bg-slate-800 flex-shrink-0" />
                )}
                <div className="flex h-full min-w-0 flex-1 flex-col justify-center gap-0.5 lg:gap-1">
                  <p className="truncate text-[14px] lg:text-[16px] font-semibold leading-[28px] text-[#FDFDFD]">
                    {c.name}
                  </p>
                  <p className="truncate text-[14px] lg:text-[16px] font-normal leading-[28px] text-[#A4A7AE]">
                    {c.character}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
