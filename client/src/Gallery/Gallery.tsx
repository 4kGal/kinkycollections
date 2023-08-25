import React, { useEffect } from 'react'
import { Grid } from '@mui/material'
import { useAsync, useAsyncFn } from '../hooks/useAsync'
import { getGallery } from '../services/videos'
import { useGallerySettingsContext } from '../hooks'

const Gallery = ({ collection }: { collection: string }) => {
  return (
    <Grid container alignItems="center" justifyContent="center">
      inside
    </Grid>
  )
}

export default Gallery
