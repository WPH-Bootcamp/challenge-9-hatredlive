import { Link } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PlayIcon from '../assets/Design System/Components & Variants/Icon/Play.png';
import {
  getMovieDetail,
  getPopularMovies,
  type MovieDetailResponse,
  type MovieListResponse,
  type MovieSummary,
} from '../services/movieService';
import MovieCard from '../components/MovieCard';
import Skeleton from '../components/Skeleton';
import { usePageLoading } from '../contexts/PageLoadingContext';

const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

export default function Home() {
  const { setReady } = usePageLoading();
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerMovieId, setTrailerMovieId] = useState<number | null>(null);
  const [visibleReleaseCount, setVisibleReleaseCount] = useState(15);
  const [mobileVisibleReleaseCount, setMobileVisibleReleaseCount] = useState(8);
  const [trendingMobilePageIndex, setTrendingMobilePageIndex] = useState(0);
  const trendingRef = useRef<HTMLDivElement | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const firstPageQuery = useQuery<MovieListResponse>({
    queryKey: ['popular', 1],
    queryFn: () => getPopularMovies(1),
  });

  const secondPageQuery = useQuery<MovieListResponse>({
    queryKey: ['popular', 2],
    queryFn: () => getPopularMovies(2),
    enabled: firstPageQuery.isSuccess,
  });

  const isLoading = firstPageQuery.isLoading;
  const isError = firstPageQuery.isError;
  const allMovies = firstPageQuery.data?.results || [];
  const moreMovies = secondPageQuery.data?.results || [];
  const movies = [...allMovies, ...moreMovies];

  const featuredMovie = movies[0] as MovieSummary | undefined;
  const trendingMovies = movies.slice(1, 21) as MovieSummary[];
  const newReleaseMovies = movies.slice(6) as MovieSummary[];

  useEffect(() => {
    if (isLoading) {
      setReady(false);
    } else if (!isLoading && !isError && movies.length > 0) {
      setReady(true);
    }
  }, [isLoading, isError, movies.length, setReady]);

  const updateTrendingArrows = () => {
    const el = trendingRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setShowLeftArrow(el.scrollLeft > 24);
    setShowRightArrow(el.scrollLeft < maxScrollLeft - 24);
  };

  useEffect(() => {
    updateTrendingArrows();

    const handleResize = () => {
      updateTrendingArrows();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [trendingMovies]);

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

  const heroBackground = featuredMovie
    ? `${IMAGE_BASE}/w1280${featuredMovie.backdrop_path ?? featuredMovie.poster_path}`
    : null;

  const displayedNewReleases = newReleaseMovies.slice(0, visibleReleaseCount);
  const displayedNewReleasesMobile = newReleaseMovies.slice(0, mobileVisibleReleaseCount);
  const newReleaseRemainder = displayedNewReleases.length % 5;
  const newReleasePlaceholders = newReleaseRemainder === 0 ? 0 : 5 - newReleaseRemainder;
  const remainingNewReleases = newReleaseMovies.length - displayedNewReleases.length;
  const remainingNewReleasesMobile = newReleaseMovies.length - displayedNewReleasesMobile.length;
  const newReleaseFadeHeight =
    remainingNewReleases > 0
      ? visibleReleaseCount <= 15
        ? 620
        : visibleReleaseCount <= 30
          ? 360
          : 220
      : 0;

  if (isLoading)
    return (
      <div className="space-y-8">
        <div className="h-96 rounded-[32px] bg-surface/80 animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-80 rounded-[32px]" />
          ))}
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="rounded-[32px] border border-rose-300/20 bg-rose-500/10 p-8 text-slate-100">
        Failed to load movies. Please refresh the page.
      </div>
    );

  return (
    <div className="space-y-10 xl:space-y-12 pb-10 xl:pb-0">
      <section
        className="relative w-[calc(100vw-2rem)] mx-[calc(50%-50vw)] overflow-hidden rounded-[32px] bg-slate-950 shadow-soft min-h-[720px] sm:min-h-[820px] xl:min-h-[900px]"
        style={{
          backgroundImage: heroBackground
            ? `linear-gradient(to top, rgba(5, 7, 13, 0.92), rgba(5, 7, 13, 0.15)), url(${heroBackground})`
            : undefined,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-x-0 bottom-0 h-[180px] bg-gradient-to-t from-black to-transparent" />

        <div className="relative max-w-[1160px] mx-auto px-4">
          <div className="relative mx-auto flex max-w-[635px] flex-col gap-6 lg:gap-12 pt-[480px] pb-12 lg:absolute lg:left-10 lg:top-[298px] lg:pt-0 lg:pb-0">
            <div className="flex flex-col gap-1.5 lg:gap-4">
              <h1 className="font-poppins text-[48px] font-bold leading-[60px] tracking-[-0.02em] text-[#FDFDFD]">
                {featuredMovie?.title ?? 'Discover the next hit movie'}
              </h1>
              <p className="text-[16px] font-normal leading-[30px] text-[#A4A7AE]">
                {featuredMovie?.overview ||
                  'A highlighted movie with a cinematic hero experience, perfect for your next watch.'}
              </p>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-4 lg:flex-wrap lg:items-center">
              <button
                type="button"
                onClick={() => {
                  if (!featuredMovie?.id) return;
                  setTrailerMovieId(featuredMovie.id);
                  setShowTrailer(true);
                }}
                className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#961200] px-4 text-[#FDFDFD] shadow-lg shadow-[#961200]/20 transition hover:bg-[#7a0f00] lg:w-[230px]"
              >
                <span className="w-[110px] text-center font-poppins font-semibold text-[16px] leading-[30px]">
                  Watch Trailer
                </span>
                <img src={PlayIcon} alt="Play" className="h-6 w-6" />
              </button>
              <Link
                to={featuredMovie ? `/movie/${featuredMovie.id}` : '#'}
                className="inline-flex h-[52px] w-full items-center justify-center rounded-full bg-[#0A0D12]/60 border border-[#181D27] text-[16px] font-semibold leading-[30px] text-[#FDFDFD] backdrop-blur-[20px] transition hover:bg-white/10 lg:w-[230px]"
              >
                See Detail
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="max-w-[1160px] mx-auto px-4">
          <h2 className="font-poppins font-bold text-[36px] leading-[48px] tracking-[-0.02em] text-[#FDFDFD]">
            Trending Now
          </h2>

          <div className="relative overflow-visible">
            <div className="relative">
              <div
                ref={trendingRef}
                onScroll={updateTrendingArrows}
                className="mt-10 overflow-x-auto pb-6 pt-3 scroll-smooth snap-x snap-mandatory hidden xl:block no-scrollbar"
                style={{
                  width: 'calc(1160px + 280px)',
                  marginLeft: '-140px',
                  paddingLeft: '140px',
                  paddingRight: '140px',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  scrollPaddingLeft: '140px',
                  scrollPaddingRight: '140px',
                  scrollSnapType: 'x mandatory',
                }}
              >
                <div className="inline-grid grid-flow-col auto-cols-[216px] gap-5">
                  {trendingMovies.map((movie: MovieSummary, index) => (
                    <div key={movie.id} className="snap-start" style={{ scrollSnapAlign: 'start' }}>
                      <MovieCard
                        id={movie.id}
                        title={movie.title}
                        posterPath={movie.poster_path}
                        rating={movie.vote_average}
                        rank={index + 1}
                        overview={movie.overview}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`pointer-events-none absolute inset-y-0 left-[-140px] w-[140px] bg-gradient-to-r from-black to-transparent transition-opacity duration-300 ${
                  showLeftArrow ? 'opacity-100' : 'opacity-0'
                } hidden xl:block`}
              />
              <div
                className={`pointer-events-none absolute inset-y-0 right-[-220px] w-[140px] bg-gradient-to-l from-black to-transparent transition-opacity duration-300 ${
                  showRightArrow ? 'opacity-100' : 'opacity-0'
                } hidden xl:block`}
              />

              <div className="xl:hidden">
                <div className="mt-10 relative mx-auto max-w-[520px]">
                  <div className="relative">
                    <div className="grid grid-cols-2 gap-6">
                      {trendingMovies
                        .slice(trendingMobilePageIndex * 2, (trendingMobilePageIndex + 1) * 2)
                        .map((movie: MovieSummary, index) => (
                          <MovieCard
                            key={movie.id}
                            id={movie.id}
                            title={movie.title}
                            posterPath={movie.poster_path}
                            rating={movie.vote_average}
                            rank={trendingMobilePageIndex * 2 + index + 1}
                            overview={movie.overview}
                            size="compact"
                          />
                        ))}
                    </div>

                    {trendingMobilePageIndex > 0 && (
                      <button
                        type="button"
                        onClick={() => setTrendingMobilePageIndex((prev) => prev - 1)}
                        className="absolute left-3 top-[40%] z-20 inline-flex h-[44px] w-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-[#0A0D12]/80 text-white shadow-lg transition hover:bg-[#0A0D12]/90"
                      >
                        <ChevronLeft size={22} />
                      </button>
                    )}
                    {(trendingMobilePageIndex + 1) * 2 < trendingMovies.length && (
                      <button
                        type="button"
                        onClick={() => setTrendingMobilePageIndex((prev) => prev + 1)}
                        className="absolute right-3 top-[40%] z-20 inline-flex h-[44px] w-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-[#0A0D12]/80 text-white shadow-lg transition hover:bg-[#0A0D12]/90"
                      >
                        <ChevronRight size={22} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {showLeftArrow && (
              <button
                type="button"
                onClick={() => trendingRef.current?.scrollBy({ left: -1160, behavior: 'smooth' })}
                className="absolute left-[-70px] top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#0A0D12]/60 text-white shadow-lg transition hover:bg-[#0A0D12]/80 hidden xl:inline-flex"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {showRightArrow && (
              <button
                type="button"
                onClick={() => trendingRef.current?.scrollBy({ left: 1160, behavior: 'smooth' })}
                className="absolute right-[-130px] top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#0A0D12]/60 text-white shadow-lg transition hover:bg-[#0A0D12]/80 hidden xl:inline-flex"
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="max-w-[1160px] mx-auto px-4">
          <h2 className="font-poppins font-bold text-[36px] leading-[48px] tracking-[-0.02em] text-[#FDFDFD]">
            New Release
          </h2>

          <div className="relative">
            <div className="hidden xl:block w-full xl:w-[calc(1160px+280px)] xl:-ml-[140px] xl:px-[140px]">
              <div className="grid gap-5 mt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 justify-start">
                {displayedNewReleases.map((movie: MovieSummary) => (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    posterPath={movie.poster_path}
                    rating={movie.vote_average}
                    overview={movie.overview}
                  />
                ))}

                {Array.from({ length: newReleasePlaceholders }).map((_, i) => (
                  <div
                    key={`ph-${i}`}
                    className="h-[397px] w-[216px] rounded-[28px] bg-transparent"
                  />
                ))}
              </div>
            </div>

            <div className="xl:hidden">
              <div className="mt-10 relative mx-auto grid max-w-[520px] grid-cols-2 gap-6">
                {displayedNewReleasesMobile.map((movie: MovieSummary) => (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    posterPath={movie.poster_path}
                    rating={movie.vote_average}
                    overview={movie.overview}
                    size="compact"
                  />
                ))}
              </div>
            </div>

            <div
              className="hidden xl:block pointer-events-none absolute bottom-0 left-0 right-0 xl:left-[-140px] xl:right-[-140px] bg-gradient-to-t from-black to-transparent transition-[height,opacity] duration-500 ease-out z-10"
              style={{
                height: `${newReleaseFadeHeight}px`,
                opacity: remainingNewReleases > 0 ? 1 : 0,
              }}
            />

            {remainingNewReleasesMobile > 0 && (
              <div className="xl:hidden pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
            )}

            {remainingNewReleasesMobile > 0 && (
              <div className="xl:hidden mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setMobileVisibleReleaseCount(newReleaseMovies.length)}
                  className="relative z-20 inline-flex h-[52px] w-[230px] items-center justify-center rounded-full border border-[#181D27] bg-[#0E0C0F]/60 text-[16px] font-semibold leading-[30px] text-[#FDFDFD] shadow-soft backdrop-blur-[20px] transition hover:bg-white/10"
                >
                  Load more
                </button>
              </div>
            )}

            {visibleReleaseCount < newReleaseMovies.length && (
              <div className="absolute inset-x-0 bottom-6 hidden xl:flex justify-center z-20">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleReleaseCount((prev) => Math.min(prev + 30, newReleaseMovies.length))
                  }
                  className="inline-flex h-[52px] w-[230px] items-center justify-center rounded-full border border-[#181D27] bg-[#0E0C0F]/60 text-[16px] font-semibold leading-[30px] text-[#FDFDFD] shadow-soft backdrop-blur-[20px] transition hover:bg-white/10"
                >
                  Load more
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

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
