import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";

const useMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("messaging/conversations/");
      setConversations(response.data);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError(err.response?.data?.message || "Failed to fetch conversations");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchMessages = useCallback(
    async (conversationId) => {
      if (!user || !conversationId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`messaging/conversations/${conversationId}/messages/`);
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError(err.response?.data?.message || "Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const sendMessage = useCallback(
    async (conversationId, content) => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const response = await api.post(`messaging/conversations/${conversationId}/messages/`, { content });
        setMessages((prevMessages) => [...prevMessages, response.data]);
        return response.data;
      } catch (err) {
        console.error("Error sending message:", err);
        setError(err.response?.data?.message || "Failed to send message");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const createConversation = useCallback(
    async (listingId) => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const response = await api.post("messaging/conversations/", { listing_id: listingId });
        setConversations((prevConversations) => {
          const exists = prevConversations.some((conv) => conv.id === response.data.id);
          if (!exists) {
            return [...prevConversations, response.data];
          }
          return prevConversations;
        });
        return response.data;
      } catch (err) {
        console.error("Error creating conversation:", err);
        setError(err.response?.data?.message || "Failed to create conversation");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const fetchIncomingMessages = useCallback(
    async (listingId) => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`messaging/listing/${listingId}/messages/`);
        return response.data;
      } catch (err) {
        console.error("Error fetching incoming messages:", err);
        setError(err.response?.data?.message || "Failed to fetch incoming messages");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const fetchUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    try {
      const response = await api.get("messaging/unread-messages/");
      setUnreadCount(response.data.unread_count);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  }, [user]);

  const fetchConversationUnreadCounts = useCallback(async () => {
    if (!user) return;
    try {
      const response = await api.get("messaging/conversation-unread-counts/");
      return response.data;
    } catch (err) {
      console.error("Error fetching conversation unread counts:", err);
    }
  }, [user]);

  const markMessagesAsRead = useCallback(
    async (conversationId, messageIds) => {
      if (!user) return;
      try {
        await api.post(`messaging/conversations/${conversationId}/mark-as-read/`, { message_ids: messageIds });
        setMessages((prevMessages) => prevMessages.map((msg) => (messageIds.includes(msg.id) ? { ...msg, is_read: true } : msg)));
        fetchUnreadCount();
      } catch (err) {
        console.error("Error marking messages as read:", err);
      }
    },
    [user, fetchUnreadCount]
  );

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const pollInterval = setInterval(fetchUnreadCount, 10000); // Poll every 10 seconds
      return () => clearInterval(pollInterval);
    } else {
      setUnreadCount(0);
    }
  }, [user, fetchUnreadCount]);

  return {
    conversations,
    messages,
    loading,
    error,
    unreadCount,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
    fetchIncomingMessages,
    fetchUnreadCount,
    fetchConversationUnreadCounts,
    markMessagesAsRead,
  };
};

export default useMessages;
