import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Loader } from "lucide-react";
import { useLynkStore } from "../store/useLynkStore.js";

export default function Search() {
  const { searchResults, isSearching, search, authUser } = useAuthStore();
  const {
    lynkRequest,
    lynkSent,
    sendLynkRequest,
    getLynkRequests,
    getSentLynkRequests,
    acceptLynkRequest,
    rejectLynkRequest,
    cancelLynkRequest,
    removeLynk,
  } = useLynkStore();
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    search(query, 1);
    getLynkRequests();
    getSentLynkRequests();
  }, []);

  useEffect(() => {
    search(query, currentPage);
  }, [query, currentPage, search, lynkRequest, authUser, lynkSent]);

  const pages = searchResults?.totalPages || 1;

  const handleSearch = async (e) => {
    e.preventDefault();
    await search(query, 1);
    setCurrentPage(1);
  };

  const handlePageChange = async (page) => {
    setCurrentPage(page);
    await search(query, page);
  };

  const handleSendRequest = async (receiverID) => {
    await sendLynkRequest(receiverID);
    await getSentLynkRequests();
  };

  const handleAcceptRequest = async (senderID) => {
    await acceptLynkRequest(senderID);
    await getLynkRequests();
  };

  const handleRejectRequest = async (senderID) => {
    await rejectLynkRequest(senderID);
    await getLynkRequests();
  };

  const handleCancelRequest = async (receiverID) => {
    await cancelLynkRequest(receiverID);
    await getSentLynkRequests();
  };

  const handleRemoveLynk = async (lynkId) => {
    await removeLynk(lynkId);
    await getLynkRequests();
    await getSentLynkRequests();
  };

  return (
    <>
      <div className="min-h-screen pb-20 container mx-auto px-4 pt-20 max-w-5xl">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              console.log(query);
            }}
            placeholder="Search"
          />
          <button
            type="button"
            className="btn btn-ghost btn-sm p-1.5"
            onClick={handleSearch}
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </label>

        <div>
          {isSearching ? (
            <div className="min-h-screen flex justify-center items-center">
              <Loader className="w-10 h-10 animate-spin" />
            </div>
          ) : searchResults?.users?.length === 0 ? (
            <div className="text-center flex justify-center items-center text-lg my-10">
              No results found
            </div>
          ) : (
            searchResults?.users?.map((user) => (
              <div className="border border-secondary rounded-full p-3 my-5 flex justify-between items-center px-5">
                <div
                  className="flex gap-7 justify-start items-center"
                  key={user._id}
                >
                  <div className="avatar">
                    <div className="w-24 rounded-full">
                      <img src={user.profilePic || "/avatar.png"} />
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="text-lg font-semibold">{user.fullName}</div>
                    <div className="text-sm">{user.username}</div>
                  </div>
                </div>
                {authUser.lynks.includes(user._id) ? (
                  <button
                    className="btn btn-circle btn-outline"
                    onClick={() => handleRemoveLynk(user._id)}
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
                ) : lynkRequest.some(
                    (request) =>
                      request.senderID && request.senderID._id === user._id
                  ) ? (
                  <div className="flex gap-2">
                    <button
                      className="btn btn-circle btn-outline"
                      onClick={() => handleAcceptRequest(user._id)}
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
                ) : lynkSent.some(
                    (request) =>
                      request.receiverID && request.receiverID._id === user._id
                  ) ? (
                  <button
                    className="btn btn-circle btn-outline"
                    onClick={() => handleCancelRequest(user._id)}
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
                ) : (
                  <button
                    className="btn btn-circle btn-outline"
                    onClick={() => handleSendRequest(user._id)}
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
                        d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {searchResults?.users?.length > 0 && (
          <div className="join flex justify-center items-end gap-1">
            {Array.from({ length: pages }, (_, index) => (
              <input
                key={index + 1}
                className="join-item btn btn-square"
                type="radio"
                name="options"
                aria-label={index + 1}
                checked={currentPage === index + 1}
                onChange={() => handlePageChange(index + 1)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
