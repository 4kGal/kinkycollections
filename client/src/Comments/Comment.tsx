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
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import EditIcon from '@mui/icons-material/EditOutlined'
import ReplyIcon from '@mui/icons-material/Reply'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAuthContext, usePlayerContext } from '../hooks'
import { ActionButton, CommentList, CommentForm } from './'
import { styled } from '@mui/system'
import { isEmpty } from 'lodash'
import { useAsyncFn } from '../hooks/useAsync'
import {
  createComment,
  deleteComment,
  updateComment,
  updateCommentLike
} from '../services/comments'
import { useNavigate } from 'react-router-dom'
import { type CommentsObj } from '../Shared/types'
import { LOGIN_URL } from '../utils/constants'

const VerticalLine = styled('button')({
  border: 'none',
  background: 'none',
  padding: 0,
  width: '6px',
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

interface Root extends CommentsObj {
  isRoot: string
  index: number
}

interface PlayerCntxt {
  video: { collection: string; _id: string }
  getReplies: (id: string) => CommentsObj[]
  refreshLocalComments: (comments: CommentsObj[]) => void
}
const Comment = ({
  id,
  message,
  user,
  createdAt,
  likes = [],
  isRoot,
  index
}: Root) => {
  const navigate = useNavigate()

  const { user: loggedInUser } = useAuthContext()
  const { video, getReplies, refreshLocalComments }: PlayerCntxt =
    usePlayerContext()
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [areChildrenHidden, setAreChildrenHidden] = useState(false)
  const createCommentFn = useAsyncFn(createComment)
  const updateCommentFn = useAsyncFn(updateComment)
  const deleteCommentFn = useAsyncFn(deleteComment)
  const toggleCommentLikeFn = useAsyncFn(updateCommentLike)

  const isUserComment =
    (!isEmpty(user) && user?.username?.toLowerCase()) ===
    (!isEmpty(loggedInUser) && loggedInUser?.username?.toLowerCase())

  const childComments = getReplies(id)

  const onCommentReply = (message: string) => {
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
      .then((comments: CommentsObj[]) => {
        setIsReplying(false)
        refreshLocalComments(comments)
      })
  }

  const onCommentUpdate = (message: string) => {
    return updateCommentFn
      .execute({
        collection: video.collection,
        _id: video._id,
        commentId: id,
        message,
        user: {
          username: loggedInUser.username
        }
      })
      .then((comment: CommentsObj[]) => {
        setIsEditing(false)
        refreshLocalComments(comment)
      })
  }

  const onCommentDelete = () => {
    return deleteCommentFn
      .execute({
        collection: video.collection,
        _id: video._id,
        commentId: id,
        user: {
          username: loggedInUser.username
        }
      })
      .then(refreshLocalComments)
  }

  const onToggleCommentLike = () => {
    return toggleCommentLikeFn
      .execute({
        collection: video.collection,
        _id: video._id,
        commentId: id,
        user: {
          username: loggedInUser.username
        }
      })
      .then(refreshLocalComments)
  }
  const isLikedByLoggedInUser = likes?.includes(loggedInUser?.username)
  const userNotLoggedIn = isEmpty(loggedInUser)

  const TooltipText = ({ text }: { text: string }) => {
    return (
      <>
        <Typography>
          <u
            style={{
              cursor: 'pointer'
            }}
            onClick={() =>
              navigate(LOGIN_URL, {
                state: {
                  isLoginPage: false
                }
              })
            }
          >
            Create an Account
          </u>
          /
          <u
            style={{
              cursor: 'pointer'
            }}
            onClick={() =>
              navigate(LOGIN_URL, {
                state: {
                  isLoginPage: true
                }
              })
            }
          >
            Log In
          </u>{' '}
          {text}
        </Typography>
      </>
    )
  }
  return (
    <>
      <Card data-cy={`${isRoot}-comment-${index}`}>
        <CardHeader
          data-cy={`comment-header-${index}`}
          title={user?.username}
          subheader={dateFormatter.format(new Date(createdAt))}
        />
        <CardContent sx={{ paddingTop: 0 }}>
          {isEditing ? (
            <CommentForm
              autoFocus
              initialValue={message}
              onSubmit={onCommentUpdate}
              loading={updateCommentFn.loading}
              error={updateCommentFn.error}
              isDisabled={userNotLoggedIn}
            />
          ) : (
            <Typography>{message}</Typography>
          )}
        </CardContent>
        <CardActions disableSpacing>
          <ActionButton
            onClick={onToggleCommentLike}
            tooltipTitle={userNotLoggedIn && <TooltipText text="to Like" />}
            disabled={toggleCommentLikeFn.loading || userNotLoggedIn}
            data-cy={`favorite-icon-${index}${
              isLikedByLoggedInUser ? '-isActive' : ''
            }`}
            Icon={
              isLikedByLoggedInUser ? FavoriteIcon : FavoriteBorderOutlinedIcon
            }
            isActive={isLikedByLoggedInUser}
          >
            {likes.length}
          </ActionButton>
          {isUserComment && (
            <ActionButton
              onClick={() => setIsEditing((prev) => !prev)}
              isActive={isEditing}
              data-cy={`edit-icon-${index}`}
              Icon={EditIcon}
            />
          )}
          <ActionButton
            onClick={() => setIsReplying((prev) => !prev)}
            isActive={isReplying}
            data-cy={`reply-icon-${index}`}
            Icon={ReplyIcon}
            tooltipTitle={userNotLoggedIn && <TooltipText text="to Reply" />}
            disabled={userNotLoggedIn}
          />
          {isUserComment && (
            <ActionButton
              color="error"
              data-cy={`delete-icon-${index}`}
              Icon={DeleteIcon}
              disabled={deleteCommentFn.loading}
              onClick={onCommentDelete}
            />
          )}
        </CardActions>
        {deleteCommentFn.error && (
          <Typography variant="subtitle1" ml={2} color="red">
            {deleteCommentFn.error}
          </Typography>
        )}
      </Card>
      {isReplying && (
        <Grid mt={1} ml={3}>
          <CommentForm
            autoFocus
            onSubmit={onCommentReply}
            loading={createCommentFn.loading}
            error={createCommentFn.error}
            initialValue=""
            isDisabled={userNotLoggedIn}
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
export default Comment
