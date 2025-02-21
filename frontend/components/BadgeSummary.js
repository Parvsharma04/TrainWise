"use client";

import { Award } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BadgeDetails from "./BadgeDetails";

const badges = [
  {
    id: 1,
    title: "First Workout",
    image: "/placeholder.svg?height=50&width=50",
    description: "Completed your first workout",
  },
  {
    id: 2,
    title: "Weight Loss Champion",
    image: "/placeholder.svg?height=50&width=50",
    description: "Lost 5kg",
  },
  {
    id: 3,
    title: "30-Day Streak",
    image: "/placeholder.svg?height=50&width=50",
    description: "Worked out for 30 days in a row",
  },
  // Add more badges as needed
];

const BadgeSummary = () => {
  const [selectedBadge, setSelectedBadge] = useState(null);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
        <Award className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {badges.slice(0, 3).map((badge) => (
              <Dialog key={badge.id}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="p-0"
                    onClick={() => setSelectedBadge(badge)}
                  >
                    <Image
                      src={badge.image || "/placeholder.svg"}
                      alt={badge.title}
                      width={50}
                      height={50}
                    />
                  </Button>
                </DialogTrigger>
                <BadgeDetails badge={badge} />
              </Dialog>
            ))}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link">See All</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>All Badges</DialogTitle>
                <DialogDescription>
                  You've earned {badges.length} badges so far!
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <Dialog key={badge.id}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="p-0"
                        onClick={() => setSelectedBadge(badge)}
                      >
                        <Image
                          src={badge.image || "/placeholder.svg"}
                          alt={badge.title}
                          width={50}
                          height={50}
                        />
                      </Button>
                    </DialogTrigger>
                    <BadgeDetails badge={badge} />
                  </Dialog>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgeSummary;
