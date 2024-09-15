import { useState, useCallback } from "react";
import api from "../config/api";

const useMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("messaging/conversations/");
      setConversations(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch conversations");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchExistingConversation = useCallback(async (listingId) => {
    try {
      const response = await api.get("messaging/conversations/", {
        params: { listing: listingId },
      });
      const existingConversation = response.data.find((conv) => conv.listing.id === listingId);
      if (existingConversation) {
        return existingConversation;
      } else {
        throw new Error("No existing conversation found");
      }
    } catch (error) {
      console.error("Error fetching existing conversation:", error);
      throw error;
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

  const createConversation = useCallback(
    async (listingId) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post("messaging/conversations/", { listing: listingId });
        setConversations((prevConversations) => [...prevConversations, response.data]);
        return response.data;
      } catch (err) {
        console.error("Error creating conversation:", err.response?.data);
        const errorMessage = err.response?.data?.error || "Failed to create conversation";
        if (errorMessage.includes("Conversation already exists")) {
          // Handle existing conversation
          return await fetchExistingConversation(listingId);
        } else if (errorMessage.includes("Cannot start a conversation with yourself")) {
          setError("You cannot message yourself");
        } else {
          setError(errorMessage);
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchExistingConversation]
  );

  return {
    conversations,
    messages,
    loading,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
    fetchExistingConversation,
  };
};

export default useMessages;
