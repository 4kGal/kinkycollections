// FIXME this is ssomething
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { CommentList } from './Comments/CommentList'

const StyledDivContainer = styled('div')({
  position: 'relative',
  paddingTop: '56%',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
})
const StyledIframe = styled('iframe')({
  border: 'none',
  position: 'absolute',
  // paddingLeft: '10%',
  top: 0,
  height: '100%',
  width: '100%'
})
const Player = () => {
  const params = useParams()
  const _id = params.id
  const { collection = '' } = params
  if (_id?.length === 0) return <Navigate to="/" />

  const [videoData, setVideoData] = useState<{
    name: string
    videoId: string
    comments:
      | [
          {
            id: string
            message: string
            parentId: string
            createdAt: string
            likes: number
            user: {
              id: string
              username: string
            }
          }
        ]
      | []
  }>({
    name: '',
    videoId: '',
    comments: []
  })

  const commentsByParentId = useMemo(() => {
    // TODO: TS
    const group: any = {}
    if (videoData?.comments == null) return []
    videoData?.comments.forEach((comment) => {
      if (comment?.parentId?.length > 0) {
        group[comment?.parentId] = [comment]
      } else {
        group?.null?.length > 0
          ? group?.null?.push(comment)
          : (group.null = [comment])
      }
    })
    return group
  }, [videoData?.comments])

  // const getReplies = (parentId: string) => commentsByParentId[parentId]

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
    <Grid
      container
      flexDirection="column"
      flexWrap="nowrap"
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
    >
      <StyledDivContainer>
        <StyledIframe
          src={`https://iframe.mediadelivery.net/embed/147442/${videoData.videoId}?autoplay=true&loop=false&muted=false&preload=true`}
          loading="lazy"
          title={videoData.name}
          allow="accelerometer;gyroscope;encrypted-media;picture-in-picture;"
          allowFullScreen
        />
        <Grid
          item
          mt="62%"
          sx={{
            position: 'absolute',
            width: '100%'
          }}
        >
          <Typography mt={'-60%'} variant="h5" align="center" color="white">
            {videoData.name}
          </Typography>
          <Typography variant="h3">Comment Section</Typography>
          <CommentList comments={commentsByParentId.null} />
        </Grid>
      </StyledDivContainer>
    </Grid>
  )
}

export default Player
