  export type PostType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
  }

  export type PostsRepositoryType = {
    findAllPosts: () => Promise<PostType[]>
    findPostById: (id: string) => Promise<PostType | undefined>
    createdPost: ({
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    }: {
      title: string,
      shortDescription: string,
      content: string,
      blogId: string,
      blogName: string,
    }) => Promise<PostType>
    updatePost: (
      id: string,
      {
        title,
        shortDescription,
        content,
        blogId,
        blogName,
      }: {
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
        blogName: string,
      }) => Promise<boolean>
    deletePostById: (id: string) => Promise<boolean>
  }