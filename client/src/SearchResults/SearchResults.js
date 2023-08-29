import React from 'react'
import Card from '../Card/Card'
import { Grid } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'

const SearchResults = () => {
  const location = useLocation()
  // const navigate = useNavigate()
  const { state } = location
  const { searchResults } = state

  return (
    <Grid container alignItems="center" justifyContent="center">
      {searchResults?.map((video, index) => (
        <Card key={index} video={video} />
      ))}{' '}
    </Grid>
  )
}

export default SearchResults
