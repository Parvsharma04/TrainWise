import ExerciseList from "@/components/ExerciseList";
import axios from "axios";
async function getExercises() {
  const res = await axios(
    `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/exercises`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch exercises");
  }
  return res.json();
}

export default async function Home() {
  const exercises = await getExercises();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Exercise List</h1>
      <ExerciseList exercises={exercises} />
    </main>
  );
}
