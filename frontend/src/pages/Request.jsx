import React, { useEffect } from "react";
import { useLynkStore } from "../store/useLynkStore.js";
import { Loader } from "lucide-react";

export default function Request() {
  const {
    lynkRequest,
    isGettingRequests,
    getLynkRequests,
    acceptLynkRequest,
    rejectLynkRequest,
  } = useLynkStore();

  useEffect(() => {
    getLynkRequests();
  }, []);

  

  const handleAcceptRequest = async (senderID) => {
    await acceptLynkRequest(senderID);
    await getLynkRequests();
  };

  const handleRejectRequest = async (senderID) => {
    await rejectLynkRequest(senderID);
    await getLynkRequests();
  };

  return (
    <div className="min-h-screen pt-20">
      {isGettingRequests ? (
        <div className="min-h-screen flex justify-center items-center">
          <Loader className="w-10 h-10 animate-spin" />
        </div>
      ) : lynkRequest?.length === 0 ? (
        <div className="text-center flex justify-center items-center text-lg my-10">
          No Lynks Requests
        </div>
      ) : (
        lynkRequest?.map((user) => (
          <div
            key={user._id}
            className="border border-secondary rounded-full p-3 my-5 flex justify-between items-center px-5"
          >
            <div className="flex gap-7 justify-start items-center">
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img
                    src={user.senderID.profilePic || "/avatar.png"}
                    alt={user.fullName}
                  />
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="text-lg font-semibold">
                  {user.senderID.fullName}
                </div>
                <div className="text-sm">{user.senderID.username}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-circle btn-outline"
                onClick={() => handleAcceptRequest(user.senderID._id)}
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
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </button>
              <button
                className="btn btn-circle btn-outline"
                onClick={() => handleRejectRequest(user._id)}
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
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
