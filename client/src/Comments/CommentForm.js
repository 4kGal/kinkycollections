import React, { useState } from 'react'
import { Button, Grid, TextField } from '@mui/material'

export function CommentForm({
  loading,
  error,
  onSubmit,
  autoFocus = false,
  initialValue = '',
  isDisabled
}) {
  const [message, setMessage] = useState(initialValue)

  const handleSubmit = () => {
    onSubmit(message).then(() => setMessage(''))
  }

  return (
    <>
      <Grid container>
        <Grid item xs={6} pl={1} ml={1}>
          <TextField
            fullWidth
            autoFocus={autoFocus}
            multiline
            rows={isDisabled ? 1 : 3}
            value={message}
            disabled={isDisabled || loading}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              isDisabled ? 'Create an Account or Log in to Comment' : ''
            }
            sx={{
              background: 'white',
              '& .Mui-disabled': {
                background: 'gray'
              },
              borderRadius: '4px'
            }}
            inputProps={{
              'data-cy': 'new-comment-text-area'
            }}
          />
        </Grid>
        <Grid
          item
          ml={1}
          xs={1}
          alignItems="stretch"
          style={{ display: 'flex' }}
        >
          <Button
            variant="contained"
            disabled={isDisabled || loading}
            onClick={(e) => handleSubmit(e)}
            data-cy="new-comment-submit-btn"
            sx={{
              '&.Mui-disabled': {
                background: 'gray'
              }
            }}
          >
            {loading ? 'Loading' : 'Post'}
          </Button>
        </Grid>
      </Grid>
      <div>{error}</div>
    </>
  )
}
