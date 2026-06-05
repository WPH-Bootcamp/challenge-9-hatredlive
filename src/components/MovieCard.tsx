import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import StarRatingIcon from '../assets/Design System/Components & Variants/Star Rating.png';

type Props = {
  id: number;
  title?: string;
  posterPath?: string | null;
  releaseDate?: string;
  rating?: number;
  rank?: number;
  overview?: string;
  wrapperClassName?: string;
  size?: 'default' | 'compact';
};

const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

export default function MovieCard({
  id,
  title,
  posterPath,
  rating,
  rank,
  overview,
  wrapperClassName,
  size = 'default',
}: Props) {
  const image = posterPath ? `${IMAGE_BASE}/w300${posterPath}` : '/placeholder.png';
  const isCompact = size === 'compact';

  return (
    <div
      className={`group relative flex flex-col gap-[12px] overflow-hidden rounded-[28px] bg-black shadow-soft transition hover:-translate-y-1 hover:shadow-2xl ${isCompact ? 'h-[420px] w-[240px]' : 'h-[397px] w-[216px]'} ${wrapperClassName ?? ''}`}
    >
      <Link to={`/movie/${id}`} className="flex h-full flex-col">
        <div className="relative overflow-hidden rounded-[12px] bg-black">
          {rank !== undefined ? (
            <span className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#0A0D12]/60 text-sm font-semibold text-white">
              {rank}
            </span>
          ) : null}
          {posterPath ? (
            <img
              src={image}
              alt={title ?? 'Movie poster'}
              className={`${isCompact ? 'h-[340px]' : 'h-[321px]'} w-full object-cover transition duration-500 group-hover:scale-105`}
            />
          ) : (
            <div
              className={`${isCompact ? 'h-[340px]' : 'h-[321px]'} flex items-center justify-center bg-slate-800 text-sm text-slate-400`}
            >
              No image available
            </div>
          )}
        </div>

        <div
          className={`${isCompact ? 'flex h-[75px]' : 'flex h-[76px]'} w-full flex-col gap-[4px] px-4`}
        >
          <h3 className="h-[40px] overflow-hidden font-poppins text-[18px] font-semibold leading-[32px] text-[#FDFDFD]">
            {title}
          </h3>
          {rating !== undefined ? (
            <div className="flex h-[30px] items-center gap-1">
              <img src={StarRatingIcon} alt="Rating star" className="h-[20px] w-[20px]" />
              <span className="flex-1 h-[30px] text-[16px] font-normal leading-[30px] text-[#A4A7AE]">
                {rating.toFixed(1)}/10
              </span>
            </div>
          ) : null}
        </div>
      </Link>

      <FavoriteButton
        movie={{
          id,
          title: title || 'Untitled Movie',
          poster_path: posterPath,
          vote_average: rating,
          overview,
        }}
        wrapperClassName="absolute right-4 top-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        buttonClassName="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white transition hover:bg-white/10"
        iconClassName="h-5 w-5"
      />
    </div>
  );
}
