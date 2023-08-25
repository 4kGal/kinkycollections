import React, { createContext, useState, useEffect } from 'react'
import { useAsync } from '../hooks/useAsync'
import { getGallery, getGalleryInitialSettings } from '../services/videos'
import { useLocation } from 'react-router-dom'
import { MAINSTREAM_BB_URL } from '../utils/constants'
import { useSearchWithin } from '../hooks/useSeachWithin'

export const GallerySettingsContext = createContext()

export const GallerySettingsProvider = ({ children }) => {
  const location = useLocation()
  const collection = location.pathname.toLowerCase().replace('/', '')

  let settings = {}

  if (collection === MAINSTREAM_BB_URL) {
    const {
      // loading,
      // error,
      value
    } = useAsync(() => getGalleryInitialSettings(collection), [collection])
    settings = value
  }

  // const { filter } = useSearchWithin()

  const [state, setState] = useState({
    sortBy: 'recent',
    yearAsc: true,
    addedAsc: true,
    selectedActresses: [],
    selectedDecades: [],
    numOfVidsPerPage: 9
  })

  // // useEffect(() => {
  // //   console.log('inside', collection)
  // //   if (collection === MAINSTREAM_BB_URL) {
  // //     console.log('getting gallery')
  // //     const { decadesFilter, selectedActresses, sortBy } = state

  // //     const searchParamObj = {
  // //       ...(decadesFilter?.length > 0 && { decades: decadesFilter }),
  // //       ...(selectedActresses?.length > 0 && {
  // //         actresses: selectedActresses
  // //       })
  // //       // ...(selectedTags?.length > 0 && { tags: selectedTags }),
  // //       // ...(hideUnderage === true && { underage: 'false' }),
  // //       // eitherOr: combineFilters ? 'and' : 'or'
  // //     }
  // //     const paramKeys = Object.keys(searchParamObj)
  // //     let queryStr = ''
  // //     paramKeys.forEach((param) => {
  // //       queryStr += `&${param}=${searchParamObj[param]
  // //         .toString()
  // //         .replace(/,\s*$/, '')}`
  // //     })
  // //     queryStr += `&sort=${sortBy}`

  // //     const { value: gallery } = useAsync(() =>
  // //       getGallery(collection, queryStr)
  // //     )
  // //     setGallery(gallery)
  // //     console.log(gallery)
  // //   }

  // //   // filter(
  // //   //   collection,
  // //   //   {
  // //   //     ...(decadesFilter?.length > 0 && { decades: decadesFilter }),
  // //   //     ...(selectedActresses?.length > 0 && {
  // //   //       actresses: selectedActresses
  // //   //     })
  // //   //     // ...(selectedTags?.length > 0 && { tags: selectedTags }),
  // //   //     // ...(hideUnderage === true && { underage: 'false' }),
  // //   //     // eitherOr: combineFilters ? 'and' : 'or'
  // //   //   },
  // //   //   sortBy
  // //   // )
  // // }, [state])

  const handleSetSortBy = (newSortBy) => {
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

    // return (
    //   <GallerySettingsContext.Provider
    //     value={{
    //       availableActresses: settings?.listOfActresses ?? [],
    //       availableDecades: settings?.decades ?? [],
    //       minDecade: settings?.lowestYear,

    //       ...state
    //     }}
    //   >
    //     {children}
    //   </GallerySettingsContext.Provider>
  )
}
