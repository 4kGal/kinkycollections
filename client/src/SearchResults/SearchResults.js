import React from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import Card from '../Card/Card'

const SearchResults = () => {
  const { searchResults } = useAuthContext()
  return <Card videos={searchResults} />
}

export default SearchResults
