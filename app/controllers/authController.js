const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.register = async (req, res) => {
  const { name, email, uid } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { uid } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await prisma.user.create({
      data: { name, email, uid },
    });
    console.log(JSON.stringify({ user }));
    res.status(201).json({ user });
  } catch (err) {
    console.log("🚀 ~ err:", err);
    console.log(err?.message || "");
    res.status(500).json({ message: "Server error" });
  } finally {
    prisma.$disconnect();
  }
};

exports.login = async (req, res) => {
  const { uid } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { uid } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.log("🚀 ~ err:", err);
    console.log(JSON.stringify({ err: err.message }));
    res.status(500).json({ message: "Server error" });
  } finally {
    prisma.$disconnect();
  }
};

exports.findUser = async (req, res) => {
  const { findBy, value } = req.body;
  try {
    let user;
    if (findBy === "name" || findBy === "email") {
      user = await prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: value.toLowerCase(),
              },
            },
            {
              email: {
                contains: value.toLowerCase(),
              },
            },
          ],
        },
      });
      console.log("🚀 ~ exports.findUser= ~ user:", user);
    } else {
      user = await prisma.user.findUnique({ where: { uid: value } });
    }
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ user: Array.isArray(user) ? user : [user] });
  } catch (err) {
    console.log("🚀 ~ err:", err);
    console.log(JSON.stringify({ err: err.message }));
    res.status(500).json({ message: "Server error" });
  } finally {
    prisma.$disconnect();
  }
};
