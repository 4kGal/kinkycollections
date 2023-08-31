import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Gallery from './Gallery/Gallery'
import Player from './Player'
import './App.css'
import Layout from './Layout'
import Home from './Home/Home'
import AuthenticationPage from './AuthenticatePages/AuthenticationPage'
import Favorites from './Favorites/Favorites'
import SearchResults from './SearchResults/SearchResults'
import { PlayerProvider } from './context/PlayerContext'
import { GalleryProvider } from './context/GalleryContext'
import {
  AMATEUR_BB_COLLECTION,
  AMATEUR_BB_URL,
  MAINSTREAM_BB_COLLECTION,
  MAINSTREAM_BB_URL,
  MAINSTREAM_CB_COLLECTION,
  MAINSTREAM_CB_URL
} from './utils/constants'
const App = () => {
  return (
    <Router>
      <GalleryProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<AuthenticationPage />} />
            <Route path="/" element={<Home />} />
            <Route
              path={MAINSTREAM_BB_URL}
              element={<Gallery collection={MAINSTREAM_BB_COLLECTION} />}
            />
            <Route
              path={AMATEUR_BB_URL}
              element={<Gallery collection={AMATEUR_BB_COLLECTION} />}
            />
            <Route
              path={MAINSTREAM_CB_URL}
              element={<Gallery collection={MAINSTREAM_CB_COLLECTION} />}
            />
            <Route
              path="/player/:collection/:id"
              element={
                <PlayerProvider>
                  <Player />
                </PlayerProvider>
              }
            />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/searchResults" element={<SearchResults />} />
          </Routes>
        </Layout>
      </GalleryProvider>
    </Router>
  )
}

export default App
