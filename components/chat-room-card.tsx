import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users } from "lucide-react"

interface ChatRoom {
  id: string
  name: string
  participants: number
  lastActive: string
}

interface ChatRoomCardProps {
  room: ChatRoom
}

export default function ChatRoomCard({ room }: ChatRoomCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center justify-between">
          <span>{room.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{room.participants} participants</span>
          </div>
          <div>Last active: {room.lastActive}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/30 p-4">
        <Button variant="outline" size="sm">
          Invite
        </Button>
        <Link href={`/chat/${room.id}`}>
          <Button size="sm" className="gap-1">
            <MessageSquare className="h-4 w-4" /> Join Chat
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

