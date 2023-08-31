import React from 'react'
import Card from '../Gallery/Card'
import { Grid } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { type MetaData } from '../Shared/types'

const SearchResults = () => {
  const location = useLocation()
  const { state } = location
  const { searchResults } = state

  return (
    <Grid container alignItems="center" justifyContent="center">
      {searchResults?.map((video: MetaData, index: number) => (
        <Card key={index} video={video} />
      ))}{' '}
    </Grid>
  )
}

export default SearchResults
