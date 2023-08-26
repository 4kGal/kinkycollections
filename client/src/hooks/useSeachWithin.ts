import { useState } from 'react'
import { useAuthContext } from './'
import { useNavigate } from 'react-router-dom'
import { SEARCH_RESULTS } from '../utils/constants'

// type SearchParams = Record<string, string | Array<string | undefined>>

export const useSearchWithin = () => {
  const navigate = useNavigate()
  const { dispatch } = useAuthContext()

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const search = async (searchTerm: string, collection: string) => {
    setIsLoading(true)
    setError(null)
    console.log(collection)

    let queryString = `?text=${searchTerm}`
    if (collection.length > 0) {
      queryString += `&collection=${collection}`
    }

    const response = await fetch(`/api/search${queryString}`)
    const json = await response.json()
    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      setIsLoading(false)
      dispatch({ type: SEARCH_RESULTS, payload: json })

      navigate('/searchResults')
    }
  }

  // const decadeSearch = async (decades) => {
  //   setIsLoading(true)
  //   setError(null)

  //   const response = await fetch(
  //     `/api/search/decades?years=${decades.toString()}`
  //   )
  //   const json = await response.json()
  //   if (!response.ok) {
  //     setIsLoading(false)
  //     setError(json.error)
  //   }
  //   if (response.ok) {
  //     console.log(json)
  //     setIsLoading(false)
  //     dispatch({ type: 'SEARCH_RESULTS', payload: json })

  //     navigate('/searchResults')
  //   }
  // }
  return { search, isLoading, error }
}
