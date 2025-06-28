import Navbar from "@/components/MainLayout/Navbar";
import Sidebar from "@/components/MainLayout/Sidebar";
import PageBottom from "@/components/MainLayout/PageBottom";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
      <PageBottom />
    </div>
  );
}