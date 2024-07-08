import e, { Request, Response } from "express";
import prisma from "../../db/prisma";

export const getUserOrgs = async (req: Request, res: Response) => {
  const userId = req.userId;
  console.log(userId);
  try {
    const organizations = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        organizations: {
          select: {
            name: true,
            orgId: true,
            description: true,
          },
        },
      },
    });

    if (!organizations) {
      return res.status(404).json({
        status: "Not found",
        message: "Organizations not found",
        statusCode: 404,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Organizations found",
      data: organizations,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      statusCode: 500,
    });
  }
};

export const getOrg = async (req: Request, res: Response) => {
  const { orgId } = req.params;
  const userId = req.userId;
  try {
    const organization = await prisma.organization.findUnique({
      where: {
        orgId,
      },
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
    });

    if (!organization) {
      return res.status(404).json({
        status: "Not found",
        message: "Organization not found",
        statusCode: 404,
      });
    }

    if (!organization.users.some((user) => user.userId === userId)) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You are not a member of this organization",
        statusCode: 403,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Organization found",
      data: {
        orgId: organization.orgId,
        name: organization.name,
        description: organization.description,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      statusCode: 500,
    });
  }
};

export const createOrg = async (req: Request, res: Response) => {
  const userId = req.userId;

  // get the user
  const user = (await prisma.user.findUnique({
    where: {
      userId,
    },
  })) as any;

  // create the organization
  try {
    const organization = await prisma.organization.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        users: {
          connect: {
            userId: user.userId,
          },
        },
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Organization created successfully",
      data: {
        orgId: organization.orgId,
        name: organization.name,
        description: organization.description,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "Bad request",
      message: "Client error",
      statusCode: 400,
    });
  }
};

export const addUserToOrg = async (req: Request, res: Response) => {
  const { orgId } = req.params;
  const { userId } = req.body;
  try {
    // check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "Not found",
        message: "User not found",
        statusCode: 404,
      });
    }

    // get the organization
    const organization = await prisma.organization.findUnique({
      where: {
        orgId,
      },
      select: {
        users: {
          select: {
            userId: true,
          },
        },
      },
    });

    // check if the organization exists
    if (!organization) {
      return res.status(404).json({
        status: "Not found",
        message: "Organization not found",
        statusCode: 404,
      });
    }

    // check if the userId is part of the organization
    if (organization.users.some((user) => user.userId === userId)) {
      return res.status(400).json({
        status: "Bad request",
        message: "User already in organization",
        statusCode: 400,
      });
    }

    // add the user to the organization
    await prisma.organization.update({
      where: {
        orgId,
      },
      data: {
        users: {
          connect: {
            userId,
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      message: "User added to organization successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Could not add user to organization",
      statusCode: 400,
    });
  }
};
