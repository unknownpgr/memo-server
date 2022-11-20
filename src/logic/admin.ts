import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function listUsers() {
  return prisma.user.findMany();
}

export async function getUser({ userId }: { userId: number }) {
  return prisma.user.findUnique({ where: { id: userId } });
}
