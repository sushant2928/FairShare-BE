-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_payerId_fkey";

-- DropForeignKey
ALTER TABLE "ExpenseSplit" DROP CONSTRAINT "ExpenseSplit_uid_fkey";

-- DropForeignKey
ALTER TABLE "GroupUser" DROP CONSTRAINT "GroupUser_uid_fkey";

-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "payerId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ExpenseSplit" ALTER COLUMN "uid" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "GroupUser" ALTER COLUMN "uid" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "GroupUser" ADD CONSTRAINT "GroupUser_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseSplit" ADD CONSTRAINT "ExpenseSplit_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
