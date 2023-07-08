import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { landlordValidationSchema } from 'validationSchema/landlords';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getLandlords();
    case 'POST':
      return createLandlord();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getLandlords() {
    const data = await prisma.landlord
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'landlord'));
    return res.status(200).json(data);
  }

  async function createLandlord() {
    await landlordValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.lease?.length > 0) {
      const create_lease = body.lease;
      body.lease = {
        create: create_lease,
      };
    } else {
      delete body.lease;
    }
    if (body?.property?.length > 0) {
      const create_property = body.property;
      body.property = {
        create: create_property,
      };
    } else {
      delete body.property;
    }
    const data = await prisma.landlord.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
