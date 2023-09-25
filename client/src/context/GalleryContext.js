import React, { createContext, useState, useEffect } from 'react'
import { useAsync } from '../hooks/useAsync'
import { getGallery, getGalleryInitialSettings } from '../services/videos'
import { useLocation } from 'react-router-dom'
import { useAuthContext } from '../hooks'
import { isEmpty } from 'lodash'

export const GalleryContext = createContext()

const initialParams = {
  sortBy: 'recent',
  yearAsc: true,
  addedAsc: true,
  numOfVidsPerPage: 9,
  combineFilters: false,
  multipleActresses: false
}
export const GalleryProvider = ({ children }) => {
  const location = useLocation()
  const collection = location.pathname.replace('/', '')

  const { user } = useAuthContext()
  const [hideUnderage, setHideUnderage] = useState(true)

  const [gallery, setGallery] = useState([])
  const [selectedActresses, setSelectedActresses] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedDecades, setSelectedDecades] = useState([])

  const [params, setParams] = useState(initialParams)

  useEffect(() => {
    if (!isEmpty(user) && user?.hideUnderage !== hideUnderage) {
      setHideUnderage(user?.hideUnderage)
    }
  }, [user?.hideUnderage])

  useEffect(() => {
    setParams(initialParams)
    setSelectedActresses([])
    setSelectedTags([])
    setSelectedDecades([])
  }, [collection])

  const { value: settings } = useAsync(
    () =>
      getGalleryInitialSettings(collection, hideUnderage?.toString() || 'true'),
    [collection, hideUnderage]
  )

  useEffect(() => {
    if (selectedActresses?.length > 0 && !params.combineFilters) {
      setParams({ ...params, combineFilters: true })
    }
  }, [selectedActresses])

  const searchParamObj = {
    ...(selectedDecades?.length > 0 && {
      decades: selectedDecades
    }),
    ...(selectedActresses?.length > 0 && {
      actresses: selectedActresses
    }),
    multipleActresses: params.multipleActresses.toString(),
    ...(selectedTags?.length > 0 && { tags: selectedTags }),
    hideUnderage: hideUnderage?.toString() || 'true',
    eitherOr: params.combineFilters ? 'and' : 'or'
  }

  const paramKeys = Object.keys(searchParamObj)
  let queryStr = ''
  paramKeys.forEach((param) => {
    queryStr += `&${param}=${searchParamObj[param]
      .toString()
      .replace(/,\s*$/, '')}`
  })
  if (params.sortBy === 'year') {
    queryStr += `&sort=${params.sortBy}${params.yearAsc ? 'Asc' : 'Desc'}`
  } else if (params.sortBy === 'recent' && !params.addedAsc) {
    queryStr += `&sort=oldest`
  } else {
    queryStr += `&sort=${params.sortBy}`
  }

  const {
    loading: galleryIsLoading,
    error: galleryServiceError,
    value: galleryObj
  } = useAsync(
    () => getGallery(collection, queryStr),
    [
      collection,
      params,
      hideUnderage,
      selectedActresses,
      selectedDecades,
      selectedTags,
      user?.hideUnderage,
      user?.favorites
    ]
  )

  useEffect(() => {
    if (galleryObj?.gallery !== gallery) {
      setGallery(galleryObj?.gallery)
    }
  }, [galleryObj?.gallery])

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

  const handleCombineFilters = () => {
    setParams({
      ...params,
      combineFilters: !params.combineFilters
    })
  }

  const handleMultipleActresses = () => {
    setParams({
      ...params,
      multipleActresses: !params.multipleActresses
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
      setSelectedTags((selectedTags ?? [])?.concat(tag))
    } else {
      setSelectedTags(
        (selectedTags ?? [])?.filter((currentTag) => currentTag !== tag)
      )
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
  const handleDisplayUnderageSwitch = () => {
    setHideUnderage((prevValue) => !prevValue)
  }

  return (
    <GalleryContext.Provider
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
        handleCombineFilters,
        handleMultipleActresses,
        handleDisplayUnderageSwitch,
        gallery,
        galleryLength: galleryObj?.gallery?.length || 0,
        availableTags: galleryObj?.tags,
        selectedActresses,
        selectedDecades,
        selectedTags,
        galleryServiceError,
        galleryIsLoading,
        hideUnderage,
        ...params
      }}
    >
      {children}
    </GalleryContext.Provider>
  )
}
