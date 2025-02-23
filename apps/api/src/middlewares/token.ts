import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

type IUser = {
  id: number;
  userType: string;
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token:', token); // Log the token

    if (!token) throw new Error('Token is missing');

    const verifiedToken = verify(token, process.env.SECRET_JWT!);
    console.log('Verified Token:', verifiedToken); // Log the verified token

    req.user = verifiedToken as IUser;

    next();
  } catch (err) {
    console.error('Error:', err); // Log the error
    res.status(400).send({
      status: 'error',
      msg: 'Invalid or expired token',
    });
  }
};

export const checkOrganizer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user?.userType !== 'Organizer') throw new Error('Unauthorized');

    next();
  } catch (err) {
    console.error('Error:', err); // Log the error
    res.status(400).send({
      status: 'error',
      msg: 'Unauthorized',
    });
  }
};

export const checkExperience = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user?.userType !== 'Experience') throw new Error('Unauthorized');

    next();
  } catch (err) {
    console.error('Error:', err); // Log the error
    res.status(400).send({
      status: 'error',
      msg: 'Unauthorized',
    });
  }
};
