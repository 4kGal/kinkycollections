import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../hooks'
import Card from '../Gallery/Card'
import { type MetaData } from '../Shared/types'
import { Grid } from '@mui/material'

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

  return (
    <Grid container alignItems="center" justifyContent="center">
      {favorites?.map((video, i) => <Card key={i} video={video} index={i} />)}
    </Grid>
  )
}
export default Favorites
