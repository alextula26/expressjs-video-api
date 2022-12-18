export type CreatePostModel = {
  title: string
  shortDescription: string
  content: string
  blogId: string
}

export type CreatePostForBlogModel = {
  title: string
  shortDescription: string
  content: string
}

export type CreateCommentsForPostModel = {
  content: string
}
