"use client";
import ExerciseList from "@/components/ExcerciseList";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/v1`
        );
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      }
    };

    fetchData(); // Call the async function
  }, []); // Empty dependency array ensures it runs only once

  if (!data) return <p>Loading...</p>;

  return (
    <main className="px-4 mt-28">
      <h1 className="text-3xl font-bold mb-6">Exercise List</h1>
      <ExerciseList exercises={data} />
    </main>
  );
}
