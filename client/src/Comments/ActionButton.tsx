import { IconButton, Tooltip } from '@mui/material'
import React from 'react'

interface AButton {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: any
  isActive?: boolean
  color?: string
  tooltipTitle?: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any
  onClick: () => void
  disabled?: boolean
}
const ActionButton = ({
  Icon,
  isActive,
  color = 'initial',
  children,
  tooltipTitle = '',
  ...props
}: AButton) => {
  return (
    <Tooltip title={tooltipTitle} placement="top">
      <div>
        <IconButton
          sx={{ marginRight: children !== null ? 1 : 'initial' }}
          {...props}
        >
          <Icon color={isActive ? 'primary' : color} />
          {children}
        </IconButton>
      </div>
    </Tooltip>
  )
}
export default ActionButton
