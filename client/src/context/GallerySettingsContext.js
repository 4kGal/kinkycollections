import React, { createContext, useState, useEffect } from 'react'
import { useAsync } from '../hooks/useAsync'
import { getGalleryInitialSettings } from '../services/videos'
import { useLocation } from 'react-router-dom'
import { MAINSTREAM_BB_URL } from '../utils/constants'

export const GallerySettingsContext = createContext()

export const GallerySettingsProvider = ({ children }) => {
  const location = useLocation()
  const [state, setState] = useState({
    sortBy: 'recent',
    yearAsc: true,
    addedAsc: true,
    selectedActresses: [],
    selectedDecades: [],
    numOfVidsPerPage: 9
  })

  const collection = location.pathname.toLowerCase().replace('/', '')

  const {
    // loading,
    // error,
    value: settings
  } =
    location.pathname === MAINSTREAM_BB_URL &&
    useAsync(() => getGalleryInitialSettings(collection), [collection])

  useEffect(() => {
    console.log('now sorting by', state.sortBy)
  }, [state.sortBy, state])

  const handleSetSortBy = (newSortBy) => {
    console.log(state.sortBy, newSortBy)
    setState({
      ...state,
      sortBy: newSortBy
    })
  }

  const handleYearAscending = () => {
    setState({
      ...state,
      yearAsc: !state.yearAsc
    })
  }
  const handleAddedAscending = () => {
    setState({
      ...state,
      addedAsc: !state.addedAsc
    })
  }

  const handleRandomize = () => {
    // displayedVideos.sort(() => Math.random() - 0.5)
    console.log('random!')
  }

  const handleActressSelection = (actress) => {
    if (actress === null) {
      setState({
        ...state,
        selectedActresses: []
      })
    } else {
      const index = state.selectedActresses?.indexOf(actress)

      if (index === -1) {
        setState({
          ...state,
          selectedActresses: state.selectedActresses.concat(actress)
        })
      } else {
        setState({
          ...state,
          selectedActresses: state.selectedActresses.filter(
            (current) => current !== actress
          )
        })
      }
    }
  }

  const handleDecadeSelection = (decade) => {
    const exists = state.selectedDecades.includes(decade)

    if (exists) {
      setState({
        ...state,
        selectedDecades: state.selectedDecades.filter((c) => {
          return c !== decade
        })
      })
    } else {
      setState({
        ...state,
        selectedDecades: state.selectedDecades.concat(decade)
      })
    }
  }

  const handleVidsPerPageChange = (perPage) => {
    setState({
      ...state,
      numOfVidsPerPage: perPage
    })
  }

  return (
    <GallerySettingsContext.Provider
      value={{
        availableActresses: settings?.listOfActresses ?? [],
        availableDecades: settings?.decades ?? [],
        minDecade: settings?.lowestYear,
        handleSetSortBy,
        handleYearAscending,
        handleAddedAscending,
        handleRandomize,
        handleActressSelection,
        handleDecadeSelection,
        handleVidsPerPageChange,
        ...state
      }}
    >
      {children}
    </GallerySettingsContext.Provider>
  )
}
