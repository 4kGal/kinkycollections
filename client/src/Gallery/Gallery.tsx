import React, { useState, useEffect } from 'react'
import { Grid, Typography, LinearProgress } from '@mui/material'
import { useGalleryContext } from '../hooks'
import { type MetaData } from '../Shared/types'
import Card from '../Card/Card'
import PageNavigation from '../Shared/PageNavigation/PageNavigation'
import FilterVideoButtons from '../Shared/FilterVideoButtons/FilterVideoButtons'

const Gallery = ({ collection }: { collection: string }) => {
  const [page, setPage] = useState(0)
  const {
    gallery,
    galleryLength,
    galleryIsLoading,
    galleryServiceError,
    availableTags,
    selectedActresses,
    selectedTags,
    combineFilters,
    numOfVidsPerPage,
    handleTagSelection,
    handleCombineFilters,
    handleActressSelection
  } = useGalleryContext()

  useEffect(() => {
    setPage(0)
  }, [numOfVidsPerPage, gallery, collection])

  const Cards = () => {
    const orderedGallery = gallery?.slice(
      page * parseInt(numOfVidsPerPage),
      page * parseInt(numOfVidsPerPage) + parseInt(numOfVidsPerPage)
    )
    return orderedGallery?.map((video: MetaData, index: number) => (
      <Card
        key={index}
        collection={collection}
        video={video}
        setSelectedTags={handleTagSelection}
        setCustomTags={handleActressSelection}
      />
    ))
  }
  return (
    <Grid container alignItems="center" justifyContent="center">
      {/*  : galleryServiceError ? (
         <Grid item xs={12} sx={{ textAlign: 'center' }} mt={10}>
           <Typography variant="h5" color="error" data-cy="error-message">
             {galleryServiceError.toString()}
           </Typography>
           <Typography
             variant="h6"
             color="white"
             data-cy="error-contact-me-message"
           >
             Try refreshing or contact me at 4kgal98@gmail.com
           </Typography>
         </Grid>
       ) : ( */}
      <>
        <FilterVideoButtons
          availableTags={availableTags}
          handleTagSelection={handleTagSelection}
          selectedTags={selectedTags}
          setCombineFilters={handleCombineFilters}
          combineFilters={combineFilters}
          selectedCustomTags={selectedActresses}
          handleSelectedCustomTags={handleActressSelection}
        />
        {galleryIsLoading && (
          <Grid item xs={12}>
            <LinearProgress sx={{ marginTop: 0.5 }} data-cy="gallery-loading" />
          </Grid>
        )}
        <Cards />
        <PageNavigation
          page={page}
          setPage={setPage}
          length={galleryLength - 1}
          perPage={numOfVidsPerPage}
        />
      </>
    </Grid>
  )
}

export default Gallery
