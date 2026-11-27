"use client";

import { useState } from "react";
import ClientDashboardSidebar from "@/components/client-dashboard/ClientDashboardSidebar";
import ClientDashboardHeader from "@/components/client-dashboard/ClientDashboardHeader";
import MessagesHeader from "./MessagesHeader";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import ConversationDetails from "./ConversationDetails";
import EmptyConversationState from "./EmptyConversationState";
import { INITIAL_CONVERSATIONS } from "./messagesData";
import { useToast } from "@/components/ui/ToastProvider";

export default function ClientMessagesView() {
  const { showToast } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Conversations State
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState("conv-1");

  // Mobile View Mode: 'list' | 'chat'
  const [mobileView, setMobileView] = useState("chat");
  // Right Column Details panel toggle
  const [detailsOpen, setDetailsOpen] = useState(true);

  // Currently selected conversation
  const selectedConversation = conversations.find((c) => c.id === selectedId) || null;

  // Total Unread Count
  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  // Handler to select conversation and mark read
  function handleSelectConversation(id) {
    setSelectedId(id);
    setMobileView("chat");

    // Mark as read in local state
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  }

  // Handler to append newly sent message
  function handleSendMessage(convId, newMsg) {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex selection:bg-violet-500/20 selection:text-violet-900">
      
      {/* 1. Left Sidebar Navigation (active: messages) */}
      <ClientDashboardSidebar
        activeNav="messages"
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header */}
        <ClientDashboardHeader
          onOpenMobile={() => setMobileSidebarOpen(true)}
        />

        {/* Messages Layout Container */}
        <div className="flex-1 p-3 sm:p-5 lg:p-6 flex flex-col min-h-0 max-w-7xl mx-auto w-full">
          
          {/* 2. Page Header */}
          <MessagesHeader unreadCount={totalUnread} />

          {/* 3. Three-Column Messaging Workspace */}
          <div className="flex-1 min-h-0 mt-3 rounded-3xl border border-slate-200/90 bg-white shadow-xs overflow-hidden flex relative">
            
            {/* Left Column – Conversations List */}
            <div
              className={`w-full lg:w-80 xl:w-96 shrink-0 h-full ${
                mobileView === "list" ? "block" : "hidden lg:block"
              }`}
            >
              <ConversationList
                conversations={conversations}
                selectedId={selectedId}
                onSelectConversation={handleSelectConversation}
              />
            </div>

            {/* Middle Column – Active Chat Window OR Empty State */}
            <div
              className={`flex-1 h-full min-w-0 ${
                mobileView === "chat" ? "flex flex-col" : "hidden lg:flex lg:flex-col"
              }`}
            >
              {selectedConversation ? (
                <ChatWindow
                  conversation={selectedConversation}
                  onSendMessage={handleSendMessage}
                  onBackToList={() => setMobileView("list")}
                  onToggleDetails={() => setDetailsOpen((prev) => !prev)}
                  detailsOpen={detailsOpen}
                />
              ) : (
                <EmptyConversationState />
              )}
            </div>

            {/* Right Column – Conversation Details (Desktop & Mobile Slide-Over) */}
            {selectedConversation && detailsOpen && (
              <div className="hidden xl:block w-80 shrink-0 h-full">
                <ConversationDetails
                  conversation={selectedConversation}
                  onClose={() => setDetailsOpen(false)}
                />
              </div>
            )}

            {/* Tablet / Mobile Slide-Over Details Drawer */}
            {selectedConversation && detailsOpen && (
              <div className="xl:hidden fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-2xl animate-in slide-in-from-right duration-200">
                <ConversationDetails
                  conversation={selectedConversation}
                  onClose={() => setDetailsOpen(false)}
                />
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
