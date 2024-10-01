import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Modal from "../shared/Modal";
import { useAuth } from "../../context/AuthContext";
import useMessages from "../../hooks/useMessages";
import { appSettings } from "../../config/settings";

/**
 * MessageModal Component
 *
 * This component handles sending and receiving messages within a modal. It manages
 * conversations related to specific listings and allows users to send and view messages.
 *
 * @param {boolean} isOpen - Determines if the modal is open or not.
 * @param {function} onClose - Function to close the modal.
 * @param {number} listingId - ID of the listing for which the conversation is taking place.
 * @param {string} listingTitle - Title of the listing for message context.
 * @returns JSX.Element
 */
const MessageModal = ({ isOpen, onClose, listingId, listingTitle }) => {
  const { user } = useAuth();
  const {
    conversations,
    messages,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
    markMessagesAsRead,
    conversationUnreadCounts,
    fetchConversationUnreadCounts,
  } = useMessages();
  const [currentConversation, setCurrentConversation] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(listingTitle);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchConversations();
      fetchConversationUnreadCounts();
      if (listingId) {
        const existingConversation = conversations.find((conv) => conv.listing.id === listingId);
        if (existingConversation) {
          setCurrentConversation(existingConversation);
          setCurrentTitle(existingConversation.listing.title);
        }
      }
    }
  }, [isOpen, user, fetchConversations, fetchConversationUnreadCounts, listingId, conversations]);

  /**
   * useEffect: Fetches messages for the current conversation and periodically polls for new messages.
   * Also fetches updated unread counts for conversations.
   */
  useEffect(() => {
    if (currentConversation && user) {
      fetchMessages(currentConversation.id);
      const pollInterval = setInterval(() => {
        fetchMessages(currentConversation.id);
        fetchConversationUnreadCounts();
      }, appSettings.pollInterval); // Polling interval from appSettings
      return () => clearInterval(pollInterval);
    }
  }, [currentConversation, user, fetchMessages, fetchConversationUnreadCounts]);

  /**
   * useEffect: Scrolls to the bottom of the message list whenever new messages arrive.
   * Also marks unread messages as read if they belong to the current conversation.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (currentConversation && messages.length > 0 && user) {
      const unreadMessages = messages.filter((message) => !message.is_read && message.sender.username !== user.username);
      if (unreadMessages.length > 0) {
        markMessagesAsRead(
          currentConversation.id,
          unreadMessages.map((msg) => msg.id)
        );
      }
    }
  }, [messages, currentConversation, user, markMessagesAsRead]);

  /**
   * handleChangeConversation
   *
   * Handles switching between conversations when a new one is selected.
   *
   * @param {Object} conv - The new conversation to switch to.
   */
  const handleChangeConversation = (conv) => {
    setCurrentConversation(conv);
    setCurrentTitle(conv.listing.title);
  };

  /**
   * handleSendMessage
   *
   * Sends a new message in the current conversation or starts a new conversation
   * if one does not already exist for the listing. Handles error states and message fetching.
   *
   * @param {Event} e - The form submit event.
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !user) return;
    setIsSending(true);
    setSendError(null);
    try {
      let conversationId;
      if (!currentConversation) {
        if (!listingId) {
          throw new Error("No listing selected for new conversation");
        }
        const newConversation = await createConversation(listingId);
        setCurrentConversation(newConversation);
        conversationId = newConversation.id;
      } else {
        conversationId = currentConversation.id;
      }
      await sendMessage(conversationId, newMessage);
      setNewMessage("");
      await fetchMessages(conversationId);
      fetchConversationUnreadCounts();
    } catch (error) {
      setSendError("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  if (!user) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Messages" size="md">
        <div className="p-4 text-center">
          <p className="mb-4">Please log in to view and send messages.</p>
          <Link to="/login" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600" onClick={onClose}>
            Log In
          </Link>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={currentTitle ? currentTitle : "Messages"} size="lg">
      <div className="flex h-96">
        <div className="w-1/3 overflow-y-auto border-r">
          <h3 className="p-2 mb-2 text-lg font-semibold">Conversations</h3>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${currentConversation?.id === conv.id ? "bg-gray-200" : ""}`}
              onClick={() => handleChangeConversation(conv)}
            >
              <div className="flex items-center justify-between">
                <span>{conv.listing.title}</span>
                {conversationUnreadCounts[conv.id] > 0 && (
                  <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">{conversationUnreadCounts[conv.id]}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col w-2/3">
          <div className="flex-1 p-4 overflow-y-auto">
            {error && <p className="text-center text-red-500">{error}</p>}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 p-2 rounded-lg ${message.sender.username === user.username ? "bg-blue-100 ml-auto" : "bg-gray-100"}`}
              >
                <p className="text-sm font-semibold">{message.sender.username === user.username ? "You" : message.sender.username}</p>
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
                  disabled={isSending || (!currentConversation && !listingId)}
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 w-[100px]"
                  disabled={isSending || (!currentConversation && !listingId)}
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
