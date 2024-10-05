import React from "react";
import MessageItem from "./MessageItem";

/**
 * MessageGroup component to display a group of messages for a specific date.
 * @param {string} date - Formatted date for the group of messages.
 * @param {Array} messages - Array of message objects to be displayed.
 * @param {Object} currentUser - The current logged-in user object.
 * @returns {JSX.Element} The rendered message group with messages.
 */
const MessageGroup = ({ date, messages, currentUser }) => {
  return (
    <div className="px-4 mb-4">
      {/* Date header for the message group */}
      <div className="mb-2 text-center">
        <span className="px-2 py-1 text-xs text-gray-700 bg-gray-200 rounded-full">{date}</span>
      </div>

      {/* Loop through messages and render each one with MessageItem */}
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} isCurrentUser={message.sender.username === currentUser.username} />
      ))}
    </div>
  );
};

export default MessageGroup;
