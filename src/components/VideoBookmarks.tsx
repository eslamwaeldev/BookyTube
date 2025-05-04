import { Bookmark } from "../schema";
import BookmarkEntry from "./BookmarkEntry";

export interface Props {
  bookmarks: Bookmark[];
}

const VideoBookmarks = ({ bookmarks }: Props) => {
  return (
    <div className="flex flex-col items-center p-2 w-full h-full text-black">
      <h2 className="text-xl w-full text-center font-semibold header-text-shadow">
        Your Bookmarks for this video
      </h2>
      <div className="grid grid-cols-1 gap-y-0.2 p-3 w-full">
        {bookmarks.map(({ desc, id, time, videoURl }, index) => {
          return <BookmarkEntry key={index} time={time} desc={desc} id={id} videoURl={videoURl} />;
        })}
      </div>
    </div>
  );
};

export default VideoBookmarks;
