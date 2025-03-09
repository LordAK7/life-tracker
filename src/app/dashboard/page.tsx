import NavigationBar from "@/components/NavigationBar";

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <NavigationBar />
      <div className="bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--border)] p-6">
        <h2 className="text-xl font-medium mb-6">Dashboard</h2>
        <p className="text-[var(--text-secondary)]">Dashboard component coming soon...</p>
      </div>
    </div>
  );
} 