import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
// import MainstreamBB from './Mainstream/MainstreamBB'
import Gallery from './Gallery/Gallery'
import Player from './Player'
import './App.css'
import Layout from './Layout'
import Home from './Home/Home'
import AuthenticationPage from './AuthenticatePages/AuthenticationPage'
import Favorites from './Favorites/Favorites'
import SearchResults from './SearchResults/SearchResults'
import { CommentProvider } from './context/CommentContext'
import { GallerySettingsProvider } from './context/GallerySettingsContext'
const App = () => {
  return (
    <Router>
      <GallerySettingsProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<AuthenticationPage />} />
            <Route path="/" element={<Home />} />
            <Route
              path="/mainstreambb"
              element={<Gallery collection="mainstreambb" />}
            />
            <Route
              path="/amateurbb"
              element={<Gallery collection="amateurbb" />}
            />
            <Route
              path="/player/:collection/:id"
              element={
                <CommentProvider>
                  <Player />
                </CommentProvider>
              }
            />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/searchResults" element={<SearchResults />} />
          </Routes>
        </Layout>
      </GallerySettingsProvider>
    </Router>
  )
}

export default App
