import MainLayout from "@/components/MainLayout/MainLayout";

export default function HomePage() {
  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-purple-700">Welcome to WedEase!</h1>
      <p className="mt-4 text-lg">Your main content goes here.</p>
    </MainLayout>
  );
}