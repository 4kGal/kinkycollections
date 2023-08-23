import React, { createContext, useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getVideo } from '../services/videos'
import { useAsync } from '../hooks/useAsync'
import { orderBy } from 'lodash'

export const CommentContext = createContext({
  sort: false,
  comments: [],
  setSort: () => null,
  getReplies: () => [],
  refreshLocalComments: () => [],
  video: { collection: '', _id: '' }
})

export function CommentProvider({ children }) {
  const { id: _id, collection } = useParams()

  const setSort = (newSort) => {
    setState({ ...state, sort: newSort })
  }
  const [state, setState] = useState({ sort: false, setSort })

  const {
    loading,
    error,
    value: video
  } = useAsync(() => getVideo(collection, _id), [_id])

  const commentsByParentId = useMemo(() => {
    const group = {}

    const comments = orderBy(
      Object.assign({}, state?.comments),
      [(o) => (!state.sort ? new Date(o.createdAt) : o.likes.length)],
      ['desc']
    )

    comments.forEach((comment) => {
      group[comment.parentId] ||= []
      group[comment.parentId].push(comment)
    })
    return group
  }, [state?.comments, state.sort])

  function getReplies(parentId) {
    return commentsByParentId[parentId]
  }

  useEffect(() => {
    if (video?.comments === null) return
    setState({
      ...state,
      comments: video?.comments
    })
  }, [video?.comments, state.sort])

  const refreshLocalComments = (comments) => {
    setState({
      ...state,
      comments
    })
  }

  const getCollection = () => collection

  return (
    <CommentContext.Provider
      value={{
        video: { _id, collection, ...video }, // do i need to return all this?
        getReplies,
        rootComments: commentsByParentId.null,
        refreshLocalComments,
        getCollection,
        ...state
      }}
    >
      {loading ? <h1>Loading</h1> : error ? <h1>{error}</h1> : children}
    </CommentContext.Provider>
  )
}
