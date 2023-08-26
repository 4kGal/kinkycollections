import React, { createContext, useState, useEffect } from 'react'
import { useAsync } from '../hooks/useAsync'
import { getGallery, getGalleryInitialSettings } from '../services/videos'
import { useLocation } from 'react-router-dom'
import { useAuthContext } from '../hooks'

export const GallerySettingsContext = createContext()

export const GallerySettingsProvider = ({ children }) => {
  const location = useLocation()
  const collection = location.pathname.toLowerCase().replace('/', '')

  const { user } = useAuthContext()
  // const { filter } = useSearchWithin()

  const [gallery, setGallery] = useState([])

  const [state, setState] = useState({
    sortBy: 'recent',
    yearAsc: true,
    addedAsc: true,
    selectedActresses: [],
    selectedDecades: [],
    numOfVidsPerPage: 9,
    selectedTags: []
  })

  // const loadSettings = async (url) => {
  //   console.log(url)
  //   const { listOfActresses, decades, lowestYear } =
  //     await getGalleryInitialSettings(url)
  //   setState({
  //     ...state,
  //     availableActresses: listOfActresses || [],
  //     availableDecades: decades || [],
  //     minDecade: lowestYear
  //   })
  // }

  const { value: settings } = useAsync(
    () => getGalleryInitialSettings(collection),
    [collection]
  )

  // get query string

  const searchParamObj = {
    ...(state.decadesFilter?.length > 0 && {
      decades: state.decadesFilter
    }),
    ...(state.selectedActresses?.length > 0 && {
      actresses: state.selectedActresses
    }),
    ...(state.selectedTags?.length > 0 && { tags: state.selectedTags }),
    hideUnderage: user?.hideUnderage.toString() || 'true',
    eitherOr: state.combineFilters ? 'and' : 'or'
  }
  const paramKeys = Object.keys(searchParamObj)
  let queryStr = ''
  paramKeys.forEach((param) => {
    queryStr += `&${param}=${searchParamObj[param]
      .toString()
      .replace(/,\s*$/, '')}`
  })
  queryStr += `&sort=${state.sortBy}`

  const {
    loading: galleryIsLoading,
    error,
    value: galleryObj
  } = useAsync(
    () => getGallery(collection, queryStr),
    [collection, state, user?.hideUnderage]
  )

  useEffect(() => {
    setGallery(galleryObj?.gallery)
  }, [galleryObj])

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
    setGallery(gallery?.sort(() => Math.random() - 0.5))
  }

  // const handleActressSelection = (actress) => {
  //   if (actress === null) {
  //     setState({
  //       ...state,
  //       selectedActresses: []
  //     })
  //   } else {
  //     const index = state.selectedActresses?.indexOf(actress)
  //     if (index === -1) {
  //       setState({
  //         ...state,
  //         selectedActresses: state.selectedActresses.concat(actress)
  //       })
  //     } else {
  //       setState({
  //         ...state,
  //         selectedActresses: state.selectedActresses.filter(
  //           (current) => current !== actress
  //         )
  //       })
  //     }
  //   }
  // }

  const handleFilterSelection = (key, value) => {
    if (value === null) {
      setState({
        ...state,
        [key]: []
      })
    } else {
      const exists = state[key].includes(value)
      if (exists) {
        setState({
          ...state,
          [key]: state[key].filter((c) => {
            return c !== value
          })
        })
      } else {
        setState({
          ...state,
          [key]: state[key].concat(value)
        })
      }
    }
  }

  const handleVidsPerPageChange = (perPage) => {
    setState({
      ...state,
      numOfVidsPerPage: perPage
    })
  }

  const handleTagSelection = (tag) => {
    const index = state.selectedTags?.indexOf(tag)

    if (index === -1) {
      setState({ ...state, selectedTags: state.selectedTags?.concat(tag) })
    } else {
      setState({
        ...state,
        selectedTags: state.selectedTags?.filter((current) => current !== tag)
      })
    }
  }

  const handleActressSelection = (actress) => {
    const index = state.selectedActresses?.indexOf(actress)

    if (index === -1) {
      setState({
        ...state,
        selectedActresses: state.selectedActresses?.concat(actress)
      })
    } else {
      setState({
        ...state,
        selectedActresses: state.selectedActresses?.filter(
          (current) => current !== actress
        )
      })
    }
  }
  return (
    <GallerySettingsContext.Provider
      value={{
        availableActresses: settings?.listOfActresses || [],
        availableDecades: settings?.decades || [],
        minDecade: settings?.lowestYear,
        handleSetSortBy,
        handleYearAscending,
        handleAddedAscending,
        handleRandomize,
        handleFilterSelection,
        handleVidsPerPageChange,
        handleTagSelection,
        handleActressSelection,
        gallery,
        galleryLength: gallery?.length || 0,
        availableTags: galleryObj?.tags,
        galleryIsLoading,
        ...state
      }}
    >
      {children}
    </GallerySettingsContext.Provider>
  )
}
