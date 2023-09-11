import React, { createContext, useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getVideo } from '../services/videos'
import { useAsync } from '../hooks/useAsync'
import { orderBy, isEmpty } from 'lodash'

export const PlayerContext = createContext()

export const PlayerProvider = ({ children }) => {
  const { id: _id, collection } = useParams()

  const {
    loading,
    error,
    value: video
  } = useAsync(() => getVideo(collection, _id), [_id])

  const [comments, setComments] = useState(video?.comments ?? [])
  const [sort, setSort] = useState(false)

  const commentsByParentId = useMemo(() => {
    const group = {}

    const commentsState = orderBy(
      Object.assign({}, comments),
      [(o) => (!sort ? new Date(o.createdAt) : o.likes.length)],
      ['desc']
    )

    commentsState.forEach((comment) => {
      group[comment.parentId] ||= []
      group[comment.parentId].push(comment)
    })
    return group
  }, [comments, sort])

  function getReplies(parentId) {
    return commentsByParentId[parentId]
  }

  useEffect(() => {
    if (isEmpty(video?.comments)) return
    setComments(video?.comments)
  }, [video?.comments])

  const refreshLocalComments = (newComments) => {
    setComments(newComments)
  }

  return (
    <PlayerContext.Provider
      value={{
        video: { _id, collection, ...video },
        getReplies,
        rootComments: commentsByParentId.null,
        refreshLocalComments,
        sort,
        handleSetSort: () => setSort((prevSort) => !prevSort),
        comments
      }}
    >
      {loading ? <h1>Loading</h1> : error ? <h1>{error}</h1> : children}
    </PlayerContext.Provider>
  )
}
