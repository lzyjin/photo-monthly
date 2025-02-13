import TabBar from "@/components/tab-bar";
import Calendar from "@/components/calendar";

export default function CalendarPage() {
  return (
    <div className="w-full h-full">
      <Calendar />
      <TabBar/>
    </div>
  );
}