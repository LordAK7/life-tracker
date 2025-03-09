import TaskManagement from "@/components/TaskManagement";
import NavigationBar from "@/components/NavigationBar";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <NavigationBar />
      <TaskManagement />
    </div>
  );
}
