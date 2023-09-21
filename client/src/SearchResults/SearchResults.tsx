import React from 'react'
import Card from '../Gallery/Card'
import { Grid, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { type MetaData } from '../Shared/types'

const SearchResults = () => {
  const location = useLocation()
  const { state } = location
  const { searchResults } = state

  return (
    <Grid container alignItems="center" justifyContent="center">
      {searchResults.length > 0 ? (
        searchResults?.map((video: MetaData, index: number) => (
          <Card key={index} video={video} index={index} />
        ))
      ) : (
        <Typography color="white" variant="h3" data-cy="no-results-found">
          No Results Found
        </Typography>
      )}
    </Grid>
  )
}

export default SearchResults
