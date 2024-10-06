import React, { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

/**
 * MessageInput component renders a form for composing and sending a message.
 * The user can type a message and submit it by pressing the send button or hitting Enter.
 *
 * @param {Function} onSendMessage - Callback function to send the message when the form is submitted.
 *
 * @returns {JSX.Element} The rendered MessageInput component.
 */
const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  /**
   * Handles the form submission. If the message is not empty, it triggers the `onSendMessage` callback
   * with the current message, and then clears the input field.
   *
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 mr-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
