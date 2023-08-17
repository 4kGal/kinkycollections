import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import Card from '../Card/Card'
import { type MetaData } from '../Shared/types'

const Favorites = () => {
  const { user }: { user: { username: string } } = useAuthContext()
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const getInitialVideos = async () => {
      try {
        const response = await fetch(`/api/user/favorites/${user?.username}`)
        const data = await response.json()

        setFavorites(data.map((movie: MetaData[]) => ({ ...movie })))
      } catch (error) {
        console.log(error)
      }
    }
    getInitialVideos()
  }, [user])

  return <Card videos={favorites} />
}
export default Favorites
