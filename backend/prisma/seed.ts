import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/hash";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
const password = await bcrypt.hash(
    "Admin123",
    10
  );

  await prisma.user.upsert({
    where: {
      email: "admin@saude.com"
    },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@saude.com",
      password,
      role: "ADMIN",
      height: 170,
      weight: 70,
      birthDate: new Date(),
      gender: "MALE",
      goal: "MAINTENANCE"
    }
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });