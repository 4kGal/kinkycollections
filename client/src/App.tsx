import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Gallery from './Gallery/Gallery'
import Player from './Player'
import ChangeLogFutureUpdates from './ChangeLogFutureUpdates/ChangeLogFutureUpdates'
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
  AMATEUR_CB_COLLECTION,
  AMATEUR_CB_URL,
  CHANGE_LOG_FUTURE_UPDATES_URL,
  FAVORITES_URL,
  MAINSTREAM_BB_COLLECTION,
  MAINSTREAM_BB_URL,
  MAINSTREAM_CB_COLLECTION,
  MAINSTREAM_CB_URL,
  MAINSTREAM_MISC_COLLECTION,
  MAINSTREAM_MISC_URL,
  MAINSTREAM_PE_COLLECTION,
  MAINSTREAM_PE_URL,
  PORN_BALLS_COLLECTION,
  PORN_BALLS_URL,
  REACTIONS_COLLECTION,
  REACTIONS_URL,
  SEARCH_RESULTS_URL
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
              path={AMATEUR_CB_URL}
              element={<Gallery collection={AMATEUR_CB_COLLECTION} />}
            />
            <Route
              path={MAINSTREAM_PE_URL}
              element={<Gallery collection={MAINSTREAM_PE_COLLECTION} />}
            />
            <Route
              path={MAINSTREAM_MISC_URL}
              element={<Gallery collection={MAINSTREAM_MISC_COLLECTION} />}
            />
            <Route
              path={PORN_BALLS_URL}
              element={<Gallery collection={PORN_BALLS_COLLECTION} />}
            />
            <Route
              path={REACTIONS_URL}
              element={<Gallery collection={REACTIONS_COLLECTION} />}
            />
            <Route
              path="/player/:collection/:id"
              element={
                <PlayerProvider>
                  <Player />
                </PlayerProvider>
              }
            />
            <Route path={FAVORITES_URL} element={<Favorites />} />
            <Route path={SEARCH_RESULTS_URL} element={<SearchResults />} />
            <Route
              path={CHANGE_LOG_FUTURE_UPDATES_URL}
              element={<ChangeLogFutureUpdates />}
            />
          </Routes>
        </Layout>
      </GalleryProvider>
    </Router>
  )
}

export default App
