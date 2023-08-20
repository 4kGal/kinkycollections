import React from 'react'
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import EditIcon from '@mui/icons-material/EditOutlined'
import ReplyIcon from '@mui/icons-material/Reply'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAuthContext } from '../hooks/useAuthContext'

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

  console.log(user.username, loggedInUser.username)
  const isUserComment =
    user.username.toLowerCase() === loggedInUser?.username.toLowerCase()
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  })

  return (
    <Card data-cy={`${isRoot}-comment-${index}`}>
      <CardHeader
        data-cy={`comment-header-${index}`}
        title={user.username}
        subheader={dateFormatter.format(Date.parse(createdAt))}
      />
      <CardContent sx={{ paddingTop: 0 }}>
        <Typography>{message}</Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton data-cy={`favorite-icon-${index}`}>
          <Typography variant="subtitle2">
            <FavoriteIcon />
            {likes}
          </Typography>
        </IconButton>
        {isUserComment && (
          <IconButton data-cy={`edit-icon-${index}`}>
            <EditIcon />
          </IconButton>
        )}
        <IconButton data-cy={`reply-icon-${index}`}>
          <ReplyIcon />
        </IconButton>
        {isUserComment && (
          <IconButton data-cy={`delete-icon-${index}`}>
            <DeleteIcon />
          </IconButton>
        )}
      </CardActions>
    </Card>
  )
}
