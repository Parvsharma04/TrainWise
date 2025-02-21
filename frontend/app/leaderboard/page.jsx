"use client";

import { ChevronDown, ChevronUp, Trophy } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for the leaderboard
const leaderboardData = [
  {
    id: 1,
    name: "John Doe",
    score: 1250,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Jane Smith",
    score: 1180,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Bob Johnson",
    score: 1150,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Alice Brown",
    score: 1100,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Charlie Davis",
    score: 1050,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Eva Wilson",
    score: 1000,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    name: "Frank Miller",
    score: 950,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 8,
    name: "Grace Lee",
    score: 900,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 9,
    name: "Henry Taylor",
    score: 850,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 10,
    name: "Ivy Chen",
    score: 800,
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export default function Leaderboard() {
  const [sortOrder, setSortOrder] = useState("desc");
  const [leaderboard, setLeaderboard] = useState(leaderboardData);

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newOrder);
    setLeaderboard(
      [...leaderboard].sort((a, b) =>
        newOrder === "desc" ? b.score - a.score : a.score - b.score
      )
    );
  };

  return (
    <div className="mt-24">
      <Card className="h-[100%]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center mb-10">
            <Trophy className="mr-2" />
            Top Scorers of the Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Position</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSortOrder}
                    className="flex items-center"
                  >
                    Score
                    {sortOrder === "desc" ? (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronUp className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {index + 1}
                    {index < 3 && (
                      <Image
                        src={`svgs/medal-${index + 1}.svg`}
                        alt={`Position ${index + 1}`}
                        width={20}
                        height={20}
                        className="inline ml-2"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{user.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
