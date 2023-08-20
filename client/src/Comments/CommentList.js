import React from 'react'
import { Comment } from './Comment'
import { Grid } from '@mui/material'

export function CommentList({ comments }) {
  console.log(comments)
  return (
    comments &&
    comments?.map((comment, index) => (
      <Grid item key={comment.id} margin={2}>
        <Comment
          index={index}
          {...comment}
          isRoot={comment.root === true ? 'root' : 'child'}
        />
      </Grid>
    ))
  )
}
