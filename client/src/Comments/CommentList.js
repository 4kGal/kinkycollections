import React from 'react'
import { Comment } from './Comment'
import { Grid } from '@mui/material'

export function CommentList({ comments }) {
  return (
    comments &&
    comments?.map((comment) => (
      <Grid item key={comment.id} margin={2}>
        <Comment {...comment} />
      </Grid>
    ))
  )
}
