import React, { useState, useEffect } from 'react'
import { Grid, Typography } from '@mui/material'
import { useGallerySettingsContext } from '../hooks'
import { type MetaData } from '../Shared/types'
import Card from '../Card/Card'
import PageNavigation from '../Shared/PageNavigation/PageNavigation'

const Gallery = ({ collection }: { collection: string }) => {
  const [page, setPage] = useState(0)
  const {
    gallery,
    galleryLength,
    galleryIsLoading,
    numOfVidsPerPage,
    handleTagSelection,
    handleActressSelection
  } = useGallerySettingsContext()

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
      {galleryIsLoading ? (
        <Grid item xs={12} sx={{ textAlign: 'center' }} mt={10}>
          <Typography variant="h2" color="primary">
            Loading...
          </Typography>
        </Grid>
      ) : (
        <>
          <Cards />
          <PageNavigation
            page={page}
            setPage={setPage}
            length={galleryLength - 1}
            perPage={numOfVidsPerPage}
          />
        </>
      )}
    </Grid>
  )
}

export default Gallery
