import React, { createContext, useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getVideo } from '../services/videos'
import { useAsync } from '../hooks/useAsync'
import { orderBy } from 'lodash'

export const VideoPageContext = createContext({
  sort: false,
  comments: [],
  setSort: () => null
})

export function VideoPageProvider({ children }) {
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
    // TODO: TS
    const group = {}

    // if sort is false, then newest, if true then liked

    const comments = orderBy(
      Object.assign({}, state?.comments),
      [(o) => (!state.sort ? new Date(o.createdAt) : o.likes)],
      ['desc']
    )

    comments.forEach((comment) => {
      group[comment.parentId] ||= []
      group[comment.parentId].push(comment)

      //   if (comment?.parentId?.length > 0) {
      //     group[comment?.parentId] = [{ ...comment, root: false }]
      //   } else {
      //     const rootComment = Object.assign({}, comment, { root: true })
      //     group?.null?.length > 0
      //       ? group?.null?.push(rootComment)
      //       : (group.null = [rootComment])
      //   }
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

  const createLocalComment = (comments) => {
    console.log(comments)
    setState({
      ...state,
      comments
    })
  }

  function updateLocalComment(id, message) {
    setState((prevState) => {
      return {
        ...state,
        comments: prevState.comments.map((comment) => {
          if (comment.id === id) {
            return { ...comment, message }
          } else {
            return comment
          }
        })
      }
    })
  }

  const getCollection = () => collection

  return (
    <VideoPageContext.Provider
      value={{
        video: { _id, collection, ...video }, // do i need to return all this?
        getReplies,
        rootComments: commentsByParentId.null,
        createLocalComment,
        updateLocalComment,
        getCollection,
        ...state
      }}
    >
      {loading ? <h1>Loading</h1> : error ? <h1>{error}</h1> : children}
    </VideoPageContext.Provider>
  )
}
