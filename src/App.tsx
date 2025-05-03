import usePageControls from "./hooks/usePageControls";
import NotAYoutubePage from "./pages/NotAYoutubePage";
import YoutubeHomePage from "./pages/YoutubeHomePage";
import YoutubeVideoPage from "./pages/YoutubeVideoPage";
import "./index.css";

function App() {
  const { currentVideoId, youtubePage, youtubeVideoEmbedded } = usePageControls();

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-booky-blue text-gray-900 dark:text-gray-50">
      {youtubePage ? (
        currentVideoId ? (
          <YoutubeVideoPage currentVideoId={currentVideoId} />
        ) : (
          <YoutubeHomePage />
        )
      ) : youtubeVideoEmbedded ? (
        <YoutubeVideoPage currentVideoId={currentVideoId} />
      ) : (
        <NotAYoutubePage />
      )}
    </div>
  );
}

export default App;
