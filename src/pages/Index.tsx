import { useState, useRef, useEffect } from "react";
import { ChatMessage, Message } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { DiagramViewer, DiagramData } from "@/components/DiagramViewer";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [diagram, setDiagram] = useState<DiagramData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    if (!backendUrl) {
      toast.error("Backend URL not configured. Please set VITE_BACKEND_URL environment variable.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message || "Response received",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Update diagram if present
      if (data.diagram) {
        setDiagram(data.diagram);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please check your backend connection.");
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I couldn't connect to the backend. Please check the console for details.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full">
      {diagram === null ? (
        <div className="h-full flex flex-col bg-gradient-to-t from-gradient-left-1 via-gradient-left-2 to-gradient-left-3">
          <ScrollArea className="flex-1 p-8" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/70">
                <p>Start a conversation...</p>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
          </ScrollArea>

          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      ) : (
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col bg-gradient-to-t from-gradient-left-1 via-gradient-left-2 to-gradient-left-3">
              <ScrollArea className="flex-1 p-8" ref={scrollRef}>
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-white/70">
                    <p>Start a conversation...</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))
                )}
              </ScrollArea>

              <ChatInput onSend={handleSendMessage} disabled={isLoading} />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col bg-gradient-to-t from-gradient-right-1 via-gradient-right-2 via-gradient-right-3 via-gradient-right-4 via-gradient-right-5 via-gradient-right-6 via-gradient-right-7 to-gradient-right-8">
              <div className="flex-1">
                <DiagramViewer diagram={diagram} />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
};

export default Index;
