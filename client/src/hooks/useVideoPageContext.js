import { VideoPageContext } from '../context/VideoPageContext'
import { useContext } from 'react'

export const useVideoPageContext = () => {
  const context = useContext(VideoPageContext)
  if (!context) {
    throw Error('useVideoPageContext must be used inside VideoPageContext')
  }

  return context
}
