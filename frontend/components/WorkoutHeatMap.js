import { format, subDays } from "date-fns";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

// Generate mock data for the last year
const getRandomActivityData = () => {
  const today = new Date();
  return Array.from({ length: 365 }).map((_, idx) => {
    const date = subDays(today, idx);
    return {
      date: format(date, "yyyy-MM-dd"),
      count: Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0,
    };
  });
};

const WorkoutHeatmap = () => {
  const activityData = getRandomActivityData();

  return (
    <div className="w-full p-4">
      <CalendarHeatmap
        startDate={subDays(new Date(), 365)}
        endDate={new Date()}
        values={activityData}
        classForValue={(value) => {
          if (!value) {
            return "color-empty";
          }
          return `color-scale-${value.count}`;
        }}
      />
    </div>
  );
};

export default WorkoutHeatmap;
