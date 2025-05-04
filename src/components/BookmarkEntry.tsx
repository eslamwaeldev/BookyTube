import { Bookmark } from "../schema";

const BookmarkEntry = ({ id, desc, time, videoURl }: Bookmark) => {
  return (
    <div className="w-full rounded-full border-2 border-red-500 min-h-6 flex items-center justify-between p-2">
      <h1 className="font-medium text-sm">{desc}</h1>
      <div className="grid grid-cols-3 gap-1">
        <button className="rounded-full">
          <img
            width={24}
            height={24}
            src="/images/play.svg"
            alt="Play Button"
            className="grayscale-100 hover:grayscale-0 cursor-pointer transition-all duration-300"
          />
        </button>
        <button className="rounded-full">
          <img
            width={24}
            height={24}
            src="/images/share.svg"
            alt="Share Button"
            className="grayscale-100 hover:grayscale-0 cursor-pointer transition-all duration-300"
          />
        </button>
        <button className="rounded-full">
          <img
            width={28}
            height={28}
            src="/images/delete.svg"
            alt="Delete Button"
            className="grayscale-100 hover:grayscale-0 cursor-pointer transition-all duration-300"
          />
        </button>
      </div>
    </div>
  );
};

export default BookmarkEntry;
