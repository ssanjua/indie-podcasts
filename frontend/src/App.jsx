import { ThemeProvider } from "styled-components"
import { useState, useEffect } from "react"
import { darkTheme, lightTheme } from './utils/themes.js'
import Signup from '../src/components/Signup.jsx'
import Signin from '../src/components/Signin.jsx'
import Navbar from '../src/components/Navbar.jsx'
import Menu from '../src/components/Menu.jsx'
import Dashboard from '../src/pages/Dashboard.jsx'
import ToastMessage from './components/ToastMessage.jsx'
import Search from '../src/pages/Search.jsx'
import Favourites from '../src/pages/Favourites.jsx'
import Profile from '../src/pages/Profile.jsx'
import Upload from '../src/components/Upload.jsx'
import DisplayPodcasts from '../src/pages/DisplayPodcasts.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import styled from 'styled-components'
import AudioPlayer from "./components/AudioPlayer.jsx"
import VideoPlayer from "./components/VideoPlayer.jsx"
import PodcastDetails from "./pages/PodcastDetails.jsx"
import { closeSignin } from "./redux/setSigninSlice.jsx"
import AddEpisode from "./components/AddEpisode.jsx"

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
`;

const Podcasts = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
  background: ${({ theme }) => theme.bgLight};
  overflow-y: hidden;
  overflow-x: hidden;
`;

function App() {

  const [darkMode, setDarkMode] = useState(true)
  const { open, message, severity } = useSelector((state) => state.snackbar)
  const { openplayer, type, episode, podid, currenttime, index } = useSelector((state) => state.audioplayer)
  const { opensi } = useSelector((state) => state.signin)
  const [SignUpOpen, setSignUpOpen] = useState(false)
  const [setSignInOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(true)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [addEpisodeOpen, setAddEpisodeOpen] = useState(false);
  const [selectedPodcastId, setSelectedPodcastId] = useState(null);

  const dispatch = useDispatch()


  useEffect(() => {
    // Leer el tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 1110) {
        setMenuOpen(false)
      } else {
        setMenuOpen(true)
      }
    }
    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [])

  useEffect(() => {
    dispatch(closeSignin())
  }, [dispatch])

  const defaultEpisode = {
    name: "Bienvenid@",
    creator: { name: "Indie Podcasts", img: "./assets/logo.webp" },
    file: "",
  };

  const defaultPodid = {
    name: "Podcast de ejemplo",
    thumbnail: "./logo.webp",
    episodes: [defaultEpisode],
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <BrowserRouter>
        {opensi && <Signin setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />}
        {SignUpOpen && <Signup setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />}
        {uploadOpen && <Upload setUploadOpen={setUploadOpen} />}
        {addEpisodeOpen && <AddEpisode setAddEpisodeOpen={setAddEpisodeOpen} podcastId={selectedPodcastId} />}
        {openplayer && type === 'video' && <VideoPlayer episode={episode} podid={podid} currenttime={currenttime} index={index} />}

        <Podcasts>
          {menuOpen && <Menu setMenuOpen={setMenuOpen} setUploadOpen={setUploadOpen} setAddEpisodeOpen={setAddEpisodeOpen} />}
          <Frame>
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} darkMode={darkMode} setDarkMode={toggleTheme} />
            <Routes>
              <Route path='/' exact element={<Dashboard setSignInOpen={setSignInOpen} />} />
              <Route path='/search' exact element={<Search />} />
              <Route path='/favourites' exact element={<Favourites />} />
              <Route path='/profile' exact element={<Profile setUploadOpen={setUploadOpen} setAddEpisodeOpen={setAddEpisodeOpen} setSelectedPodcastId={setSelectedPodcastId} />} />
              <Route path='/podcast/:id' exact element={<PodcastDetails setAddEpisodeOpen={setAddEpisodeOpen} setSelectedPodcastId={setSelectedPodcastId} />} />
              <Route path='/showpodcasts/:type' exact element={<DisplayPodcasts />} />
            </Routes>
          </Frame>
          {open && <ToastMessage open={open} message={message} severity={severity} />}
        </Podcasts>
        <AudioPlayer
          episode={episode || defaultEpisode}
          podid={podid || defaultPodid }
          currenttime={currenttime || 0}
          index={index || 0} />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App