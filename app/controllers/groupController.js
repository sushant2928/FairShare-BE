const { PrismaClient } = require("@prisma/client");
const { minimizeTransactions } = require("../utils/minimizeTransactions");
const prisma = new PrismaClient();

exports.createGroup = async (req, res) => {
  const { name, description, uid } = req.body;
  const user = await prisma.user.findUnique({
    where: { uid },
  });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  try {
    const group = await prisma.group.create({
      data: {
        name,
        description,
        members: {
          create: {
            uid,
            balance: 0,
          },
        },
      },
    });
    res.status(201).json(group);
  } catch (err) {
    console.log("🚀 ~ err:", err?.message);
    console.log("🚀 ~ exports.createGroup= ~ err:", err);
    res.status(500).json({ message: "Error creating group" });
  } finally {
    prisma.$disconnect();
  }
};

exports.getGroups = async (req, res) => {
  const uid = req.body.uid; // Assuming the user ID is in `req.body`

  try {
    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: {
            uid, // Ensure the user is a member of the group
          },
        },
      },
      include: {
        members: {
          select: {
            uid: true,
            balance: true, // Include balances of all members in the group
          },
        },
      },
    });

    // Calculate the balance specifically for the provided uid
    const result = groups.map((group) => {
      // Get the `balance` for this user in the group
      const balance =
        group.members.find((member) => member.uid === uid)?.balance || 0;
      delete group.members;
      return {
        ...group,
        balance, // Include the user's specific balance in the group
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.log("🚀 ~ err:", err?.message);
    res.status(500).json({ message: "Error fetching groups" });
  } finally {
    prisma.$disconnect();
  }
};

exports.getGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await prisma.group.findUnique({
      where: {
        id: Number(groupId),
      },
      include: {
        members: true,
        expenses: true,
      },
    });

    res.status(200).json(group);
  } catch (err) {
    console.log("🚀 ~ err:", err?.message);
    res.status(500).json({ message: "Error fetching group" });
  } finally {
    prisma.$disconnect();
  }
};

exports.getGroupMembers = async (req, res) => {
  const { groupId } = req.params;

  try {
    const members = await prisma.groupUser.findMany({
      where: { groupId: Number(groupId) },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      }, // Find members by group ID
    });

    if (members.length === 0) {
      res.status(404).json({ message: "No members found for this group" });
    } else {
      // Minimize transactions
      const transactions = minimizeTransactions(members);
      res.status(200).json({ members, transactions });
    }
  } catch (err) {
    console.error("Error fetching group members:", err);
    res.status(500).json({ message: "Error fetching group members" });
  } finally {
    prisma.$disconnect();
  }
};

exports.getGroupExpenses = async (req, res) => {
  const { groupId } = req.params;
  try {
    const expenses = await prisma.expense.findMany({
      where: { groupId: Number(groupId) },
      // include: {
      //   payer: true,
      //   ExpenseSplit: {
      //     include: {
      //       user: true,
      //     },
      //   },
      // },
    });
    if (expenses.length === 0) {
      res.status(404).json({ message: "No expenses found for this group" });
    } else {
      res.status(200).json(expenses);
    }
  } catch (err) {
    console.log("🚀 ~ err:", err?.message);
    res.status(500).json("Error fetching group expenses");
  } finally {
    prisma.$disconnect();
  }
};

exports.addUserToGroup = async (req, res) => {
  let { groupId, memberIds } = req.body;
  groupId = Number(groupId);

  try {
    // Check if the group exists
    const group = await prisma.group.findUnique({
      where: { id: Number(groupId) },
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // for (let id of memberIds) {
    //   // Check if the user is already in the group
    //   const existingGroupUser = await prisma.groupUser.findUnique({
    //     where: {
    //       uid_groupId: {
    //         uid: id,
    //         groupId,
    //       },
    //     },
    //     include: {
    //       user,
    //     },
    //   });

    //   if (existingGroupUser) {
    //     return res.status(400).json({
    //       message: `${existingGroupUser?.user?.name} is already in the group`,
    //     });
    //   }
    // }
    const membersToAdd = memberIds.map((uid) => ({
      groupId,
      uid,
      balance: 0,
    }));
    // Add the user to the group
    const groupUser = await prisma.groupUser.createMany({
      data: membersToAdd,
      skipDuplicates: true,
    });
    if (groupUser?.count) {
      res.status(201).json({
        message: `${membersToAdd.length} Members added to the group`,
        groupUser,
      });
    } else throw new Error("No member added!");
  } catch (err) {
    console.log("🚀 ~ err:", err?.message);
    res.status(500).json({
      message: "Error adding member to the group",
      error: err.message,
    });
  } finally {
    prisma.$disconnect();
  }
};

exports.deleteGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await prisma.group.delete({
      where: {
        id: Number(groupId),
      },
    });

    res.status(200).json(group);
  } catch (err) {
    console.log("🚀 ~ err:", err?.message);
    res.status(500).json({ message: "Error fetching group" });
  } finally {
    prisma.$disconnect();
  }
};
