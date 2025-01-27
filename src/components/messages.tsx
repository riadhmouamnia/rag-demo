"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User } from "lucide-react";
import aiResponse from "@/lib/ai-response";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}
export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await aiResponse(input);
      if (res.error) {
        console.error("Error:", res.error.message);
        setMessages((prev) => prev.slice(0, -1));
        toast({
          title: "Error",
          description: res.error.message,
          variant: "destructive",
        });
        return;
      } else {
        console.log(res.data);
        const assistantMessage = {
          role: "assistant" as const,
          content: res.data!,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="backdrop-blur-m shadow-xl h-[600px] flex flex-col animate-fadeIn">
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`p-2 rounded-full ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-secondary to-secondary/70"
                    : "bg-gradient-to-r from-purple-600 to-blue-600"
                }`}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              <div className="max-w-[80%] p-4 rounded-2xl border">
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-gray-200">
                <Bot className="h-4 w-4 text-gray-700" />
              </div>
              <div className="bg-white/60 max-w-[80%] p-4 rounded-2xl">
                Thinking...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your documents..."
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </div>
      </form>
    </Card>
  );
}
