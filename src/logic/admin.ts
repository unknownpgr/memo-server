import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function listUsers() {
  return prisma.user.findMany();
}
