import React, { useEffect } from "react";
import { useLynkStore } from "../store/useLynkStore.js";

export default function Lynks() {
  const {
    myLynk,
    removeLynk,
    getLynks,
  } = useLynkStore();

  useEffect(() => {
    getLynks();
  }, []);

  useEffect(() => {
    getLynks();
  }, [myLynk]);

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
                  d="M13.181 8.68a4.503 4.503 0 0 1 1.903 6.405m-9.768-2.782L3.56 14.06a4.5 4.5 0 0 0 6.364 6.365l3.129-3.129m5.614-5.615 1.757-1.757a4.5 4.5 0 0 0-6.364-6.365l-4.5 4.5c-.258.26-.479.541-.661.84m1.903 6.405a4.495 4.495 0 0 1-1.242-.88 4.483 4.483 0 0 1-1.062-1.683m6.587 2.345 5.907 5.907m-5.907-5.907L8.898 8.898M2.991 2.99 8.898 8.9m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"/><path d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"/><line x1="8" x2="8" y1="2" y2="5"/><line x1="2" x2="5" y1="8" y2="8"/><line x1="16" x2="16" y1="19" y2="22"/><line x1="19" x2="22" y1="16" y2="16"
                />
              </svg>
            </button>
          </div>
        ))
      )}
    </div>
  );
}
