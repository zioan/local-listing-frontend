import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useMessages from "../../hooks/useMessages";
import ConversationList from "./ConversationList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { ArrowLeftIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { appSettings } from "../../config/settings";
import LoadingSpinner from "../shared/LoadingSpinner";
import _ from "lodash"; // Import lodash for deep equality check

/**
 * Messages component manages the messaging interface. It allows users to view conversations,
 * select a conversation, view messages, send new messages, and mark messages as read.
 * It also handles mobile responsiveness with a toggle for the conversation list.
 *
 * @returns {JSX.Element} The rendered Messages component.
 */
const Messages = () => {
  const { user } = useAuth();
  const location = useLocation();
  const {
    loading,
    conversations,
    messages: fetchedMessages,
    fetchConversations,
    fetchMessagesAndUnreadCounts,
    sendMessage,
    markMessagesAsRead,
    conversationUnreadCounts,
    createConversationFromListing,
  } = useMessages();

  const [messages, setMessages] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [showMobileList, setShowMobileList] = useState(true);
  const messageListRef = useRef(null);
  const userScrolled = useRef(false);

  /**
   * Fetches messages and unread counts for the currently selected conversation.
   */
  const fetchCurrentConversationData = useCallback(() => {
    if (currentConversation) {
      fetchMessagesAndUnreadCounts(currentConversation.id);
    }
  }, [currentConversation, fetchMessagesAndUnreadCounts]);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const listingId = searchParams.get("listing");
    if (listingId) {
      const existingConversation = conversations.find((conv) => conv.listing.id === parseInt(listingId, 10));
      if (existingConversation) {
        setCurrentConversation(existingConversation);
        setShowMobileList(false);
      } else {
        createConversationFromListing(listingId).then((newConv) => {
          if (newConv) {
            setCurrentConversation(newConv);
            setShowMobileList(false);
          }
        });
      }
    }
  }, [location, conversations, createConversationFromListing]);

  useEffect(() => {
    fetchCurrentConversationData();

    const intervalId = setInterval(fetchCurrentConversationData, appSettings.pollInterval);

    return () => clearInterval(intervalId);
  }, [currentConversation, fetchCurrentConversationData]);

  // Only update messages if they are genuinely different to prevent unnecessary re-renders
  useEffect(() => {
    if (!_.isEqual(fetchedMessages, messages)) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages, messages]);

  useEffect(() => {
    const messageListElement = messageListRef.current;

    if (messageListElement) {
      const handleScroll = () => {
        const atBottom = messageListElement.scrollTop + messageListElement.clientHeight >= messageListElement.scrollHeight - 10;

        if (!atBottom) {
          userScrolled.current = true; // User scrolled away from bottom
        } else {
          userScrolled.current = false; // User is at bottom
        }
      };

      messageListElement.addEventListener("scroll", handleScroll);
      return () => {
        messageListElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  // Scroll to bottom if the user has not scrolled away from the bottom
  useEffect(() => {
    const messageListElement = messageListRef.current;

    if (messageListElement && !userScrolled.current) {
      messageListElement.scrollTop = messageListElement.scrollHeight;
    }

    if (currentConversation && messages.length > 0) {
      const unreadMessages = messages.filter((message) => !message.is_read && message.sender.username !== user.username);
      if (unreadMessages.length > 0) {
        markMessagesAsRead(
          currentConversation.id,
          unreadMessages.map((msg) => msg.id)
        );
      }
    }
  }, [messages, currentConversation, user.username, markMessagesAsRead]);

  /**
   * Handles conversation selection. Updates the current conversation and hides the mobile conversation list.
   *
   * @param {Object} conversation - The selected conversation object.
   */
  const handleConversationSelect = (conversation) => {
    setCurrentConversation(conversation);
    setShowMobileList(false);
    // Reset scrolling state when selecting a new conversation
    userScrolled.current = false;
  };

  /**
   * Sends a new message in the current conversation, then fetches the latest messages and unread counts.
   *
   * @param {string} content - The content of the message to be sent.
   */
  const handleSendMessage = async (content) => {
    if (content.trim() && currentConversation) {
      await sendMessage(currentConversation.id, content);
      fetchCurrentConversationData();
      // Scroll to the bottom after sending a message
      userScrolled.current = false;
    }
  };

  /**
   * Toggles the visibility of the conversation list on mobile devices.
   */
  const toggleMobileList = () => {
    setShowMobileList(!showMobileList);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg">Please log in to view and send messages.</p>
      </div>
    );
  }

  return (
    <div className="flex max-w-4xl mx-auto overflow-y-hidden bg-gray-100 border-r-2 border-r-white " style={{ height: "calc(100vh - 64px)" }}>
      {/* Conversation List */}
      <div
        className={`fixed inset-y-0 left-0 w-full md:w-1/3 bg-white z-20 transform transition-transform duration-300 ease-in-out ${
          showMobileList ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
        style={{ height: "100vh" }}
      >
        <ConversationList
          conversations={conversations}
          currentConversation={currentConversation}
          onConversationSelect={handleConversationSelect}
          unreadCounts={conversationUnreadCounts}
        />
      </div>

      {/* Message Area */}
      <div className="flex flex-col w-full md:w-2/3">
        {currentConversation ? (
          <>
            <div className="sticky top-0 z-10 flex items-center p-4 bg-gray-200">
              <button onClick={toggleMobileList} className="mr-2 text-gray-600 md:hidden">
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <h2 className="flex-grow text-lg font-semibold truncate">{currentConversation.listing.title}</h2>
              <button onClick={toggleMobileList} className="text-gray-600 md:hidden">
                <ChatBubbleLeftRightIcon className="w-6 h-6" />
              </button>
            </div>
            <div ref={messageListRef} className="flex-grow p-4 overflow-y-auto">
              {loading && !messages && <LoadingSpinner isLoading={loading} />}
              <MessageList messages={messages} currentUser={user} />
            </div>
            <div className="sticky bottom-0 left-0 right-0 bg-white">
              <MessageInput onSendMessage={handleSendMessage} />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
