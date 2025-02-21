import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getExercise(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}}/exercises/${id}`
  );
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export default async function ActivityPage({ params }) {
  const exercise = await getExercise(params.id);

  if (!exercise) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{exercise.name} Activity</h1>
      <p className="mb-4">
        This is where you would implement the actual exercise activity.
      </p>
      <Link href="/">
        <Button>Back to Exercise List</Button>
      </Link>
    </div>
  );
}
