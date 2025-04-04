"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Users, LogOut } from "lucide-react"
import ChatRoomCard from "@/components/chat-room-card"

// Mock data for chat rooms
const initialChatRooms = [
  { id: "1", name: "General Chat", participants: 8, lastActive: "2 mins ago" },
  { id: "2", name: "Project Discussion", participants: 4, lastActive: "1 hour ago" },
  { id: "3", name: "Friends Group", participants: 6, lastActive: "3 hours ago" },
]

export default function DashboardPage() {
  const [chatRooms, setChatRooms] = useState(initialChatRooms)
  const [newRoomName, setNewRoomName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      const newRoom = {
        id: `${chatRooms.length + 1}`,
        name: newRoomName,
        participants: 1,
        lastActive: "Just now",
      }
      setChatRooms([...chatRooms, newRoom])
      setNewRoomName("")
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">SafeChat</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Chat Rooms</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Create Room
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Chat Room</DialogTitle>
                <DialogDescription>Give your chat room a name. You can invite others after creation.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="roomName">Room Name</Label>
                  <Input
                    id="roomName"
                    placeholder="e.g., Team Discussion"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRoom}>Create Room</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatRooms.map((room) => (
            <ChatRoomCard key={room.id} room={room} />
          ))}
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Join a Chat Room
              </CardTitle>
              <CardDescription>Enter a room code to join an existing chat room</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input placeholder="Enter room code" />
                <Button>Join</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

