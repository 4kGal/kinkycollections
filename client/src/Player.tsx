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
    <div className="App-header">
      {/* <div style={{position:"relative", paddingTop:"56.25%"}}> */}
{/* <iframe src="https://iframe.mediadelivery.net/embed/146332/b1693623-2d7a-48cf-9b48-9888557481a7?autoplay=true&loop=false&muted=false&preload=true" loading="lazy" style={{border:"none",position:"absolute",top:0,height:"100%",width:"100%"}} allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;" allowFullScreen></iframe>     </div> */}
 <video controls muted autoPlay crossOrigin="anonymous">
        <source
          src={`/api/videos/${collection}/${videoId ?? ''}`}
          type="video/mp4"
        ></source>
      </video>
      <h5>{videoData.name}</h5>
    </div>
  )
}

export default Player
