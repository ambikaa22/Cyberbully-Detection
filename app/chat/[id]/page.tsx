"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Send, Users, AlertTriangle, Copy, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock user data
const currentUser = {
  id: "user1",
  name: "You",
  avatar: "/placeholder.svg?height=40&width=40",
}

const otherUsers = [
  { id: "user2", name: "Alex Johnson", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user3", name: "Sam Wilson", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user4", name: "Taylor Kim", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "user5", name: "Jordan Lee", avatar: "/placeholder.svg?height=40&width=40" },
]

// Mock chat room data
const chatRoomData = {
  id: "1",
  name: "General Chat",
  participants: [...otherUsers, currentUser],
}

interface Message {
  id: string
  userId: string
  text: string
  timestamp: Date
  flagged: boolean
}

export default function ChatRoomPage() {
  const params = useParams()
  const roomId = params.id as string
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [roomCode, setRoomCode] = useState("CHAT123")
  const [roomCodeCopied, setRoomCodeCopied] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  // Initial messages
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: "msg1",
        userId: "user2",
        text: "Hey everyone! Welcome to the chat room.",
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        flagged: false,
      },
      {
        id: "msg2",
        userId: "user3",
        text: "Thanks for setting this up!",
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        flagged: false,
      },
      {
        id: "msg3",
        userId: "user4",
        text: "I'm excited to chat with all of you.",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        flagged: false,
      },
    ]
    setMessages(initialMessages)
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Function to check if a message contains flagged content using the ML model
  const checkForFlaggedContent = async (text: string): Promise<boolean> => {
    try {
      setIsChecking(true)
      console.log('Sending message for detection:', text);
      
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error('Error checking message:', response.statusText);
        return false;
      }

      const data = await response.json();
      console.log('Detection response:', data);
      
      // Check if the response has the expected structure
      if (data && typeof data.prediction === 'number') {
        console.log('Message flagged as cyberbullying:', data.prediction === 1);
        return data.prediction === 1;
      } else {
        console.error('Unexpected response format:', data);
        return false;
      }
    } catch (error) {
      console.error('Error checking message:', error);
      return false;
    } finally {
      setIsChecking(false)
    }
  };

  // Function to mask profanity in text
  const maskProfanity = (text: string): string => {
    // For now, we'll just mask the entire message if it's flagged
    return '*'.repeat(text.length);
  };

  const handleSendMessage = async () => {
    if (message.trim() && !isChecking) {
      const isFlagged = await checkForFlaggedContent(message);
      const newMessage: Message = {
        id: `msg${Date.now()}`,
        userId: currentUser.id,
        text: isFlagged ? maskProfanity(message) : message,
        timestamp: new Date(),
        flagged: isFlagged,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode)
    setRoomCodeCopied(true)
    setTimeout(() => setRoomCodeCopied(false), 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getUserById = (userId: string) => {
    return (
      chatRoomData.participants.find((user) => user.id === userId) || {
        id: userId,
        name: "Unknown User",
        avatar: "/placeholder.svg?height=40&width=40",
      }
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="md:hidden">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="hidden md:block">
              <Link href="/dashboard">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Button>
              </Link>
            </div>
            <h1 className="font-bold text-xl">{chatRoomData.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={copyRoomCode} className="hidden md:flex">
                    {roomCodeCopied ? "Copied!" : `Room Code: ${roomCode}`}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy room code to invite others</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Users className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Participants ({chatRoomData.participants.length})</SheetTitle>
                </SheetHeader>
                <div className="py-6">
                  <div className="space-y-4">
                    {chatRoomData.participants.map((user) => (
                      <div key={user.id} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          {user.id === currentUser.id && <p className="text-xs text-muted-foreground">You</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 space-y-4">
                    <h3 className="font-semibold">Invite Others</h3>
                    <div className="flex items-center gap-2">
                      <Input value={roomCode} readOnly />
                      <Button size="icon" variant="outline" onClick={copyRoomCode}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    {roomCodeCopied && <p className="text-sm text-green-600">Room code copied to clipboard!</p>}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="container max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => {
            const user = getUserById(msg.userId)
            const isCurrentUser = msg.userId === currentUser.id

            return (
              <div key={msg.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[80%] ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-medium ${isCurrentUser ? "text-right" : ""}`}>
                        {isCurrentUser ? "You" : user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                      {msg.flagged && (
                        <Badge variant="destructive" className="h-5 px-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span className="text-xs">Flagged</span>
                        </Badge>
                      )}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="border-t p-4">
        <div className="container max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isChecking}
            />
            <Button onClick={handleSendMessage} disabled={isChecking}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

