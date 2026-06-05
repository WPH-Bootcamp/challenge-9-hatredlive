import './index.css';
import { BrowserRouter, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import LogoSmall from './assets/Design System/Components & Variants/Logo/Size=Small.png';
import CloseIcon from './assets/Design System/Components & Variants/Icon/Close.png';
import ArrowIcon from './assets/Design System/Components & Variants/Icon/Arrow.png';
import SearchEmptyIllustration from './assets/Design System/Components & Variants/Movie Vector Search Empty.png';
import PlayIcon from './assets/Design System/Components & Variants/Icon/Play.png';
import StarFillIcon from './assets/Design System/Components & Variants/Icon/Rating.png';
import { Search as SearchIcon, Menu as MenuIcon } from 'lucide-react';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Favorites from './pages/Favorites';
import Search from './pages/Search';
import FavoriteButton from './components/FavoriteButton';
import { PageLoadingProvider, usePageLoading } from './contexts/PageLoadingContext';
import { useQuery } from '@tanstack/react-query';
import {
  searchMovies,
  getMovieDetail,
  type MovieListResponse,
  type MovieSummary,
  type MovieDetailResponse,
} from './services/movieService';

const queryClient = new QueryClient();

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<'enter' | 'exit' | 'idle'>('idle');
  const { isReady, setReady } = usePageLoading();
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const currentRoute = `${location.pathname}${location.search}`;
    const activeRoute = `${displayLocation.pathname}${displayLocation.search}`;

    if (currentRoute !== activeRoute) {
      const stateTimer = window.setTimeout(() => {
        setReady(false);
        setTransitionStage('enter');
      }, 0);

      const timer = window.setTimeout(() => {
        setDisplayLocation(location);
      }, 400);

      return () => {
        clearTimeout(stateTimer);
        clearTimeout(timer);
      };
    }
  }, [location, displayLocation, setReady]);

  // When the new page is ready, fade out the overlay
  useEffect(() => {
    if (transitionStage === 'enter' && isReady && location.key === displayLocation.key) {
      const exitTimer = setTimeout(() => {
        setTransitionStage('exit');
      }, 0);
      const idleTimer = setTimeout(() => {
        setTransitionStage('idle');
      }, 400);
      return () => {
        clearTimeout(exitTimer);
        clearTimeout(idleTimer);
      };
    }
  }, [transitionStage, isReady, location.key, displayLocation.key]);

  return (
    <>
      <Routes location={displayLocation}>{children}</Routes>
      {transitionStage !== 'idle' && (
        <div
          className={`fixed inset-0 z-50 bg-black pointer-events-none ${
            transitionStage === 'enter' ? 'page-transition-enter' : 'page-transition-exit'
          }`}
        />
      )}
    </>
  );
}

