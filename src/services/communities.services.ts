import prisma from "@/config/prisma";
import { HttpStatus } from "@/enums/https-status.enum";
import ErrorApi from "@/utils/errorApi";
import { Community } from "@prisma/client";

export class CommunitiesService {
  constructor() {}

  async createCommunity(
    name: string,
    description: string,
    user: { id: string },
  ): Promise<Community> {
    const newCommunity = await prisma.community.create({
      data: {
        name,
        description,
        users: {
          create: [
            {
              userId: user.id,
            },
          ],
        },
      },
    });

    return newCommunity;
  }

  async findAllCommunities() {
    return await prisma.community.findMany();
  }

  async findCommunityById(id: number): Promise<Community> {
    const community = await prisma.community.findUnique({
      where: { id },
    });
    if (!community) {
      throw new ErrorApi(HttpStatus.NOT_FOUND, "Community not found");
    }
    return community;
  }
}
