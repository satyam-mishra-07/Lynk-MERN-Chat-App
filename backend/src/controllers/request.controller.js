import mongoose from "mongoose";
import Request from "../model/request.model.js";
import User from "../model/user.model.js";

export const sendRequest = async (req, res) => {
  try {
    const { receiverID } = req.body;
    const senderID = req.user._id;

    const senderUser = await User.findById(senderID);

    // Check if sender exists
    if (!senderUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if receiver is already connected
    if (senderUser.lynks.includes(receiverID)) {
      return res.status(400).json({
        message: "Already connected with this user",
      });
    }

    if (senderID.toString() === receiverID.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot send a request to yourself" });
    }

    const existingRequest = await Request.findOne({
      $or: [
        { senderID, receiverID },
        { senderID: receiverID, receiverID: senderID },
      ],
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const newRequest = new Request({ senderID, receiverID });
    await newRequest.save();
    res.status(201).json({ message: "Request sent" });
  } catch (error) {
    console.log(`Error in sendRequest controller: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await Request.find({ receiverID: userId })
      .populate("senderID", "username fullName profilePic")
      .lean();

    const filteredRequests = requests.filter(
      (request) => request.senderID !== null
    );
    res.status(200).json(filteredRequests);
  } catch (error) {
    console.log(`Error in getRequests controller: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sentRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await Request.find({ senderID: userId })
      .populate("receiverID", "username fullName profilePic")
      .lean();

    const filteredRequests = requests.filter(
      (request) => request.receiverID !== null
    );
    res.status(200).json(filteredRequests);
  } catch (error) {
    console.log(`Error in sentRequests controller: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptRequest = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { senderID } = req.body;
      const receiverID = req.user._id;

      const existingRequest = await Request.findOne({
        senderID,
        receiverID,
      }).session(session);
      if (!existingRequest) {
        throw new Error("Request not found");
      }

      await Request.findByIdAndDelete(existingRequest._id).session(session);

      const [sender, receiver] = await Promise.all([
        User.findById(senderID).session(session),
        User.findById(receiverID).session(session),
      ]);

      if (!sender || !receiver) {
        throw new Error("User not found");
      }

      if (!sender.lynks.includes(receiverID)) sender.lynks.push(receiverID);
      if (!receiver.lynks.includes(senderID)) receiver.lynks.push(senderID);

      await sender.save({ session });
      await receiver.save({ session });
    });

    res.status(200).json({ message: "Request accepted" });
  } catch (error) {
    console.error(`Error in acceptRequest controller: ${error}`);
    res.status(500).json({ message: error.message || "Internal server error" });
  } finally {
    session.endSession();
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { senderID } = req.body;
    const receiverID = req.user._id;

    const existingRequest = await Request.findOne({ senderID, receiverID });
    if (!existingRequest) {
      return res.status(400).json({ message: "Request not found" });
    }

    await Request.findByIdAndDelete(existingRequest._id);
    res.status(200).json({ message: "Request rejected" });
  } catch (error) {
    console.error(`Error in rejectRequest controller: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const cancelRequest = async (req, res) => {
  try {
    const receiverID = req.body.receiverID;
    const senderID = req.user._id;

    const existingRequest = await Request.findOne({ senderID, receiverID });
    if (!existingRequest) {
      return res.status(400).json({ message: "Request not found" });
    }

    await Request.findByIdAndDelete(existingRequest._id);
    res.status(200).json({ message: "Request cancelled" });
  } catch (error) {
    console.log(`Error in cancelRequest controller: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeLynk = async (req, res) => {
  try {
    const lynkId = req.body.lynkId;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const lynkUser = await User.findById(lynkId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!lynkUser) {
      return res.status(400).json({ message: "LynkUser not found" });
    }

    if (!user.lynks.includes(lynkId) || !lynkUser.lynks.includes(userId)) {
      return res.status(400).json({ message: "Lynk not found" });
    }

    // Convert IDs to string for accurate comparison
    user.lynks = user.lynks.filter((lynk) => lynk.toString() !== lynkId);
    lynkUser.lynks = lynkUser.lynks.filter((id) => id.toString() !== userId.toString());

    await user.save();
    await lynkUser.save();

    res.status(200).json({ message: "Lynk removed" });
  } catch (error) {
    console.log(`Error in removeLynk controller: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLynks = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const lynkDetails = await User.find({
      _id: { $in: user.lynks }
    }).select("username fullName profilePic");

    res.status(200).json(lynkDetails);
  } catch (error) {
    console.log(`Error in getLynks controller: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
