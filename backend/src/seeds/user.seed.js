import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../model/user.model.js";

config();

const seedUsers = [
  // Female Users
  {
    username: "aarti_34sharma",
    fullName: "Aarti Sharma",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    username: "neha_kumari92",
    fullName: "Neha Kumari",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    username: "pooja.dave_88",
    fullName: "Pooja Dave",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    username: "sita.sharmaX1",
    fullName: "Sita Sharma",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    username: "isha_14yadav",
    fullName: "Isha Yadav",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    username: "kavita_bhartiX7",
    fullName: "Kavita Bharti",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    username: "shivani_56singh",
    fullName: "Shivani Singh",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    username: "sunita_89prajapati",
    fullName: "Sunita Prajapati",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
  },

  // Male Users
  {
    username: "rajesh_01verma",
    fullName: "Rajesh Verma",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    username: "arvind_3gupta",
    fullName: "Arvind Gupta",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    username: "rahul_tiwari9",
    fullName: "Rahul Tiwari",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    username: "vikas_@singh88",
    fullName: "Vikas Singh",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    username: "ajay_12sharma",
    fullName: "Ajay Sharma",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    username: "sandeep.mishraX",
    fullName: "Sandeep Mishra",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    username: "sunil_9rathore",
    fullName: "Sunil Rathore",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();
