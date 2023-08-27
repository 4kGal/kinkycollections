import React, { createContext, useState, useMemo } from 'react'
import { useAsync, useAsyncFn } from '../hooks/useAsync'
import { getGallery, getGalleryInitialSettings } from '../services/videos'
import { useLocation } from 'react-router-dom'
import { useAuthContext } from '../hooks'

export const GallerySettingsContext = createContext()

export const GallerySettingsProvider = ({ children }) => {
  const location = useLocation()
  const collection = location.pathname.replace('/', '')

  const { user } = useAuthContext()
  const getGalleryFn = useAsyncFn(getGallery)

  const [gallery, setGallery] = useState([])
  const [galleryIsLoading, setGalleryIsLoading] = useState(false)
  const [galleryServiceError, setGalleryServiceError] = useState(null)
  const [availableTags, setAvailableTags] = useState([])
  const [selectedActresses, setSelectedActresses] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedDecades, setSelectedDecades] = useState([])

  const [params, setParams] = useState({
    sortBy: 'recent',
    yearAsc: true,
    addedAsc: true,
    numOfVidsPerPage: 9,
    combineFilters: 'and'
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

  const searchParamObj = {
    ...(params.decadesFilter?.length > 0 && {
      decades: params.decadesFilter
    }),
    ...(selectedActresses?.length > 0 && {
      actresses: selectedActresses
    }),
    ...(selectedTags?.length > 0 && { tags: selectedTags }),
    hideUnderage: user?.hideUnderage?.toString() || 'true',
    eitherOr: params.combineFilters ? 'and' : 'or'
  }
  const paramKeys = Object.keys(searchParamObj)
  let queryStr = ''
  paramKeys.forEach((param) => {
    queryStr += `&${param}=${searchParamObj[param]
      .toString()
      .replace(/,\s*$/, '')}`
  })
  queryStr += `&sort=${params.sortBy}`

  // const {
  //   loading: galleryIsLoading,
  //   error: galleryServiceError,
  //   value: galleryObj
  // } = useAsyncFn(
  //   () => getGallery(collection, queryStr),
  //   [collection, params, user?.hideUnderage, user?.favorites]
  // )

  const onGetGallery = () => {
    return getGalleryFn
      .execute(collection, queryStr)
      .then((galleryRes) => {
        setGallery(galleryRes.gallery)
        setAvailableTags(galleryRes.tags)
      })
      .catch((e) => setGalleryServiceError(e))
  }

  useMemo(() => {
    if (collection === 'mainstreambb') {
      onGetGallery()
      //     setGalleryIsLoading(true)
      //     setGalleryServiceError(null)
      //     const searchParamObj = {
      //       ...(params.decadesFilter?.length > 0 && {
      //         decades: params.decadesFilter
      //       }),
      //       ...(selectedActresses?.length > 0 && {
      //         actresses: selectedActresses
      //       }),
      //       ...(selectedTags?.length > 0 && { tags: selectedTags }),
      //       hideUnderage: user?.hideUnderage?.toString() || 'true',
      //       eitherOr: params.combineFilters ? 'and' : 'or'
      //     }
      //     const paramKeys = Object.keys(searchParamObj)
      //     let queryStr = ''
      //     paramKeys.forEach((param) => {
      //       queryStr += `&${param}=${searchParamObj[param]
      //         .toString()
      //         .replace(/,\s*$/, '')}`
      //     })
      //     queryStr += `&sort=${params.sortBy}`

      //     getGallery(collection, queryStr)
      //       .then((res) => {
      //         console.log('getting in memo,')
      //         setGallery(res?.gallery)
      //         setAvailableTags(res?.tags)
      //       })
      //       .catch((e) => setGalleryServiceError(e))
      //       .finally(() => setGalleryIsLoading(false))
    }
  }, [
    collection,
    params,
    selectedActresses,
    selectedDecades,
    selectedTags,
    user?.hideUnderage,
    user?.favorites
  ])

  const handleSetSortBy = (newSortBy) => {
    setParams({
      ...params,
      sortBy: newSortBy
    })
  }

  const handleYearAscending = () => {
    setParams({
      ...params,
      yearAsc: !params.yearAsc
    })
  }
  const handleAddedAscending = () => {
    setParams({
      ...params,
      addedAsc: !params.addedAsc
    })
  }

  const handleRandomize = () => {
    const dupGallery = [...gallery]
    setGallery(dupGallery.sort(() => Math.random() - 0.5))
  }

  const handleVidsPerPageChange = (perPage) => {
    setParams({
      ...params,
      numOfVidsPerPage: perPage
    })
  }

  const handleTagSelection = (tag) => {
    const index = selectedTags?.indexOf(tag)

    if (index === -1) {
      setSelectedTags(selectedTags?.concat(tag))
    } else {
      setSelectedTags(selectedTags?.filter((current) => current !== tag))
    }
  }

  const handleActressSelection = (actress) => {
    const index = selectedActresses?.indexOf(actress)
    if (actress === null) {
      setSelectedActresses([])
    } else {
      if (index === -1) {
        setSelectedActresses(selectedActresses?.concat(actress))
      } else {
        setSelectedActresses(
          selectedActresses?.filter((current) => current !== actress)
        )
      }
    }
  }
  const handleDecadeSelection = (decade) => {
    const exists = selectedDecades.includes(decade)

    if (decade === null) {
      setSelectedDecades([])
    } else {
      if (exists) {
        setSelectedDecades(
          selectedDecades.filter((c) => {
            return c !== decade
          })
        )
      } else {
        setSelectedDecades(selectedDecades.concat(decade))
      }
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
        handleVidsPerPageChange,
        handleTagSelection,
        handleActressSelection,
        handleDecadeSelection,
        gallery,
        galleryLength: gallery?.length || 0,
        availableTags,
        galleryIsLoading,
        selectedActresses,
        selectedDecades,
        selectedTags,
        galleryServiceError,
        ...params
      }}
    >
      {children}
    </GallerySettingsContext.Provider>
  )
}
