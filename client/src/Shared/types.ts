type MetaDataKeys = Record<
  string,
  string | number | string[] | boolean | undefined
>

export interface User {
  _id: string
  username: string
  password: string
  favorites: string[]
  userRoles: string
  comments: string[]
  likes: string[]
  hideUnderage: boolean
}

export interface CommentsObj {
  id: string
  message: string
  user: {
    username: string
  }
  createdAt: Date
  likes: string[]
  parentId: string
}
export interface MetaData extends MetaDataKeys {
  _id: string
  tags: string[]
  name: string
  year?: number
  customName?: string
  likes?: number
  collection: string
  actresses?: string[]
  addedDate: string
  dateUploaded: string
  title: string
  underage: boolean
  videoId: string
  views: number
  customViews?: number
  // comments?: CommentsObj[] | undefined
}

export type Comments =
  | [
      {
        id: string
        message: string
        parentId: string
        createdAt: string
        likes: number
        user: {
          id: string
          username: string
        }
      }
    ]
  | []
