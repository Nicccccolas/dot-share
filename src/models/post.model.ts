export interface Post {
  id?: string
  title: string
  content?: string | null
  imageUrl?: string | null
  communityId?: string | null
  categoryId?: string | null
  authorId: string
  createdAt?: Date
  updatedAt?: Date
}
