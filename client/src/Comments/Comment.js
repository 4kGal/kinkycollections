import React, { useState } from 'react'
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Button
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import EditIcon from '@mui/icons-material/EditOutlined'
import ReplyIcon from '@mui/icons-material/Reply'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAuthContext } from '../hooks/useAuthContext'
import { useVideoPageContext } from '../hooks/useVideoPageContext'
import { ActionButton } from './ActionButton'
import { CommentList } from './CommentList'
import { styled } from '@mui/system'
import { isEmpty } from 'lodash'
import { CommentForm } from './CommentForm'
import { useAsyncFn } from '../hooks/useAsync'
import { createComment } from '../services/comments'

const VerticalLine = styled('button')({
  border: 'none',
  background: 'none',
  padding: 0,
  width: '15px',
  marginTop: '.5rem',
  marginLeft: '8px',
  position: 'relative',
  cursor: 'pointer',
  outline: 'none',
  transform: 'translateX(-50%)',
  borderRadius: '10px',
  backgroundColor: 'white',
  '&:hover, &:focus': {
    backgroundColor: '#1976d2'
  },
  '&:before': {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: '1px',
    backgroundColor: '#1976d2',
    transition: 'background-color 100ms ease-in-out'
  }
})

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short'
})

export function Comment({
  id,
  message,
  user,
  createdAt,
  likes,
  isRoot,
  index
}) {
  const { user: loggedInUser } = useAuthContext()
  const { video, getReplies, createLocalComment } = useVideoPageContext()
  const [isReplying, setIsReplying] = useState(false)
  const [areChildrenHidden, setAreChildrenHidden] = useState(false)
  const createCommentFn = useAsyncFn(createComment)

  const isUserComment =
    user?.username.toLowerCase() === loggedInUser?.username.toLowerCase()

  const childComments = getReplies(id)

  const onCommentReply = (message) => {
    return createCommentFn
      .execute({
        collection: video.collection,
        _id: video._id,
        parentId: id,
        message,
        user: {
          username: loggedInUser.username
        }
      })
      .then((comment) => {
        setIsReplying(false)
        createLocalComment(comment)
      })
  }
  console.log(loggedInUser)
  return (
    <>
      <Card data-cy={`${isRoot}-comment-${index}`}>
        <CardHeader
          data-cy={`comment-header-${index}`}
          title={user?.username}
          subheader={dateFormatter.format(new Date(createdAt))}
        />
        <CardContent sx={{ paddingTop: 0 }}>
          <Typography>{message}</Typography>
        </CardContent>
        <CardActions disableSpacing>
          <ActionButton data-cy={`favorite-icon-${index}`} Icon={FavoriteIcon}>
            {likes}
          </ActionButton>
          {isUserComment && (
            <ActionButton data-cy={`edit-icon-${index}`} Icon={EditIcon} />
          )}
          <ActionButton
            onClick={() => setIsReplying((prev) => !prev)}
            isActive={isReplying}
            data-cy={`reply-icon-${index}`}
            Icon={ReplyIcon}
            disabled={isEmpty(loggedInUser)}
          />
          {isUserComment && (
            <ActionButton
              color="error"
              data-cy={`delete-icon-${index}`}
              Icon={DeleteIcon}
            />
          )}
        </CardActions>
      </Card>
      {isReplying && (
        <Grid mt={1} ml={3}>
          <CommentForm
            autoFocus
            onSubmit={onCommentReply}
            loading={createCommentFn.loading}
            error={createCommentFn.error}
          />
        </Grid>
      )}
      <>
        {childComments?.length > 0 && (
          <Grid container>
            <Grid
              item
              style={{ display: `${areChildrenHidden ? 'none' : 'flex'}` }}
            >
              <VerticalLine onClick={() => setAreChildrenHidden(true)} />
              <Grid item flexGrow={1} pl=".5ren">
                <CommentList comments={childComments} />
              </Grid>
            </Grid>
            <Button
              style={{ display: `${!areChildrenHidden ? 'none' : 'flex'}` }}
              onClick={() => setAreChildrenHidden(false)}
            >
              Show Replies
            </Button>
          </Grid>
        )}
      </>
    </>
  )
}
