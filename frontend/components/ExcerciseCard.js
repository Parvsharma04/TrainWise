import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function ExerciseCard({ exercise }) {
  console.log(exercise);
  let link = exercise.name.toLowerCase();
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{exercise.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <Image
          src={exercise.image_url}
          alt={exercise.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover mb-4 rounded-md"
        />
        <p className="text-sm mb-2">{exercise.description}</p>
        <p className="font-semibold">Difficulty: {exercise.difficulty}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-sm text-gray-500">Attempts: {exercise.attempts}</p>
        <Link href={`/activity/${link}`}>
          <Button>Start Exercising</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
