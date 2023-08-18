import React from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import Card from '../Card/Card'
import { Grid } from '@mui/material'

const SearchResults = () => {
  const { searchResults } = useAuthContext()

  return (
    <Grid container alignItems="center" justifyContent="center">
      {searchResults?.map((video, index) => (
        <Card key={index} video={video} />
      ))}{' '}
    </Grid>
  )
}

export default SearchResults
