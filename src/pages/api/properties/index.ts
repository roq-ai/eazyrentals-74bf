import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { propertyValidationSchema } from 'validationSchema/properties';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getProperties();
    case 'POST':
      return createProperty();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getProperties() {
    const data = await prisma.property
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'property'));
    return res.status(200).json(data);
  }

  async function createProperty() {
    await propertyValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.lease?.length > 0) {
      const create_lease = body.lease;
      body.lease = {
        create: create_lease,
      };
    } else {
      delete body.lease;
    }
    const data = await prisma.property.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
