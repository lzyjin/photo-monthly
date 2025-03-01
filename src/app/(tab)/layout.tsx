import TabBar from "@/components/tab-bar";

export default function TabLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative w-full h-full min-h-screen">
      {children}
      <TabBar />
    </div>
  );
}