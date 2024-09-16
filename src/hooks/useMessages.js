import { useState, useCallback, useEffect } from "react";
import api from "../config/api";

const useMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchConversations = useCallback(async () => {
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
  }, []);

  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;
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
  }, []);

  const sendMessage = useCallback(async (conversationId, content) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`messaging/conversations/${conversationId}/messages/`, { content });
      setMessages((prevMessages) => [...prevMessages, response.data]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  }, []);

  const createConversation = useCallback(async (listingId) => {
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
      console.error("Error creating conversation:", err.response?.data);
      setError(err.response?.data?.message || "Failed to create conversation");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchIncomingMessages = useCallback(async (listingId) => {
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
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await api.get("messaging/unread-messages/");
      setUnreadCount(response.data.unread_count);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  }, []);

  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchUnreadCount();
      fetchConversations();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(pollInterval);
  }, [fetchUnreadCount, fetchConversations]);

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
  };
};

export default useMessages;