function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerMovieId, setTrailerMovieId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState(
    () => new URLSearchParams(location.search).get('q') ?? ''
  );
  const navigate = useNavigate();

  const mobileSearchQuery = useQuery<MovieListResponse>({
    queryKey: ['mobile-search', searchValue],
    queryFn: () => searchMovies(searchValue),
    enabled: mobileSearchOpen && searchValue.trim().length > 0,
    staleTime: 0,
  });

  const trailerQuery = useQuery<MovieDetailResponse>({
    queryKey: ['mobile-trailer', trailerMovieId],
    queryFn: () => getMovieDetail(trailerMovieId!),
    enabled: showTrailer && !!trailerMovieId,
  });

  const mobileSearchResults = mobileSearchQuery.data?.results || [];
  const mobileSearchLoading = mobileSearchQuery.isFetching && searchValue.trim().length > 0;
  const mobileSearchEmpty =
    searchValue.trim().length > 0 &&
    !mobileSearchLoading &&
    !mobileSearchQuery.isError &&
    mobileSearchResults.length === 0;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchValue.trim();
    if (!trimmed) return;
    setMobileSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleWatchTrailer = (movieId: number) => {
    setTrailerMovieId(movieId);
    setShowTrailer(true);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-300 ${
          mobileSearchOpen ? 'hidden lg:block' : ''
        } ${scrolled ? 'bg-[#0A0D12]/60 backdrop-blur-xl py-4' : 'bg-transparent py-6'}`}
      >
        <div className="max-w-[1160px] mx-auto flex items-center gap-4 px-4">
          <div className="flex items-center gap-[56px]">
            <img src={LogoSmall} alt="Movie logo" className="h-10 w-auto" />

            <nav className="hidden lg:flex items-center gap-[56px]">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-[16px] leading-[30px] font-normal transition ${isActive ? 'text-white' : 'text-white/70 hover:text-white'}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  `text-[16px] leading-[30px] font-normal transition ${isActive ? 'text-white' : 'text-white/70 hover:text-white'}`
                }
              >
                Favorites
              </NavLink>
            </nav>
          </div>

          <form onSubmit={handleSearchSubmit} className="hidden lg:block ml-auto">
            <div className="flex items-center gap-3 rounded-[16px] bg-[#0A0D12]/60 px-4 h-[56px] w-[243px] border border-[#252B37] backdrop-blur-xl">
              <SearchIcon className="h-6 w-6 text-slate-300" />
              <input
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search Movie"
                className="flex-1 bg-transparent text-white text-[16px] leading-[30px] font-normal placeholder:text-[#717680] outline-none"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-3 lg:hidden">
            {!mobileMenuOpen && !mobileSearchOpen ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setMobileSearchOpen((current) => !current);
                  }}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-transparent text-white transition hover:bg-white/10"
                  aria-label="Open search"
                >
                  <SearchIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileSearchOpen(false);
                    setMobileMenuOpen((current) => !current);
                  }}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-transparent text-white transition hover:bg-white/10"
                  aria-label="Open menu"
                >
                  <MenuIcon className="h-5 w-5" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setMobileSearchOpen(false);
                }}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-transparent text-white transition hover:bg-white/10"
                aria-label="Close"
              >
                <img src={CloseIcon} alt="Close" className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </header>

      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black lg:hidden overflow-y-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-none bg-transparent text-white transition hover:bg-white/10"
              aria-label="Back"
            >
              <img src={ArrowIcon} alt="Back" className="h-6 w-6" />
            </button>
            <div className="relative flex-1 rounded-[16px] border border-[#252B37] bg-[#0A0D12]/95 px-4 py-3">
              <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search Movie"
                className="w-full bg-transparent pl-12 text-white text-[16px] leading-[30px] font-normal placeholder:text-[#717680] outline-none"
              />
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {mobileSearchLoading && (
              <div className="space-y-4">
                <div className="h-44 rounded-[32px] bg-[#11131a] animate-pulse" />
                <div className="h-44 rounded-[32px] bg-[#11131a] animate-pulse" />
              </div>
            )}

            {mobileSearchEmpty && (
              <div className="flex items-center justify-center min-h-[calc(100vh-300px)]">
                <div className="mx-auto flex w-full max-w-[320px] flex-col items-center justify-center gap-6 rounded-[32px] bg-[#090b10] px-6 py-8 shadow-soft">
                  <img
                    src={SearchEmptyIllustration}
                    alt="Search empty illustration"
                    className="h-[200px] w-[200px] object-contain"
                  />
                  <div className="flex w-[246px] flex-col items-center gap-2 text-center">
                    <p className="text-[16px] font-semibold leading-[30px] text-white">
                      Data Not Found
                    </p>
                    <p className="text-[14px] leading-[28px] text-[#A4A7AE]">Try other keywords</p>
                  </div>
                </div>
              </div>
            )}

            {searchValue.trim() && !mobileSearchLoading && mobileSearchResults.length > 0 && (
              <div className="space-y-6">
                {mobileSearchResults.map((movie: MovieSummary) => (
                  <div
                    key={movie.id}
                    className="group relative overflow-hidden rounded-[32px] bg-[#080a0f] p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={
                          movie.poster_path
                            ? `${import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'}/w300${movie.poster_path}`
                            : '/placeholder.png'
                        }
                        alt={movie.title}
                        className="h-[140px] w-[98px] flex-shrink-0 rounded-[12px] object-cover"
                      />
                      <div className="min-w-0 flex-1 flex flex-col gap-3">
                        <div>
                          <h3 className="text-[18px] font-semibold leading-[28px] text-white">
                            {movie.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-2 text-[16px] font-semibold text-white">
                            <img src={StarFillIcon} alt="Rating" className="h-5 w-5" />
                            <span>{movie.vote_average?.toFixed(1) ?? '—'}/10</span>
                          </div>
                        </div>
                        <p className="text-[14px] leading-[24px] text-[#A4A7AE] line-clamp-2">
                          {movie.overview || 'No description available.'}
                        </p>

                        <div className="mt-6 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWatchTrailer(movie.id);
                            }}
                            className="flex-1 inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-[#961200] px-4 text-[16px] font-semibold leading-[30px] text-white shadow-lg shadow-[#961200]/20 transition hover:bg-[#7a0f00]"
                          >
                            <span className="text-center">Watch Trailer</span>
                            <img src={PlayIcon} alt="Play" className="h-5 w-5" />
                          </button>
                          <FavoriteButton
                            movie={movie}
                            wrapperClassName="flex-shrink-0"
                            buttonClassName="inline-flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[rgba(10,13,18,0.6)] border border-white/10 transition hover:bg-white/10"
                            iconClassName="h-6 w-6"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black lg:hidden overflow-y-auto pt-24">
          <nav className="space-y-5 px-6 py-6">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block h-[30px] w-full max-w-[200px] pl-1 text-left text-[16px] font-poppins font-normal leading-[30px] transition ${isActive ? 'text-white' : 'text-white/70 hover:text-white'}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block h-[30px] w-full max-w-[200px] pl-1 text-left text-[16px] font-poppins font-normal leading-[30px] transition ${isActive ? 'text-white' : 'text-white/70 hover:text-white'}`
              }
            >
              Favorites
            </NavLink>
          </nav>
        </div>
      )}

      {showTrailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8 lg:hidden">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-[32px] bg-slate-950 shadow-soft">
            <button
              type="button"
              onClick={() => setShowTrailer(false)}
              className="absolute right-4 top-4 rounded-full bg-black/70 p-3 text-white transition hover:bg-white/10 z-10"
            >
              ✕
            </button>
            <div className="min-h-[320px] bg-black">
              {trailerQuery.isLoading ? (
                <div className="flex h-80 items-center justify-center text-sm text-slate-300">
                  Loading trailer...
                </div>
              ) : trailerQuery.data?.videos?.results?.length ? (
                (() => {
                  const results = trailerQuery.data.videos.results;
                  const trailer = results.find(
                    (video) => video.site === 'YouTube' && video.type === 'Trailer'
                  );
                  const video = trailer || results[0];
                  return video?.key ? (
                    <iframe
                      title="Movie trailer"
                      src={`https://www.youtube.com/embed/${video.key}?autoplay=1&rel=0`}
                      className="h-[450px] w-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex h-80 items-center justify-center text-sm text-slate-300">
                      No trailer available
                    </div>
                  );
                })()
              ) : (
                <div className="flex h-80 items-center justify-center text-sm text-slate-300">
                  No trailer available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <PageLoadingProvider>
          <div className="min-h-screen bg-background text-white">
            <Header />

            <main className="max-w-[1160px] mx-auto px-4 pb-10 xl:pb-8">
              <PageTransition>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/favorites" element={<Favorites />} />
              </PageTransition>
            </main>

            <footer className="border-t border-white/10 bg-[#05070d]/80">
              <div className="max-w-[1160px] mx-auto flex items-center justify-between px-4 py-8">
                <img src={LogoSmall} alt="Movie logo" className="h-10 w-auto" />
                <p className="text-sm text-slate-500">Copyright ©2025 Movie Explorer</p>
              </div>
            </footer>
          </div>
        </PageLoadingProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
