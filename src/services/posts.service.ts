import { UserNotFoundException } from "@/errors/user-not-found.exception";
import { prisma } from "@/libs/prisma";
import { Post } from "@/models/post.model";
import { CreatePostParams } from "@/types/post";

export class PostsService {
  public async getAll() {
    return prisma.post.findMany();
  }

  public async getById(fields: { postId: string }) {
    return prisma.post.findUnique({
      where: {
        id: fields.postId
      }
    });
  }

  /**
   * Create a new User
   */
  public async create(fields: CreatePostParams): Promise<Post> {
    const { data } = fields;
    const userFound = await prisma.users.findUnique({
      where: { id: data.authorId }
    });

    if (!userFound) throw new UserNotFoundException();

    const newPost = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        authorId: data.authorId
      }
    });

    return newPost;
  }
}
