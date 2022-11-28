  export type BlogType = {
    id: string
    name: string
    description: string
    websiteUrl: string
  }

  export type BlogsRepositoryType = {
    findAllBlogs: () => Promise<BlogType[]>
    findBlogById: (id: string) => Promise<BlogType | undefined>
    createdBlog: ({ name, description, websiteUrl }: { name: string, description: string, websiteUrl: string }) => Promise<BlogType> 
    updateBlog: (id: string, { name, description, websiteUrl }: { name: string, description: string, websiteUrl: string }) => Promise<boolean>
    deleteBlogById: (id: string) => Promise<boolean>
  }
