import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "mb-4 rounded-3xl p-5 max-w-[85%] break-words bg-[#3a3a3a] shadow-lg",
        message.role === "user"
          ? "ml-auto"
          : "mr-auto"
      )}
    >
      <div className="text-sm font-medium mb-1 text-white/70">
        {message.role === "user" ? "You" : "Assistant"}
      </div>
      <div className="whitespace-pre-wrap text-white">{message.content}</div>
      <div className="text-xs text-white/50 mt-2">
        {message.timestamp.toLocaleTimeString()}
      </div>
    </div>
  );
};
