import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useMessages from "../../hooks/useMessages";
import { appSettings } from "../../config/settings";
import { toast } from "react-toastify";
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import MessageList from "./MessageList";
import LoadingSpinner from "../shared/LoadingSpinner";

/**
 * Messages component to handle conversations and messages for the logged-in user.
 * It manages fetching conversations, messages, sending messages, and marking messages as read.
 */
const Messages = () => {
  const { user } = useAuth();
  const location = useLocation();
  const {
    conversations,
    messages,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markMessagesAsRead,
    conversationUnreadCounts,
    fetchConversationUnreadCounts,
    createConversationFromListing,
  } = useMessages();

  const [currentConversation, setCurrentConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messageListRef = useRef(null);
  const [showConversations, setShowConversations] = useState(true);

  // Fetch conversations and unread message counts when the component mounts
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      Promise.all([fetchConversations(), fetchConversationUnreadCounts()])
        .then(() => setIsLoading(false))
        .catch((err) => {
          console.error("Error fetching initial data:", err);
          setError("Failed to load conversations. Please try again.");
          setIsLoading(false);
        });
    }
  }, [user, fetchConversations, fetchConversationUnreadCounts]);

  // Effect to handle opening a conversation from the listing query param
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const listingId = searchParams.get("listing");
    if (listingId) {
      const existingConversation = conversations.find((conv) => conv.listing.id === parseInt(listingId, 10));
      if (existingConversation) {
        setCurrentConversation(existingConversation);
      } else {
        createConversationFromListing(listingId).then((newConv) => {
          if (newConv) {
            setCurrentConversation(newConv);
          }
        });
      }
    }
  }, [location, conversations, createConversationFromListing]);

  // Fetch messages when the current conversation changes
  useEffect(() => {
    if (currentConversation && user) {
      setIsLoading(true);
      const fetchMessagesData = async () => {
        try {
          await fetchMessages(currentConversation.id);
          setError(null);
        } catch (err) {
          console.error("Error fetching messages:", err);
          setError("Failed to load messages. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchMessagesData();
      const pollInterval = setInterval(fetchMessagesData, appSettings.pollInterval);
      return () => clearInterval(pollInterval); // Clear interval on unmount
    }
  }, [currentConversation, user, fetchMessages]);

  // Scroll to the bottom of the message list when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark unread messages as read when new messages come in
  useEffect(() => {
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
   * Handle changing the current conversation.
   * @param {Object} conv - The conversation object to switch to.
   */
  const handleChangeConversation = (conv) => {
    setCurrentConversation(conv);
    setError(null);
    setIsLoading(true);
    setShowConversations(false); // Hide conversations on mobile
  };

  /**
   * Handle sending a message in the current conversation.
   * @param {Event} e - The form submission event.
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !user || !currentConversation) return;
    setIsSending(true);
    try {
      await sendMessage(currentConversation.id, newMessage);
      setNewMessage("");
      await fetchMessages(currentConversation.id);
      fetchConversationUnreadCounts();
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  /**
   * Toggle showing the conversation list on mobile devices.
   */
  const toggleConversations = () => {
    setShowConversations(!showConversations);
  };

  // Render a message asking the user to log in if they are not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg">Please log in to view and send messages.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:flex-row max-w-4xl px-4 mx-auto">
      <div className={`md:w-1/3 border-r ${showConversations ? "flex flex-col" : "hidden md:flex md:flex-col"}`}>
        <h3 className="sticky top-0 z-10 p-4 text-lg font-semibold bg-white border-b">Conversations</h3>
        <div className="flex-grow overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <LoadingSpinner />
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={`conv-${conv.id}`}
                className={`p-4 cursor-pointer hover:bg-gray-100 ${currentConversation?.id === conv.id ? "bg-gray-200" : ""}`}
                onClick={() => handleChangeConversation(conv)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{conv.listing.title}</span>
                  {conversationUnreadCounts[conv.id] > 0 && (
                    <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">{conversationUnreadCounts[conv.id]}</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">{conv.last_message ? conv.last_message.content : "No messages yet"}</p>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex flex-col w-full md:w-2/3">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b">
          <h3 className="text-lg font-semibold">{currentConversation?.listing.title || "Select a conversation"}</h3>
          <button onClick={toggleConversations} className="p-2 rounded-full md:hidden hover:bg-gray-200" aria-label="Toggle conversations">
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-grow overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full p-4">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div ref={messageListRef} className="h-full pb-16 overflow-y-auto">
              <MessageList messages={messages} currentUser={user} />
            </div>
          )}
        </div>
        {currentConversation && (
          <form onSubmit={handleSendMessage} className="sticky bottom-0 p-4 bg-white border-t">
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
                aria-label="Send Message"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Messages;
