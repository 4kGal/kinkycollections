import React, { createContext, useState, useEffect } from 'react'
import { useAsync } from '../hooks/useAsync'
import { getGalleryInitialSettings } from '../services/videos'
import { useLocation } from 'react-router-dom'
import { MAINSTREAM_BB_URL } from '../utils/constants'

export const GallerySettingsContext = createContext({
  availableDecades: [],
  availableActresses: [],
  minDecade: 1934
})
export const GallerySettingsProvider = ({ children }) => {
  const location = useLocation()

  const collection = location.pathname.toLowerCase().replace('/', '')

  const {
    // loading,
    // error,
    value: settings
  } =
    location.pathname === MAINSTREAM_BB_URL &&
    useAsync(() => getGalleryInitialSettings(collection), [collection])

  return (
    <GallerySettingsContext.Provider
      value={{
        availableActresses: settings?.listOfActresses,
        availableDecades: settings?.decades,
        minDecade: settings?.lowestYear
      }}
    >
      {children}
    </GallerySettingsContext.Provider>
  )
}
