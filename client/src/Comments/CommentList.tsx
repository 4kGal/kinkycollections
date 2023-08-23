import React from 'react'
import { Comment } from './Comment'
import { Grid } from '@mui/material'
import { type CommentsObj } from '../Shared/types'

interface Comments {
  comments: CommentsObj[]
}
export const CommentList = ({ comments }: Comments) => {
  return (
    comments?.length > 0 &&
    comments?.map((comment: CommentsObj, index: number) => (
      <Grid item key={comment.id} mt={2} ml={1} mr={15}>
        <Comment
          index={index}
          {...comment}
          isRoot={comment.parentId === null ? 'root' : 'child'}
        />
      </Grid>
    ))
  )
}
