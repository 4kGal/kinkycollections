import { Typography } from '@mui/material'
import { styled } from '@mui/system'
import React, { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'

const StyledDivContainer = styled('div')({
  position: 'relative',
  paddingTop: '56.25%',
  width: '100%',
  height: '100%'
})
const StyledIframe = styled('iframe')({
  border: 'none',
  position: 'absolute',
  paddingLeft: '10%',
  top: 0,
  height: '75%',
  width: '75%'
})
const Player = () => {
  const params = useParams()
  const _id = params.id
  const { collection = '' } = params
  if (_id?.length === 0) return <Navigate to="/" />

  const [videoData, setVideoData] = useState({ name: '', videoId: '' })

  useEffect(() => {
    const getVideo = async () => {
      try {
        const res = await fetch(`/api/videos/${collection}/${_id}/data`)
        const data = await res.json()
        setVideoData(data)
      } catch (error) {
        console.log(error)
      }
    }

    getVideo()
  }, [])

  return (
    <StyledDivContainer>
      <Typography mt={'-12%'} variant="h5" align="center" color="white">
        {videoData.name}
      </Typography>
      <StyledIframe
        src={`https://iframe.mediadelivery.net/embed/147442/${videoData.videoId}?autoplay=true&loop=false&muted=false&preload=true`}
        loading="lazy"
        title={videoData.name}
        allow="accelerometer;gyroscope;encrypted-media;picture-in-picture;"
        allowFullScreen
      />
    </StyledDivContainer>
  )
}

export default Player
