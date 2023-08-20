import React from 'react'
import { Card, CardContent, CardHeader, Typography } from '@mui/material'

export function Comment({ id, message, user, createdAt }) {
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  })

  return (
    <Card>
      <CardHeader
        title={user.username}
        subheader={dateFormatter.format(Date.parse(createdAt))}
      />
      <CardContent sx={{ paddingTop: 0 }}>
        <Typography>{message}</Typography>
      </CardContent>
    </Card>
  )
}
