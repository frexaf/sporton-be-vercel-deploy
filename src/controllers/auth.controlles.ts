import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.models";

const JWT_SECRET = process.env.JWT_SECRET || "Sporton123";

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // check if user exist or not
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invald Credentials, Email not found" });
      return;
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invald Credentials, wrong password" });
      return;
    }

    // Generate JWT (JSON Web Token)
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signin Error : ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const initiateAdmin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Check if user data or entry is exist
    const count = await User.countDocuments({});
    if (count > 0) {
      res.status(400).json({
        message:
          "We can only have 1 admin user, if you want to create new dmin user, please delete the user in database.",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashPassword,
      name,
    });

    await newUser.save();

    res.status(201).json({ message: "Admin user created succesfully" });
  } catch (error) {
    console.error("Initiate new admin user error : ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
