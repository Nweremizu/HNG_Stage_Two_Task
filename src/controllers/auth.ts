import { Request, Response } from "express";
import prisma from "../../db/prisma";
import TokenService from "../utils/tokenService";
import bcrypt from "bcryptjs";

export const register = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, phone } = req.body;

  // Check if the email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (existingUser) {
    return res.status(422).json({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 422,
    });
  }
  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        phone,
        organizations: {
          create: {
            name: `${firstName}'s Organization`,
            description: `Default organization for ${firstName}`,
          },
        },
      },
    });

    const token = TokenService.generateToken({ id: user.userId });
    return res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 400,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(401).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }

  const token = TokenService.generateToken({ id: user.userId });
  return res.status(200).json({
    status: "success",
    message: "Login successful",
    data: {
      accessToken: token,
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    },
  });
};
