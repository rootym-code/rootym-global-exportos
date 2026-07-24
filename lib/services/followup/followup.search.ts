import prisma from "@/lib/prisma";

import { followUpInclude } from "./followup.includes";

export class FollowUpSearchService {
  async search(query: string) {
    return prisma.followUp.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            notes: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            inquiry: {
              companyName: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            inquiry: {
              contactPerson: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: followUpInclude,
      orderBy: [
        {
          scheduledAt: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });
  }

  async searchByInquiry(
    inquiryId: string,
    query: string,
  ) {
    return prisma.followUp.findMany({
      where: {
        inquiryId,
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            notes: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      include: followUpInclude,
      orderBy: {
        scheduledAt: "asc",
      },
    });
  }
}

const followUpSearchService =
  new FollowUpSearchService();

export default followUpSearchService;