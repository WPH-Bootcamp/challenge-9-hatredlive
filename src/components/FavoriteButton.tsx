import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import useFavorites from '../store/useFavorites';
import type { MovieSummary } from '../services/movieService';

const HeartIconUrl = new URL(
  '../assets/Design System/Components & Variants/Icon/Heart.png',
  import.meta.url
).href;
const HeartFillIconUrl = new URL(
  '../assets/Design System/Components & Variants/Icon/HeartFill.png',
  import.meta.url
).href;

type FavoriteButtonProps = {
  movie: MovieSummary;
  wrapperClassName?: string;
  buttonClassName?: string;
  iconClassName?: string;
  onUnfavorite?: (movie: MovieSummary) => void;
};

export default function FavoriteButton({
  movie,
  wrapperClassName = '',
  buttonClassName = '',
  iconClassName = '',
  onUnfavorite,
}: FavoriteButtonProps) {
  const favorites = useFavorites((state) => state.favorites);
  const toggle = useFavorites((state) => state.toggle);
  const isFav = Boolean(favorites[movie.id]);

  const [showHeartParticles, setShowHeartParticles] = useState(false);
  const [showBrokenHeart, setShowBrokenHeart] = useState(false);
  const [portalPos, setPortalPos] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const willAdd = !isFav;
    const target = event.currentTarget;
    const r = target.getBoundingClientRect();
    setPortalPos({
      left: r.left + r.width / 2,
      top: r.top + r.height / 2,
      width: r.width,
      height: r.height,
    });

    if (willAdd) {
      toggle(movie);
      setShowBrokenHeart(false);
      setShowHeartParticles(true);
    } else {
      setShowHeartParticles(false);
      setShowBrokenHeart(true);
      if (onUnfavorite) {
        onUnfavorite(movie);
      } else {
        toggle(movie);
      }
    }
  };

  useEffect(() => {
    if (!showHeartParticles) return;
    const timeout = window.setTimeout(() => {
      setShowHeartParticles(false);
      setPortalPos(null);
    }, 900);
    return () => window.clearTimeout(timeout);
  }, [showHeartParticles]);

  useEffect(() => {
    if (!showBrokenHeart) return;
    const timeout = window.setTimeout(() => {
      setShowBrokenHeart(false);
      setPortalPos(null);
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [showBrokenHeart]);

  return (
    <div className={`${wrapperClassName || 'relative'}`}>
      <button
        ref={btnRef}
        type="button"
        onClick={handleClick}
        aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
        className={buttonClassName}
      >
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white transition hover:bg-white/10">
          <img
            src={isFav ? HeartFillIconUrl : HeartIconUrl}
            alt={isFav ? 'Favorited' : 'Favorite'}
            className={`h-5 w-5 ${iconClassName}`}
          />
        </span>
      </button>

      {portalPos &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              left: portalPos.left,
              top: portalPos.top,
              width: portalPos.width,
              height: portalPos.height,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 2147483647,
            }}
          >
            {showHeartParticles && (
              <div>
                {[0, 1, 2, 3, 4].map((index) => (
                  <img
                    key={index}
                    src={HeartFillIconUrl}
                    alt=""
                    className={`heart-particle heart-particle-${index}`}
                  />
                ))}
              </div>
            )}

            {showBrokenHeart && (
              <div>
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
          </div>,
          document.body
        )}
    </div>
  );
}
