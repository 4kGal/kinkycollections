type MetaDataKeys = Record<
  string,
  string | number | string[] | boolean | undefined
>

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
