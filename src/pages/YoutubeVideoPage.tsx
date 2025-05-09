import VideoBookmarks from "../components/VideoBookmarks";
import useVideoBookmarks from "../hooks/useVideoBookmarks";

export interface Props {
  currentVideoId: string;
}

const YoutubeVideoPage = ({ currentVideoId }: Props) => {
  const { isLoading, videoBookmarks } = useVideoBookmarks(currentVideoId);

  return videoBookmarks.length > 0 ? (
    isLoading ? (
      <div className="flex flex-col justify-center items-center text-center h-full w-full p-4">
        <h2 className="text-xl font-bold text-black drop-shadow-header">Loading video Bookmarks</h2>
      </div>
    ) : (
      <VideoBookmarks bookmarks={videoBookmarks} />
    )
  ) : (
    <div className="flex flex-col justify-center items-center text-center h-full w-full p-4">
      <h2 className="text-xl font-bold text-black drop-shadow-header">
        There are no bookmarks added for this video
      </h2>
    </div>
  );
};

export default YoutubeVideoPage;
