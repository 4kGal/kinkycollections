import { CommentContext } from '../context/CommentContext'
import { useContext } from 'react'

export const useCommentsContext = () => {
  const context = useContext(CommentContext)
  if (!context) {
    throw Error('useCommentsContext must be used inside CommentsContext')
  }

  return context
}
