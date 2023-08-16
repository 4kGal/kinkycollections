import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom'
import { AVAILABLE_TAGS, SEARCH_RESULTS } from '../utils/constants'

type SearchParams = Record<string, string | Array<string | undefined>>

export const useSearchWithin = () => {
  const navigate = useNavigate()
  const { dispatch } = useAuthContext()

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const filter = async (
    collection: string,
    searchParamObj: SearchParams,
    sort = 'recent'
  ) => {
    setIsLoading(true)
    setError(null)

    const paramKeys = Object.keys(searchParamObj)
    let queryStr = ''
    paramKeys.forEach((param) => {
      queryStr += `&${param}=${searchParamObj[param]
        .toString()
        .replace(/,\s*$/, '')}`
    })
    queryStr += `&sort=${sort}`

    const response = await fetch(`/api/search/filter/${collection}?${queryStr}`)
    const json = await response.json()
    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      setIsLoading(false)
      dispatch({ type: AVAILABLE_TAGS, payload: json.tags })
      return json
      // dispatch({ type: 'SEARCH_RESULTS', payload: json })

      // navigate('/searchResults')
    }
  }
  // const filter = async (searchParamObj) => {
  //   setIsLoading(true)
  //   setError(null)

  //   const paramKeys = Object.keys(searchParamObj)
  //   let queryStr = ''
  //   paramKeys.forEach((param) => {
  //     queryStr += `&${param}=${searchParamObj[param]
  //       .toString()
  //       .replace(/,\s*$/, '')}`
  //   })

  //   const response = await fetch(`/api/search/filter?${queryStr}`)
  //   const json = await response.json()
  //   if (!response.ok) {
  //     setIsLoading(false)
  //     setError(json.error)
  //   }
  //   if (response.ok) {
  //     setIsLoading(false)
  //     console.log(json)
  //     dispatch({ type: 'AVAILABLE_TAGS', payload: json.tags })
  //     return json
  //     // dispatch({ type: 'SEARCH_RESULTS', payload: json })

  //     // navigate('/searchResults')
  //   }
  // }
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
  return { search, filter, isLoading, error }
}
