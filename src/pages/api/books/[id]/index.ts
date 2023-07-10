import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { bookValidationSchema } from 'validationSchema/books';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.book
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getBookById();
    case 'PUT':
      return updateBookById();
    case 'DELETE':
      return deleteBookById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBookById() {
    const data = await prisma.book.findFirst(convertQueryToPrismaUtil(req.query, 'book'));
    return res.status(200).json(data);
  }

  async function updateBookById() {
    await bookValidationSchema.validate(req.body);
    const data = await prisma.book.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteBookById() {
    const data = await prisma.book.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
