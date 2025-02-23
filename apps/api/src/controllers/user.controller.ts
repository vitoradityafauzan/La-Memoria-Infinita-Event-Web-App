import prisma from '@/prisma';
import { Request, Response } from 'express';
import { compare, genSalt, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { transporter } from '../helpers/nodemailer';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import generateReferralCode from '@/middlewares/uniquecode';

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        phone,
        userType,
        referral,
      } = req.body;

      // Check if the email is already used
      const existingUser = await prisma.user.findUnique({
        where: { email: email },
      });

      if (existingUser) {
        return res.status(400).send({
          status: 'error',
          msg: 'Email has already been used!',
        });
      }

      let referralOwnerName: string | null = null;
      let referrerId: number | null = null;

      // Hash the password
      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      // Generate a new unique code for the user
      const referralCode = await generateReferralCode(firstName);

      let user; // Declare user here so it is accessible in all blocks

      if (referral) {
        // Validate referral code if provided
        const existingUsedReferralCode = await prisma.user.findFirst({
          where: { referralCode },
        });

        if (!existingUsedReferralCode) {
          return res.status(400).send({
            status: 'error',
            msg: 'Referral code is invalid!',
          });
        }

        referralOwnerName = `${existingUsedReferralCode.firstName} ${existingUsedReferralCode.lastName}`;
        referrerId = existingUsedReferralCode.idUser;

        // Create the new user with referral code
        user = await prisma.user.create({
          data: {
            firstName,
            lastName,
            email,
            password: hashPassword,
            phone,
            userType,
            referralCode 
          },
        });

        // Add points to the referrer and update total points
        const pointsToAward = 5000;

        await prisma.user.update({
          where: { idUser: referrerId },
          data: {
            points: {
              increment: pointsToAward, // Increment referrer's total points
            },
          },
        });

        // Record point history
        // await prisma.points.create({
        //   data: {
        //     userId: referrerId,
        //     points: pointsToAward,
        //     expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 3)), // Points expire in 3 months
        //     expired: false,
        //   },
        // });

        // Record the referral usage
        // await prisma.referralCode.create({
        //   data: {
        //     referrerId: referrerId,
        //     referredId: user.idUser,
        //   },
        // });
      } else {
        // Create the user without referral code
        user = await prisma.user.create({
          data: {
            firstName,
            lastName,
            email,
            password: hashPassword,
            phone,
            userType,
            referralCode
          },
        });
      }

      // Send verification email
      const payload = { id: user.idUser };
      const token = sign(payload, process.env.SECRET_JWT!, {
        expiresIn: '10m',
      });

      const templatePath = path.join(
        __dirname,
        '../templates',
        'verification.hbs',
      );
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({
        name: user.firstName,
        link: `http://localhost:3000/verify/${token}`,
      });

      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: user.email,
        subject: 'Welcome to CaloTiket',
        html: html,
      });

      // Send the response
      res.status(201).send({
        status: 'ok',
        msg: 'Account created successfully!',
        user,
        referralOwnerName,
      });
    } catch (err) {
      console.error(err);
      res.status(400).send({
        status: 'error',
        msg:
          err instanceof Error
            ? err.message
            : 'An error occurred while creating user.',
      });
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!existingUser) throw 'Account not found!';
      if (!existingUser.isActive) throw 'Account not verify !';

      const isValidPass = await compare(password, existingUser.password);

      if (!isValidPass) throw 'incorrect password!';

      const payload = {
        id: existingUser.idUser,
        userType: existingUser.userType,
      };
      const token = sign(payload, process.env.SECRET_JWT!, { expiresIn: '1d' });

      res.status(200).send({
        status: 'ok',
        msg: 'login success!',
        token,
        user: existingUser,
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async verifyUser(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { idUser: req.user?.id },
      });
      if (user?.isActive) throw 'invalid link';

      await prisma.user.update({
        data: { isActive: true },
        where: { idUser: req.user?.id },
      });

      res.status(200).send({
        status: 'ok',
        msg: 'success verify account !',
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const user = await prisma.user.findMany();
      res.status(200).send({
        status: 'ok',
        msg: 'Account fetched!',
        user,
      });
    } catch (err) {
      console.error(err);
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async getUserId(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { idUser: +req.params.id },
      });
      if (!user) throw 'Account not found!';
      res.status(200).send({
        status: 'ok',
        msg: 'Account fetched!',
        user,
      });
    } catch (err) {
      console.error(err);
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { firstName, lastName, phone, email, password, currentPassword } =
        req.body;
      const userId = req.user?.id;

      if (!userId) throw new Error('Account not authenticated');

      // Retrieve the current user data
      const user = await prisma.user.findUnique({ where: { idUser: userId } });
      if (!user) throw new Error('Account not found');

      // Check if the user wants to update the password
      let hashedPassword;
      if (password) {
        // Ensure the user provided the current password
        if (!currentPassword) {
          return res.status(400).send({
            status: 'error',
            msg: 'Current password is required to update the password.',
          });
        }

        // Verify the current password matches the stored password
        const isPasswordValid = await compare(currentPassword, user.password);
        if (!isPasswordValid) {
          return res.status(400).send({
            status: 'error',
            msg: 'Current password is incorrect.',
          });
        }

        // If the current password is correct, hash the new password
        hashedPassword = await hash(password, await genSalt(10));
      }

      const updatedUser = await prisma.user.update({
        where: { idUser: userId },
        data: {
          firstName,
          lastName,
          phone,
          email,
          ...(hashedPassword && { password: hashedPassword }), // Update the password if hashed
        },
      });

      res.status(200).send({
        status: 'ok',
        msg: 'Account information updated successfully!',
        user: updatedUser,
      });
    } catch (err) {
      console.error('Update Error:', err);
      res.status(400).send({
        status: 'error',
        msg: 'An error occurred while updating user information',
      });
    }
  }
}
