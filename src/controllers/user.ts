import { Request, Response } from "express";
import prisma from "../../db/prisma";

export const getUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const authUserId = req.userId;

  // get all the authenticated user's organizations
  const organizations = (await prisma.user.findUnique({
    where: {
      userId: authUserId,
    },
    select: {
      organizations: {
        select: {
          name: true,
          orgId: true,
          description: true,
          users: {
            select: {
              userId: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      },
    },
  })) as any;

  // check if the requested user is in any of the organizations
  const userOrgs = organizations.organizations.filter((org: any) => {
    return org.users.some((user: any) => user.userId === userId);
  });

  if (userOrgs.length > 0) {
    return res.status(200).json({
      status: "success",
      message: "User found in organization",
      data: { ...userOrgs[0].users[0] },
    });
  }

  if (userOrgs.length === 0) {
    return res.status(404).json({
      status: "Not found",
      message: "User not found in any organization",
      statusCode: 404,
    });
  }
};
