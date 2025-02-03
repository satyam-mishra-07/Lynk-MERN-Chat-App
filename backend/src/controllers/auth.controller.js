import { generateToken } from "../lib/utils.js";
import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";
import escapeRegex from "../lib/escapeRegex.js";

export const signup = async (req, res) => {
  const { fullName, username, password } = req.body;
  try {
    if (!fullName || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      fullName,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
        lynks: newUser.lynks,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log(`Error in signup controller: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userSearch = async (req, res) => {
    try {
      const userId = req.user._id;
      const { query, page = 1, limit = 10 } = req.query;
      const safeLimit = Math.min(limit, 50);
  
      const trimmedQuery = query ? query.trim() : "";
      const queryWords = trimmedQuery ? trimmedQuery.split(/\s+/) : [];
  
      let filter;
      if (queryWords.length === 0) {
        filter = { _id: { $ne: userId } };
      } else {
        filter = {
          _id: { $ne: userId },
          $or: queryWords.map((word) => ({
            $or: [
              { username: { $regex: escapeRegex(word), $options: "i" } },
              { fullName: { $regex: escapeRegex(word), $options: "i" } },
            ],
          })),
        };
      }
  
      const skipValue = (page - 1) * safeLimit;
  
      if (page < 1 || safeLimit <= 0) {
        return res.status(400).json({ message: "Invalid page or limit values" });
      }
  
      const users = await User.find(filter)
        .select("username fullName profilePic")
        .skip(skipValue)
        .limit(safeLimit);
  
      const totalUsers = await User.countDocuments(filter);
  
      res.status(200).json({
        users,
        totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / safeLimit),
      });
    } catch (error) {
      console.error("Error in userSearch controller:", error.stack);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
      lynks: user.lynks,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};