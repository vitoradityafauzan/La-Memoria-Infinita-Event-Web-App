import { Request, Response } from 'express';
import prisma from '../prisma';
import { format, formatISO, isMatch } from 'date-fns';
import { Prisma } from '@prisma/client';
import { log } from 'console';
import { generateVoucherCode } from '@/middlewares/uniquecode';

const port = process.env.PORT;

// interface IEvent {
//   name: string;
//   slug: string;
//   desc: string;
//   image: string;
//   price: number;
//   amount: number;
//   locationId: number;
//   categoryId: number;
//   startDate: string;
//   endDate: string;
//   user: {
//     firstName: string;
//     lastName: string;
//     email: string;
//   };
//   category: {
//     idCategory: number;
//     name: string;
//   };
//   location: {
//     idLocation: number;
//     name: string;
//   };
// }

export class EventController {
  async getEvents(req: Request, res: Response) {
    try {
      const { search } = req.query;

      const filterCategory = req.query.category as string | undefined;
      const category = filterCategory
        ? parseInt(filterCategory, 10)
        : undefined;

      const filterLocation = req.query.location as string | undefined;
      const location = filterLocation
        ? parseInt(filterLocation, 10)
        : undefined;

      let filter: Prisma.EventWhereInput = {};

      if (search) {
        filter.name = { contains: search as string };
      }

      if (category || category != undefined) {
        filter.categoryId = category;
      }

      if (location || location != undefined) {
        filter.locationId = location;
      }

      const events = await prisma.event.findMany({
        where: filter,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          category: true,
          location: true,
        },
      });

      // const events = await prisma.event.findMany({
      //   include: {
      //     user: {
      //       select: {
      //         firstName: true,
      //         lastName: true,
      //         email: true,
      //       },
      //     },
      //     category: true,
      //     location: true,
      //   },
      // });

      res.status(200).send({
        status: 'ok',
        events,
      });
      //
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async getEventSlug(req: Request, res: Response) {
    try {
      if (req.params.slug == undefined || req.params.slug == 'undefined')
        throw 'Slug Not Recognized';

      console.log('API, getting event by slug');
      const event = await prisma.event.findFirst({
        where: { slug: req.params.slug },
        include: { category: true, location: true },
        orderBy: { createdAt: 'desc' },
      });
      console.log('API, get event by slug success');

      console.log(event);

      res.status(200).send({
        status: 'ok',
        event,
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async getEventByUser(req: Request, res: Response) {
    try {
      if (req.params.userId == undefined || req.params.userId == 'undefined')
        throw 'ID Not Recognized';

      // console.log('API, getting event by user id');
      const event = await prisma.event.findMany({
        where: { organizerId: parseInt(req.params.userId) },
        select: {
          idEvent: true,
          name: true,
        },
      });
      // console.log('API, get event by user id success');

      // console.log(event);

      res.status(200).send({
        status: 'ok',
        event,
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async getCategoryLocation(req: Request, res: Response) {
    try {
      const category = await prisma.category.findMany();

      const location = await prisma.location.findMany();

      res.status(200).send({
        status: 'ok',
        category,
        location,
      });
      //
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async createEvents(req: Request, res: Response) {
    try {
      console.log('Checking image file ....');

      if (!req.file) throw 'Image File Not Uploaded';
      console.log('Past File Check');

      const link = `http://localhost:${port}/api/public/event/${req?.file?.filename}`;
      // const link = `${req?.file?.filename}`;

      const { name, slug, desc, startDate, endDate } = req.body;

      console.log('original date = -', req.body.startDate, '-');

      console.log(
        'Checking date, ',
        isMatch(req.body.startDate, 'yyyy-MM-dd, HH:mm:ss'),
      );

      if (
        !isMatch(req.body.startDate, 'yyyy-MM-dd, HH:mm:ss') &&
        !isMatch(req.body.endDate, 'yyyy-MM-dd, HH:mm:ss')
      )
        throw 'Date And/Or Time Format Is Incorrect!';

      const locationn = parseInt(req.body.locationId);
      const pricee = parseInt(req.body.price);
      const amountt = parseInt(req.body.amount);
      const category = parseInt(req.body.categoryId);
      let organizer: number;

      if (
        req.body.organizerId == '' ||
        req.body.organizerId == null ||
        req.body.organizerId == undefined
      ) {
        organizer = 1;
      } else {
        organizer = parseInt(req.body.organizerId);
      }

      console.log(locationn, ' ', startDate, ' ', endDate, 'dsds');

      const findOccupied: { name: string }[] = await prisma.$queryRawUnsafe(
        `SELECT name FROM event WHERE locationId = ${locationn} AND (startDate <= "${startDate}" AND endDate >= "${endDate}");`,
      );

      console.log('after find occupied');

      if (!findOccupied) {
        console.log('event occupied');

        throw 'An Event Already Set At Selected Location And Time!';
      }

      console.log('after if find occupied');

      const makeEvent = await prisma.event.create({
        data: {
          name,
          slug,
          desc,
          image: link,
          price: pricee,
          amount: amountt,
          startDate: formatISO(startDate),
          endDate: formatISO(endDate),
          locationId: locationn,
          categoryId: category,
          organizerId: organizer,
          // organizerId: req.user?id!
        },
      });

      res.status(201).send({
        status: 'ok',
        msg: 'event success post',
        makeEvent,
      });
      //
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async createVoucher(req: Request, res: Response) {
    try {
      console.log(req.user?.id);

      const eventIdd: number = parseInt(req.body.eventId);
      const voucherName = req.body.voucherName;

      if (isNaN(eventIdd)) throw 'Something is wrong';

      const amountt: number = parseInt(req.body.amount);
      if (isNaN(amountt)) throw 'Something is wrong';

      const findExist = await prisma.discount.findFirst({
        where: { eventId: eventIdd },
      });

      if (findExist) throw 'Event Already Has A Discount!';

      const uniqueCode = generateVoucherCode(voucherName);

      const postPromo = await prisma.discount.create({
        data: {
          discountName: voucherName,
          uniqueCode,
          organizerId: req.user?.id,
          percentage: amountt,
          eventId: eventIdd,
        },
      });

      res.status(201).send({
        status: 'ok',
        msg: 'voucher successfully created',
        postPromo,
      });
    } catch (error) {
      res.status(400).send({
        status: 'error',
        msg: error,
      });
    }
  }

  async createReview(req: Request, res: Response) {
    try {
      console.log(req.user?.id);

      const ticketIdd: number = parseInt(req.body.eventId);
      if (isNaN(ticketIdd)) throw 'Something is wrong';

      const revieww: number = parseInt(req.body.review);
      if (isNaN(revieww)) throw 'Something is wrong';

      const findExist = await prisma.review.findFirst({
        where: {
          ticketId: ticketIdd,
          review: revieww,
        },
      });

      if (findExist) throw 'Event Already Reviewed!';

      const postReview = await prisma.review.create({
        data: {
          userId: req.user?.id,
          ticketId: ticketIdd,
          review: revieww,
        },
      });

      res.status(201).send({
        status: 'ok',
        msg: 'review posted successfully',
        postReview,
      });
    } catch (error) {
      res.status(400).send({
        status: 'error',
        msg: error,
      });
    }
  }

  async getReviewAvailable(req: Request, res: Response) {
    try {
      console.log(req.user?.id);

      const fetchReview = await prisma.review.findMany({
        where: {
          userId: req.user?.id,
        },
        select: {
          ticketId: true,
          review: true,
        },
      });

      if (!fetchReview) throw 'something is wrong';

      console.log(fetchReview);

      const setWhere: any[] = fetchReview.map((t) => t.ticketId);

      console.log(setWhere);

      const fetchTicket = await prisma.ticket.findMany({
        where: {
          id: { in: setWhere },
        },
        select: {
          eventId: true,
        },
      });

      if (!fetchTicket) throw 'something is wrong';

      const setWhere2: any[] = fetchTicket.map((t) => t.eventId);

      console.log(setWhere2);

      let availableEvent: any[] = await prisma.event.findMany({
        where: {
          idEvent: { in: setWhere2 },
        },
      });

      // console.log('after ddetch, ',availableEvent);

      // for (let i = 0; i<=availableEvent.length; i++) {
      //   // availableEvent.push({...availableEvent1[i], review: fetchReview[i].review})
      //   console.log(fetchReview[i].review);
      //   console.log(availableEvent[i]);

      //   availableEvent[i].amount = fetchReview[i].review
      // }

      // console.log('after detch, ',availableEvent);

      res.status(201).send({
        status: 'ok',
        msg: 'testing',
        // fetchUser,
        fetchTicket,
        availableEvent,
      });
    } catch (error) {
      res.status(400).send({
        status: 'error',
        msg: error,
      });
    }
  }

  async getReviewAlready(req: Request, res: Response) {
    try {
      console.log(req.user?.id);

      const fetchReview = await prisma.review.findMany({
        where: {
          userId: req.user?.id,
        },
        select: {
          ticketId: true,
        },
      });

      if (!fetchReview) throw 'something is wrong';

      console.log(fetchReview);

      const setWhere: any[] = fetchReview.map((t) => t.ticketId);

      console.log(setWhere);

      const fetchTicket = await prisma.ticket.findMany({
        where: {
          id: { notIn: setWhere },
        },
        select: {
          eventId: true,
        },
      });

      if (!fetchTicket) throw 'something is wrong';

      const setWhere2: any[] = fetchTicket.map((t) => t.eventId);

      console.log(setWhere2);

      const availableEvent = await prisma.event.findMany({
        where: {
          idEvent: { in: setWhere2 },
        },
      });

      res.status(201).send({
        status: 'ok',
        msg: 'testing',
        // fetchUser,
        fetchTicket,
        availableEvent,
      });
    } catch (error) {
      res.status(400).send({
        status: 'error',
        msg: error,
      });
    }
  }
}
