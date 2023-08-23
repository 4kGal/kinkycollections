import React, { useState } from 'react'
import { Button, Grid, TextField } from '@mui/material'

interface CommentFormProp {
  loading: boolean
  error: string | undefined
  onSubmit: (message: string) => Promise<string>
  autoFocus: boolean
  initialValue: string
  isDisabled: boolean
}
export const CommentForm = ({
  loading,
  error,
  onSubmit,
  autoFocus = false,
  initialValue = '',
  isDisabled
}: CommentFormProp) => {
  const [message, setMessage] = useState(initialValue)

  const handleSubmit = () => {
    onSubmit(message).then(() => setMessage(''))
  }

  return (
    <>
      <Grid container>
        <Grid item xs={6} pl={1}>
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
            disabled={isDisabled || loading || message.length === 0}
            onClick={handleSubmit}
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
