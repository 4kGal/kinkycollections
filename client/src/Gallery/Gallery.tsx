import React, { useState, useEffect } from 'react'
import { Grid } from '@mui/material'
import Card from '../Card/Card'
import FilterVideoButtons from '../Shared/FilterVideoButtons/FilterVideoButtons'
import {
  AVAILABLE_ACTRESSES,
  AVAILABLE_DECADES,
  AVAILABLE_TAGS,
  MIN_DECADE,
  RANDOMIZE,
  SELECTED_ACTRESSES,
  moviesPerPage
} from '../utils/constants'
import PageNavigation from '../Shared/PageNavigation/PageNavigation'
import { useSearchWithin } from '../hooks/useSeachWithin'
import { useAuthContext } from '../hooks/useAuthContext'
import { type MetaData } from '../Shared/types'

interface InitialSettings {
  lowestYear: number
  tags: [{ key: string; count: number }] | undefined
  decades: [{ key: string; count: number }]
  listOfActresses: [{ key: string; tags: string[] }]
}

const Gallery = ({ collection }: { collection: string }) => {
  const {
    dispatch,
    user,
    decadesFilter,
    availableTags,
    sortBy,
    selectedActresses,
    hideUnderage,
    randomize
  } = useAuthContext()
  const { filter } = useSearchWithin()

  const [combineFilters, setCombineFilters] = useState(false)
  const [displayedVideos, setDisplayedVideos] = useState<MetaData[]>([])
  const [page, setPage] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const getInitialSettings = async () => {
    try {
      const response = await fetch(`/api/videos/${collection}/settings`)
      const data: InitialSettings = await response.json()

      dispatch({ type: AVAILABLE_DECADES, payload: data?.decades })
      dispatch({ type: MIN_DECADE, payload: data?.lowestYear })
      dispatch({ type: AVAILABLE_ACTRESSES, payload: data?.listOfActresses })
      dispatch({ type: AVAILABLE_TAGS, payload: data?.tags })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getInitialSettings()
  }, [])

  useEffect(() => {
    if (randomize === true) {
      setDisplayedVideos(displayedVideos.sort(() => Math.random() - 0.5))
      dispatch({ type: RANDOMIZE, payload: false })
    }
  }, [randomize])

  useEffect(() => {
    const getFilteredVideos = async () => {
      const filtered = await filter(
        collection,
        {
          ...(decadesFilter?.length > 0 && { decades: decadesFilter }),
          ...(selectedActresses?.length > 0 && {
            actresses: selectedActresses
          }),
          ...(selectedTags?.length > 0 && { tags: selectedTags }),
          ...(hideUnderage === true && { underage: 'false' }),
          eitherOr: combineFilters ? 'and' : 'or'
        },
        sortBy
      )
      setPage(0)
      setDisplayedVideos(filtered.movies)
    }
    getFilteredVideos()
  }, [
    selectedTags,
    combineFilters,
    selectedActresses,
    decadesFilter,
    user?.favorites,
    sortBy,
    hideUnderage
  ])

  useEffect(() => {
    if (selectedActresses?.length > 0 && !combineFilters) {
      setCombineFilters(true)
    }
  }, [selectedActresses])

  const handleActressSelection = (actress: string | undefined) => {
    const index = selectedActresses?.indexOf(actress)

    if (index === -1) {
      dispatch({
        type: SELECTED_ACTRESSES,
        payload: (selectedActresses ?? [])?.concat(actress)
      })
      // setSelectedActresses((selectedActresses ?? [])?.concat(actress))
    } else {
      dispatch({
        type: SELECTED_ACTRESSES,
        payload: (selectedActresses ?? [])?.filter(
          (current: string) => current !== actress
        )
      })
    }
  }

  const handleTagSelection = (tag: string) => {
    const index = selectedTags?.indexOf(tag)

    if (index === -1) {
      setSelectedTags((selectedTags ?? [])?.concat(tag))
    } else {
      setSelectedTags(
        (selectedTags ?? [])?.filter((current) => current !== tag)
      )
    }
  }

  return (
    <Grid container alignItems="center" justifyContent="center">
      <FilterVideoButtons
        availableTags={availableTags}
        setSelectedTags={setSelectedTags}
        selectedTags={selectedTags}
        setCombineFilters={setCombineFilters}
        combineFilters={combineFilters}
        selectedCustomTags={selectedActresses}
        handleSelectedCustomTags={handleActressSelection}
      />
      {displayedVideos
        ?.slice(page * moviesPerPage, page * moviesPerPage + moviesPerPage)
        .map((video, index) => (
          <Card
            key={index}
            collection={collection}
            video={video}
            setSelectedTags={handleTagSelection}
            setCustomTags={handleActressSelection}
          />
        ))}
      <PageNavigation
        page={page}
        setPage={setPage}
        length={displayedVideos?.length - 1}
        perPage={moviesPerPage}
      />
    </Grid>
  )
}

export default Gallery
