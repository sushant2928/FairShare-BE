/*
  Warnings:

  - You are about to drop the column `userId` on the `ExpenseSplit` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `GroupUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uid,groupId]` on the table `GroupUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uid` to the `ExpenseSplit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `GroupUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExpenseSplit" DROP CONSTRAINT "ExpenseSplit_userId_fkey";

-- DropForeignKey
ALTER TABLE "GroupUser" DROP CONSTRAINT "GroupUser_userId_fkey";

-- DropIndex
DROP INDEX "GroupUser_userId_groupId_key";

-- AlterTable
ALTER TABLE "ExpenseSplit" DROP COLUMN "userId",
ADD COLUMN     "uid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "GroupUser" DROP COLUMN "userId",
ADD COLUMN     "uid" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GroupUser_uid_groupId_key" ON "GroupUser"("uid", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");

-- AddForeignKey
ALTER TABLE "GroupUser" ADD CONSTRAINT "GroupUser_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseSplit" ADD CONSTRAINT "ExpenseSplit_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
