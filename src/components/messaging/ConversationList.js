import React, { useMemo } from "react";
import { format, parseISO } from "date-fns";

/**
 * ConversationList component renders a list of conversations. It highlights the currently selected
 * conversation and displays unread message counts if available. The user can select a conversation
 * by clicking on it, which triggers the `onConversationSelect` callback.
 *
 * @param {Object[]} conversations - Array of conversation objects containing conversation details.
 * @param {Object} currentConversation - The currently selected conversation object.
 * @param {Function} onConversationSelect - Function to call when a conversation is selected.
 * @param {Object} unreadCounts - An object mapping conversation IDs to the number of unread messages.
 *
 * @returns {JSX.Element} The rendered ConversationList component.
 */
const ConversationList = ({ conversations, currentConversation, onConversationSelect, unreadCounts }) => {
  /**
   * Filters out duplicate conversations
   * Bug description: Due to unknown reasons, the conversation list may contain duplicate conversations
   * when the user start a conversation from the listing detail page.
   * While this is not a permanent or appropriate solution, the `uniqueConversations` function
   * filters out duplicate conversations by checking the conversation ID.
   * This bug does not affect the chat functionality, backend capability, or the database itself,
   * is purely a frontend issue.
   */
  const uniqueConversations = useMemo(() => {
    const seenIds = new Set();
    if (!conversations) return [];

    return conversations.filter((conversation) => {
      if (seenIds.has(conversation.id)) {
        return false;
      }
      seenIds.add(conversation.id);
      return true;
    });
  }, [conversations]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="p-4 text-xl font-semibold border-b">Conversations</h2>
      <div className="flex-grow overflow-y-auto" style={{ height: "calc(100vh - 60px)" }}>
        {!conversations.length && <div className="p-4 text-center text-gray-500">No conversations yet</div>}
        {uniqueConversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${currentConversation?.id === conversation.id ? "bg-gray-200" : ""}`}
            onClick={() => onConversationSelect(conversation)}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold truncate">{conversation.listing.title}</h3>
              {unreadCounts[conversation.id] > 0 && (
                <span className="flex-shrink-0 px-2 py-1 ml-2 text-xs font-bold text-white bg-blue-500 rounded-full">
                  {unreadCounts[conversation.id]}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 truncate">{conversation.last_message ? conversation.last_message.content : "No messages yet"}</p>
            <p className="mt-1 text-xs text-gray-400">
              {conversation.last_message ? format(parseISO(conversation.last_message.timestamp), "MMM d, HH:mm") : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
