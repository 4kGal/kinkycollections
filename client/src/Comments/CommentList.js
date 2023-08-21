import React from 'react'
import { Comment } from './Comment'
import { Grid } from '@mui/material'

export function CommentList({ comments }) {
  return (
    comments?.length > 0 &&
    comments?.map((comment, index) => (
      <Grid item key={comment.id} margin={2}>
        <Comment
          index={index}
          {...comment}
          isRoot={comment.parentId === null ? 'root' : 'child'}
        />
      </Grid>
    ))
  )
}
