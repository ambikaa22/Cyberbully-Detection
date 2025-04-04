"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, UserPlus } from "lucide-react"

interface InviteUserDialogProps {
  roomCode: string
}

export default function InviteUserDialog({ roomCode }: InviteUserDialogProps) {
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendInvite = () => {
    if (!email) return

    setIsSending(true)
    // Simulate sending invitation
    setTimeout(() => {
      setIsSending(false)
      setIsSent(true)
      setEmail("")
      setTimeout(() => setIsSent(false), 3000)
    }, 1000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" /> Invite Users
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Users</DialogTitle>
          <DialogDescription>
            Share the room code or send an email invitation to add users to this chat room.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Room Code</Label>
            <div className="flex items-center gap-2">
              <Input value={roomCode} readOnly className="font-mono" />
              <Button size="icon" variant="outline" onClick={copyRoomCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {copied && <p className="text-sm text-green-600">Copied to clipboard!</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Invitation</Label>
            <div className="flex items-center gap-2">
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={handleSendInvite} disabled={!email || isSending || isSent}>
                {isSending ? "Sending..." : isSent ? "Sent!" : "Send"}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="w-full">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

