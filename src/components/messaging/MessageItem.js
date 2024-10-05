import React from "react";
import { format, parseISO } from "date-fns";

/**
 * MessageItem component to display an individual message with conditional styling based on the user.
 * @param {Object} message - The message object containing content, sender, and timestamp.
 * @param {boolean} isCurrentUser - Boolean indicating if the message is from the current user.
 * @returns {JSX.Element} The rendered message item.
 */
const MessageItem = ({ message, isCurrentUser }) => {
  return (
    <div className={`mb-4 flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] p-3 rounded-lg ${isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
        <p className="mb-1 text-sm">{message.content}</p>
        <p className={`text-xs ${isCurrentUser ? "text-blue-100" : "text-gray-500"} text-right`}>{format(parseISO(message.timestamp), "HH:mm")}</p>
      </div>
    </div>
  );
};

export default MessageItem;
