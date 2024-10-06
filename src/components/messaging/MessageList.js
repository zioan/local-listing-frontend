import React from "react";
import { format, isSameDay, isYesterday, parseISO } from "date-fns";

/**
 * MessageList component renders a list of messages grouped by the date they were sent.
 * It highlights messages sent by the current user and provides appropriate date labels for
 * each message group (Today, Yesterday, or a formatted date).
 *
 * @param {Object[]} messages - Array of message objects containing message details.
 * @param {Object} currentUser - The current user object.
 *
 * @returns {JSX.Element} The rendered MessageList component.
 */
const MessageList = ({ messages, currentUser }) => {
  /**
   * Gets a formatted label for the message date.
   * Returns "Today" for messages from today, "Yesterday" for messages from yesterday,
   * and a formatted date for older messages.
   *
   * @param {Date} date - The date of the message.
   * @returns {string} The formatted date label.
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

  /**
   * Groups messages by the date they were sent. Each date serves as a key for a group
   * of messages sent on that day.
   *
   * @param {Object[]} messages - Array of message objects to be grouped.
   * @returns {Object} An object where each key is a date and the value is an array of messages from that date.
   */
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((message) => {
      const date = format(parseISO(message.timestamp), "MMMM d, yyyy");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="space-y-4">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          <div className="my-2 text-center">
            <span className="px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded-full">{getDateLabel(date)}</span>
          </div>
          {dateMessages.map((message) => (
            <div key={message.id} className={`flex ${message.sender.username === currentUser.username ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                  message.sender.username === currentUser.username ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"
                }`}
              >
                <p>{message.content}</p>
                <p className="mt-1 text-xs text-right">{format(parseISO(message.timestamp), "HH:mm")}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
