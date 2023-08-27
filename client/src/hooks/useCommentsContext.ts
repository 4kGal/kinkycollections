import { CommentContext } from '../context/CommentContext'
import { useContext } from 'react'
import { isEmpty } from 'lodash'

const useCommentsContext = () => {
  const context = useContext(CommentContext)
  if (isEmpty(context)) {
    throw Error('useCommentsContext must be used inside CommentsContext')
  }

  return context
}

export default useCommentsContext
