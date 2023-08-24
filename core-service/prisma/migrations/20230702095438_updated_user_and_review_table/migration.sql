/*
  Warnings:

  - You are about to alter the column `seatPrice` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(9,2)`.
  - A unique constraint covering the columns `[reviewerId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reviewerId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "seatPrice" SET DATA TYPE DECIMAL(9,2);

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "reviewerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isGoogleUser" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Review_reviewerId_key" ON "Review"("reviewerId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
