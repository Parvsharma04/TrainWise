"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "universal-cookie";

import { Clock, Dumbbell, Scale } from "lucide-react";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WorkoutHeatMap from "@/components/WorkoutHeatMap";
import BadgeSummary from "../../components/BadgeSummary";
const Dashboard = () => {
  const router = useRouter();
  const cookies = new Cookies();
  useEffect(() => {
    if (!cookies.get("token")) router.push("/");
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image
            src="/placeholder.svg?height=64&width=64"
            alt="User Avatar"
            width={64}
            height={64}
            className="rounded-full"
          />
          <h1 className="text-3xl font-bold">Welcome, John Doe</h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Workouts Completed
            </CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weight Lost</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2 kg</div>
            <p className="text-xs text-muted-foreground">
              +1.2 kg from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workout Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12h 30m</div>
            <p className="text-xs text-muted-foreground">+2h from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Workout Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkoutHeatMap />
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <BadgeSummary />
      </div>
    </div>
  );
};

export default Dashboard;
