// FIXME this is ssomething
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Grid, Switch, Typography } from '@mui/material'
import { styled } from '@mui/system'
import React from 'react'
import { Navigate } from 'react-router-dom'
import { CommentList } from './Comments/CommentList'
import { useVideoPageContext } from './hooks/useVideoPageContext'
import { CommentForm } from './Comments/CommentForm'
import { useAsyncFn } from './hooks/useAsync'
import { createComment } from './services/comments'
import { useAuthContext } from './hooks/useAuthContext'
import { isEmpty } from 'lodash'

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
  const { user } = useAuthContext()
  const { video, rootComments, sort, setSort, createLocalComment } =
    useVideoPageContext()
  const { loading, error, execute: createCommentFn } = useAsyncFn(createComment)

  const onCommentCreate = (message) => {
    return createCommentFn({
      collection: video.collection,
      _id: video._id,
      message,
      user: {
        username: user.username
      }
    }).then(createLocalComment)
  }

  return (
    <Grid
      container
      flexDirection="column"
      flexWrap="nowrap"
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
    >
      <StyledDivContainer>
        <StyledIframe
          src={`https://iframe.mediadelivery.net/embed/147442/${video.videoId}?autoplay=true&loop=false&muted=false&preload=true`}
          loading="lazy"
          title={video.name}
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
            {video.name}
          </Typography>
          <Typography variant="h3">Comment Section</Typography>
          <span style={{ paddingLeft: 20 }}>
            <Typography variant="caption">Newest</Typography>
            <Switch
              checked={sort}
              onChange={({ target }) => setSort(target.checked)}
            />
            <Typography variant="caption">Most Liked</Typography>
          </span>
          <CommentForm
            loading={loading}
            error={error}
            onSubmit={onCommentCreate}
            isDisabled={isEmpty(user)}
          />
          {rootComments !== null && rootComments?.length > 0 && (
            <CommentList comments={rootComments} />
          )}
        </Grid>
      </StyledDivContainer>
    </Grid>
  )
}

export default Player
