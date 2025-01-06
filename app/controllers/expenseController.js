const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createExpense = async (req, res) => {
  const { description, amount, groupId, usersSplit, uid: payerId } = req.body;

  try {
    const expense = await prisma.expense.create({
      data: {
        description,
        amount,
        payerId,
        groupId,
      },
    });

    // Split the expense among users
    for (let split of usersSplit) {
      await prisma.expenseSplit.create({
        data: {
          expenseId: expense.id,
          uid: split.uid,
          share: split.share,
        },
      });
    }

    res.status(201).json(expense);
  } catch (err) {
    console.log("🚀 ~ err:", err);
    res.status(500).json({ message: "Error creating expense" });
  }
};

// exports.getExpenses = async (req, res) => {
//   const groupId = req.params.groupId;

//   try {
//     const expenses = await prisma.expense.findMany({
//       where: { groupId },
//       // include: {
//       //   payer: true,
//       //   expenseSplits: true,
//       // },
//     });

//     res.status(200).json(expenses);
//   } catch (err) {
//     console.log("🚀 ~ exports.getExpenses= ~ err:", err);
//     res.status(500).json({ message: "Error fetching expenses" });
//   }
// };
exports.getExpense = async (req, res) => {
  const { expenseId } = req.params;

  try {
    const expense = await prisma.expense.findUnique({
      where: { id: Number(expenseId) },
      include: {
        payer: true,
        ExpenseSplit: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(200).json(expense);
  } catch (err) {
    console.log("🚀 ~ exports.getExpense= ~ err:", err);
    res.status(500).json({ message: "Error fetching expenses" });
  }
};
exports.addExpense = async (req, res) => {
  const { groupId, description, amount, payerId } = req.body;

  // Validate request body
  if (!groupId || !description || !amount || !payerId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Fetch group details including members
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: { include: { user: true } } },
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    // Ensure payer is a member of the group
    const payer = group.members.find((member) => member.uid === payerId);
    if (!payer) {
      return res
        .status(400)
        .json({ error: "Payer is not a member of the group" });
    }

    const numMembers = group.members.length;
    const sharePerMember = amount / numMembers;

    // Create the expense
    const expense = await prisma.expense.create({
      data: {
        description,
        amount,
        payerId,
        groupId,
      },
    });

    // Create ExpenseSplit entries and update balances
    const expenseSplits = [];
    const updates = [];

    for (const member of group.members) {
      const share =
        member.uid === payerId ? -(amount - sharePerMember) : sharePerMember;
      console.log("🚀 ~ exports.addExpense= ~ share:", member.user.name, share);

      expenseSplits.push({
        expenseId: expense.id,
        uid: member.uid,
        share,
      });

      updates.push(
        prisma.groupUser.update({
          where: { id: member.id },
          data: {
            balance: {
              increment:
                member.uid === payerId
                  ? amount - sharePerMember
                  : -sharePerMember,
            },
          },
        })
      );
    }

    // Insert ExpenseSplits and update balances
    await prisma.expenseSplit.createMany({ data: expenseSplits });
    await prisma.$transaction(updates);

    res.status(201).json({
      message: "Expense added successfully",
      expense,
      expenseSplits,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
