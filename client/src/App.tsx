import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
// import mainstreambb from './Mainstream/mainstreambb'
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
import { AuthContextProvider } from './context/AuthContext'
const App = () => {
  return (
    <Router>
      <AuthContextProvider>
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
      </AuthContextProvider>
    </Router>
  )
}

export default App
