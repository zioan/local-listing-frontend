import React, { useState, useEffect } from "react";
import { format, isSameDay, isYesterday, parseISO } from "date-fns";
import MessageGroup from "./MessageGroup";

const MESSAGES_PER_LOAD = 10;

/**
 * MessageList component to display a list of messages, grouped by date.
 * Handles loading more messages when the user requests.
 * @param {Array} messages - The full list of messages.
 * @param {Object} currentUser - The current logged-in user object.
 * @returns {JSX.Element} The rendered list of grouped messages.
 */
const MessageList = ({ messages, currentUser }) => {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);

  // Effect to initialize visible messages and set if there are more to load
  useEffect(() => {
    if (messages.length > 0) {
      setVisibleMessages(messages.slice(-MESSAGES_PER_LOAD));
      setHasMoreMessages(messages.length > MESSAGES_PER_LOAD);
    }
  }, [messages]);

  /**
   * Loads more messages by appending the next batch of messages.
   */
  const loadMoreMessages = () => {
    const currentLength = visibleMessages.length;
    const newMessages = messages.slice(-currentLength - MESSAGES_PER_LOAD);
    setVisibleMessages(newMessages);
    setHasMoreMessages(newMessages.length < messages.length);
  };

  /**
   * Gets a formatted label for the message date.
   * @param {Date} date - The date of the message.
   * @returns {string} The formatted date label (Today, Yesterday, or a formatted date).
   */
  const getDateLabel = (date) => {
    const today = new Date();
    if (isSameDay(date, today)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "MMMM d, yyyy");
    }
  };

  const sortedMessages = [...messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  /**
   * Groups messages by their date label.
   */
  const groupedMessages = sortedMessages.reduce((groups, message) => {
    const messageDate = parseISO(message.timestamp);
    const dateLabel = getDateLabel(messageDate);

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(message);
    return groups;
  }, {});

  return (
    <div className="flex flex-col-reverse">
      {/* Reverse the order for bottom-up rendering */}
      {Object.entries(groupedMessages)
        .reverse()
        .map(([dateLabel, groupMessages]) => (
          <MessageGroup key={dateLabel} date={dateLabel} messages={groupMessages} currentUser={currentUser} />
        ))}

      {/* Display the "Load More" button if there are more messages to load */}
      {hasMoreMessages && (
        <div className="my-4 text-center">
          <button onClick={loadMoreMessages} className="px-4 py-2 text-white transition duration-200 bg-blue-500 rounded hover:bg-blue-600">
            Load More Messages
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageList;
