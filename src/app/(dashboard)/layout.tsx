import Sidebar from "@/components/sidebar/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen pl-[56px] lg:px-[280px] bg-neutral-50 dark:bg-background">
        <Sidebar></Sidebar>
        <main>{children}</main>
      </div>
    </>
  );
}
