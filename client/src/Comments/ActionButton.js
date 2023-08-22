import { IconButton, Tooltip } from '@mui/material'
import React from 'react'

export function ActionButton({
  Icon,
  isActive,
  color = 'initial',
  children,
  tooltipTitle = '',
  ...props
}) {
  return (
    <Tooltip title={tooltipTitle} placement="top">
      <div>
        <IconButton mr={children !== null ? 1 : 'initial'} {...props}>
          <Icon color={isActive ? 'primary' : color} />
          {children}
        </IconButton>
      </div>
    </Tooltip>
  )
}
