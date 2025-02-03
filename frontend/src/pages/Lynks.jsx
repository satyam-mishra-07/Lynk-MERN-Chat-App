import React, { useEffect } from "react";
import { useLynkStore } from "../store/useLynkStore.js";

export default function Lynks() {
  const {
    myLynk,
    getLynkRequests,
    getSentLynkRequests,
    removeLynk,
    getLynks,
  } = useLynkStore();

  useEffect(() => {
    getLynkRequests();
    getSentLynkRequests();
    getLynks();
  }, []);

  const handleRemoveLynk = async (lynkId) => {
    await removeLynk(lynkId);
    await getLynkRequests();
    await getSentLynkRequests();
  };

  return (
    <div className="min-h-screen pt-20">
      {myLynk?.length === 0 ? (
        <div className="text-center flex justify-center items-center text-lg my-10">
          No Lynks yet
        </div>
      ) : (
        myLynk?.map((user) => (
          <div
            key={user._id}
            className="border border-secondary rounded-full p-3 my-5 flex justify-between items-center px-5"
          >
            <div className="flex gap-7 justify-start items-center">
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                  />
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="text-lg font-semibold">{user.fullName}</div>
                <div className="text-sm">{user.username}</div>
              </div>
            </div>
            <button
              className="btn btn-circle btn-outline"
              onClick={() => handleRemoveLynk(user._id)} // Handle removing the lynk
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.181 8.68a4.503 4.503 0 0 1 1.903 6.405m-9.768-2.782L3.56 14.06a4.5 4.5 0 0 0 6.364 6.365l3.129-3.129m5.614-5.615 1.757-1.757a4.5 4.5 0 0 0-6.364-6.365l-4.5 4.5c-.258.26-.479.541-.661.84m1.903 6.405a4.495 4.495 0 0 1-1.242-.88 4.483 4.483 0 0 1-1.062-1.683m6.587 2.345 5.907 5.907m-5.907-5.907L8.898 8.898M2.991 2.99 8.898 8.9"
                />
              </svg>
            </button>
          </div>
        ))
      )}
    </div>
  );
}
