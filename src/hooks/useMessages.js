import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import { appSettings } from "../config/settings";
import { useError } from "../context/ErrorContext";

/**
 * Custom hook for managing messaging functionality, including conversations and messages.
 *
 * @returns {Object} An object containing conversations, messages, loading state, error information,
 *                  unread counts, and functions to interact with messages and conversations.
 */
const useMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [conversationUnreadCounts, setConversationUnreadCounts] = useState({});
  const { user } = useAuth();
  const { handleApiError } = useError();

  /**
   * Fetches all conversations for the authenticated user.
   */
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("messaging/conversations/");
      setConversations(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch conversations");
      handleApiError(err, "Failed to fetch conversations");
    } finally {
      setLoading(false);
    }
  }, [user, handleApiError]);

  /**
   * Fetches messages for a specific conversation.
   *
   * @param {number|string} conversationId - The ID of the conversation to fetch messages for.
   */
  const fetchMessages = useCallback(
    async (conversationId) => {
      if (!user || !conversationId) return; // Exit if no user or conversation ID
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`messaging/conversations/${conversationId}/messages/`);
        setMessages(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch messages");
        handleApiError(err, "Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    },
    [user, handleApiError]
  );

  /**
   * Sends a message in a specific conversation.
   *
   * @param {number|string} conversationId - The ID of the conversation to send the message in.
   * @param {string} content - The content of the message.
   * @returns {Promise<Object>} The sent message data.
   */
  const sendMessage = useCallback(
    async (conversationId, content) => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const response = await api.post(`messaging/conversations/${conversationId}/messages/`, { content });
        setMessages((prevMessages) => [...prevMessages, response.data]); // Add sent message to messages
        return response.data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to send message");
        handleApiError(err, "Failed to send message");
      } finally {
        setLoading(false);
      }
    },
    [user, handleApiError]
  );

  /**
   * Creates a new conversation for a specific listing.
   *
   * @param {number|string} listingId - The ID of the listing to create a conversation for.
   * @returns {Promise<Object>} The created conversation data.
   */
  const createConversation = useCallback(
    async (listingId) => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const response = await api.post("messaging/conversations/", { listing_id: listingId });
        setConversations((prevConversations) => [...prevConversations, response.data]);
        return response.data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to create conversation");
        handleApiError(err, "Failed to create conversation");
      } finally {
        setLoading(false);
      }
    },
    [user, handleApiError]
  );

  /**
   * Fetches incoming messages for a specific listing.
   *
   * @param {number|string} listingId - The ID of the listing to fetch messages for.
   * @returns {Promise<Array>} The incoming messages.
   */
  const fetchIncomingMessages = useCallback(
    async (listingId) => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`messaging/listing/${listingId}/messages/`);
        return response.data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch incoming messages");
        handleApiError(err, "Failed to fetch incoming messages");
      } finally {
        setLoading(false);
      }
    },
    [user, handleApiError]
  );

  /**
   * Fetches the count of unread messages for the authenticated user.
   */
  const fetchUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0); // Set to zero if no user
      return;
    }
    try {
      const response = await api.get("messaging/unread-messages/");
      setUnreadCount(response.data.unread_count);
    } catch (err) {
      handleApiError(err, "Failed to fetch unread count");
    }
  }, [user, handleApiError]);

  /**
   * Fetches unread counts for each conversation.
   */
  const fetchConversationUnreadCounts = useCallback(async () => {
    if (!user) return;
    try {
      const response = await api.get("messaging/conversation-unread-counts/");
      setConversationUnreadCounts(response.data);
    } catch (err) {
      handleApiError(err, "Failed to fetch conversation unread counts");
    }
  }, [user, handleApiError]);

  /**
   * Marks messages as read for a specific conversation.
   *
   * @param {number|string} conversationId - The ID of the conversation to mark messages for.
   * @param {Array<number|string>} messageIds - The IDs of messages to mark as read.
   */
  const markMessagesAsRead = useCallback(
    async (conversationId, messageIds) => {
      if (!user) return;
      try {
        await api.post(`messaging/conversations/${conversationId}/mark-as-read/`, { message_ids: messageIds });
        fetchUnreadCount();
        fetchConversationUnreadCounts();
      } catch (err) {
        handleApiError(err, "Failed to mark messages as read");
      }
    },
    [user, fetchUnreadCount, fetchConversationUnreadCounts, handleApiError]
  );

  /**
   * Creates a new conversation based on a given listing.
   * If successful, it adds the new conversation to the current list of conversations.
   * Handles API errors if the conversation creation fails.
   * @param {string} listingId - The ID of the listing to create a conversation for.
   * @returns {Object|null} The newly created conversation object, or null if there is no user.
   */
  const createConversationFromListing = useCallback(
    async (listingId) => {
      if (!user) return;
      try {
        const newConversation = await createConversation(listingId);
        setConversations((prev) => [...prev, newConversation]);
        return newConversation;
      } catch (err) {
        handleApiError(err, "Failed to create conversation");
      }
    },
    [user, createConversation, handleApiError]
  );

  const fetchMessagesAndUnreadCounts = useCallback(
    async (conversationId) => {
      if (!user || !conversationId) return;
      setLoading(true);
      setError(null);
      try {
        const [messagesResponse, unreadCountsResponse] = await Promise.all([
          api.get(`messaging/conversations/${conversationId}/messages/`),
          api.get("messaging/conversation-unread-counts/"),
        ]);
        setMessages(messagesResponse.data);
        setConversationUnreadCounts(unreadCountsResponse.data);
        setUnreadCount(Object.values(unreadCountsResponse.data).reduce((a, b) => a + b, 0));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch messages and unread counts");
        handleApiError(err, "Failed to fetch messages and unread counts");
      } finally {
        setLoading(false);
      }
    },
    [user, handleApiError]
  );

  // Fetch unread counts on user change or on initial mount
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      fetchConversationUnreadCounts();
      const pollInterval = setInterval(() => {
        fetchUnreadCount(); // Poll unread count
        fetchConversationUnreadCounts(); // Poll conversation unread counts
      }, appSettings.pollInterval);
      return () => clearInterval(pollInterval); // Clear interval on unmount
    } else {
      setUnreadCount(0); // Reset unread count if no user
      setConversationUnreadCounts({}); // Reset conversation unread counts if no user
    }
  }, [user, fetchUnreadCount, fetchConversationUnreadCounts]);

  return {
    conversations, // List of conversations
    messages, // List of messages in the selected conversation
    loading,
    error,
    unreadCount, // Total unread message count
    conversationUnreadCounts, // Unread counts per conversation
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
    createConversationFromListing,
    fetchIncomingMessages,
    fetchUnreadCount,
    fetchConversationUnreadCounts,
    markMessagesAsRead,
    fetchMessagesAndUnreadCounts,
  };
};

export default useMessages;
