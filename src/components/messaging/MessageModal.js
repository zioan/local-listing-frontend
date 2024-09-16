import React, { useState, useEffect, useRef } from "react";
import Modal from "../shared/Modal";
import { useAuth } from "../../context/AuthContext";
import useMessages from "../../hooks/useMessages";

const MessageModal = ({ isOpen, onClose, listingId, listingTitle }) => {
  const { user } = useAuth();
  const { conversations, messages, loading, error, fetchConversations, fetchMessages, sendMessage, createConversation, fetchIncomingMessages } =
    useMessages();
  const [currentConversation, setCurrentConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
      if (listingId) {
        fetchIncomingMessages(listingId);
      }
    }
  }, [isOpen, fetchConversations, fetchIncomingMessages, listingId]);

  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation.id);
      const pollInterval = setInterval(() => {
        fetchMessages(currentConversation.id);
      }, 5000); // Poll every 5 seconds

      return () => clearInterval(pollInterval);
    }
  }, [currentConversation, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    setIsSending(true);
    setSendError(null);
    try {
      let conversationId;
      if (!currentConversation) {
        const newConversation = await createConversation(listingId);
        setCurrentConversation(newConversation);
        conversationId = newConversation.id;
      } else {
        conversationId = currentConversation.id;
      }
      await sendMessage(conversationId, newMessage);
      setNewMessage("");
      await fetchMessages(conversationId);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      setSendError("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Messages - ${listingTitle}`}>
      <div className="flex h-96">
        <div className="w-1/3 overflow-y-auto border-r">
          <h3 className="p-2 mb-2 text-lg font-semibold">Conversations</h3>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${currentConversation?.id === conv.id ? "bg-gray-200" : ""}`}
              onClick={() => setCurrentConversation(conv)}
            >
              {conv.listing.title}
            </div>
          ))}
        </div>
        <div className="flex flex-col w-2/3">
          <div className="flex-1 p-4 overflow-y-auto">
            {loading && <p className="text-center text-gray-500">Loading messages...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 p-2 rounded-lg ${message.sender.username === user.username ? "bg-blue-100 ml-auto" : "bg-gray-100"}`}
              >
                <p className="text-sm font-semibold">{message.sender.username}</p>
                <p>{message.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex flex-col">
              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                  disabled={isSending}
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                  disabled={isSending}
                >
                  {isSending ? "Sending..." : "Send"}
                </button>
              </div>
              {sendError && <p className="mt-2 text-red-500">{sendError}</p>}
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default MessageModal;
