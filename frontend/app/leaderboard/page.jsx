"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Trophy } from "lucide-react";
import Image from "next/image";

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

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/leaderboard"); // Change this to your API endpoint
        const data = await response.json();

        if (response.ok) {
          setLeaderboard(data.leaderboard);
        } else {
          throw new Error(data.message || "Failed to load leaderboard");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Toggle sort order
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
          {loading ? (
            <p className="text-center">Loading leaderboard...</p>
          ) : error ? (
            <p className="text-center text-red-500">Error: {error}</p>
          ) : (
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
                {leaderboard.length > 0 ? (
                  leaderboard.map((user, index) => (
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
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {user.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{user.score}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="3" className="text-center">
                      No players found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
