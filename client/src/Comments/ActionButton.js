import { IconButton } from '@mui/material'
import React from 'react'

export function ActionButton({
  Icon,
  isActive,
  color = 'initial',
  children,
  ...props
}) {
  return (
    <IconButton mr={children !== null ? 1 : 'initial'} {...props}>
      <Icon color={isActive ? 'primary' : color} />
      {children}
    </IconButton>
  )
}
