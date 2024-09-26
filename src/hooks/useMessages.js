import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import { appSettings } from "../config/settings";
import { useError } from "../context/ErrorContext";

const useMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [conversationUnreadCounts, setConversationUnreadCounts] = useState({});
  const { user } = useAuth();
  const { handleApiError } = useError();

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
        setError(err.response?.data?.message || "Failed to fetch messages");
        handleApiError(err, "Failed to fetch messages");
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
        setError(err.response?.data?.message || "Failed to send message");
        handleApiError(err, "Failed to send message");
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
        setError(err.response?.data?.message || "Failed to create conversation");
        handleApiError(err, "Failed to create conversation");
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
        setError(err.response?.data?.message || "Failed to fetch incoming messages");
        handleApiError(err, "Failed to fetch incoming messages");
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
      handleApiError(err, "Failed to fetch unread count");
    }
  }, [user]);

  const fetchConversationUnreadCounts = useCallback(async () => {
    if (!user) return;
    try {
      const response = await api.get("messaging/conversation-unread-counts/");
      setConversationUnreadCounts(response.data);
    } catch (err) {
      handleApiError(err, "Failed to fetch conversation unread counts");
    }
  }, [user]);

  const markMessagesAsRead = useCallback(
    async (conversationId, messageIds) => {
      if (!user) return;
      try {
        await api.post(`messaging/conversations/${conversationId}/mark-as-read/`, { message_ids: messageIds });
        setMessages((prevMessages) => prevMessages.map((msg) => (messageIds.includes(msg.id) ? { ...msg, is_read: true } : msg)));
        fetchUnreadCount();
        fetchConversationUnreadCounts();
      } catch (err) {
        handleApiError(err, "Failed to mark messages as read");
      }
    },
    [user, fetchUnreadCount, fetchConversationUnreadCounts]
  );

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      fetchConversationUnreadCounts();
      const pollInterval = setInterval(() => {
        fetchUnreadCount();
        fetchConversationUnreadCounts();
      }, appSettings.pollInterval);
      return () => clearInterval(pollInterval);
    } else {
      setUnreadCount(0);
      setConversationUnreadCounts({});
    }
  }, [user, fetchUnreadCount, fetchConversationUnreadCounts]);

  return {
    conversations,
    messages,
    loading,
    error,
    unreadCount,
    conversationUnreadCounts,
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
