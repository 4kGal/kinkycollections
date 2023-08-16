import { Grid } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'

const Player = () => {
  const params = useParams()
  const videoId = params.id
  const { collection = '' } = params
  if (videoId?.length === 0) return <Navigate to="/" />

  const [videoData, setVideoData] = useState({ name: '' })

  useEffect(() => {
    const getVideo = async () => {
      try {
        const res = await fetch(
          `/api/videos/${collection}/${videoId ?? ''}/data`
        )
        const data = await res.json()
        setVideoData(data)
      } catch (error) {
        console.log(error)
      }
    }

    getVideo()
  }, [])

  return (
    <Grid container style={{ width:"100%", height:"100%"}} justifyContent="center">
      <Grid item xs={12} style={{position:"relative", paddingTop:"56.25%"}}>
        <iframe 
          src="https://iframe.mediadelivery.net/play/146332/c320a30d-b9c8-4741-8dd6-87b320107df2?autoplay=true&loop=false&muted=false&preload=true" 
          loading="lazy" 
          style={{border:"none",position:"absolute",top:0, paddingLeft: "10%"}}
          allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;" 
          allowFullScreen
          height="75%" width="75%"></iframe>
        </Grid>
      <h5>{videoData.name}</h5>
    </Grid>
  )
}

export default Player
