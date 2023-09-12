// FIXME this is ssomething
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Divider, Grid, Switch, Typography } from '@mui/material'
import { styled } from '@mui/system'
import React, { useState } from 'react'
import { CommentList, CommentForm } from './Comments'
import { useAsyncFn } from './hooks/useAsync'
import { createComment } from './services/comments'
import { useAuthContext, usePlayerContext } from './hooks'
import { isEmpty } from 'lodash'
import SwitchComponent from './Shared/SwitchComponent/SwitchComponent'

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
  paddingLeft: '5%',
  top: 0,
  height: '90%',
  width: '90%'
})
const Player = () => {
  const { user } = useAuthContext()
  const { video, rootComments, sort, handleSetSort, refreshLocalComments } =
    usePlayerContext()
  const { loading, error, execute: createCommentFn } = useAsyncFn(createComment)

  const onCommentCreate = (message) => {
    return createCommentFn({
      collection: video.collection,
      _id: video._id,
      parentId: null,
      message,
      user: {
        username: user.username
      }
    })
      .then(refreshLocalComments)
      .catch(console.log)
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
          mt="56%"
          ml={5}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '34%'
          }}
        >
          <Typography mt={'-60%'} variant="h5" align="center" color="white">
            {video?.customName?.length > 0 ? video.customName : video.name}
          </Typography>
          <Divider
            light
            flexItem
            sx={{
              marginLeft: '-50px',
              borderColor: 'white',
              paddingTop: 3,
              marginBottom: 3,
              borderBottomWidth: 10
            }}
          />
          <Typography variant="h3" color="white">
            Comment Section
          </Typography>
          <Grid container flexWrap="nowrap">
            <Grid item xs={10} flexDirection={'row'} flexWrap="nowrap">
              <CommentForm
                loading={loading}
                error={error}
                onSubmit={onCommentCreate}
                isDisabled={isEmpty(user)}
              />
            </Grid>
            <Grid item xs={3}>
              <SwitchComponent
                left="Newest"
                right="Most Liked"
                call={handleSetSort}
                checked={sort}
                color="white"
              />
            </Grid>
          </Grid>
          <Grid pb={10}>
            {rootComments !== null && rootComments?.length > 0 && (
              <CommentList comments={rootComments} />
            )}
          </Grid>
        </Grid>
      </StyledDivContainer>
    </Grid>
  )
}

export default Player
