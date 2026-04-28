import { prisma } from "@/src/prisma";

export default async function InngestDeleteFromDB(id: number) {
  const deleted = await prisma.summarizedData.delete({
    where: {
      id: id,
    },
  });

  //   return { success: true, deletedID: deleted.id };
}
