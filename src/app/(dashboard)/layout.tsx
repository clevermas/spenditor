import AppBar from "@/components/app-bar";
import Sidebar from "@/components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppBar></AppBar>
      <div className="min-h-screen lg:px-[280px] pt-12 bg-neutral-50 dark:bg-background">
        <Sidebar></Sidebar>
        <main>{children}</main>
      </div>
    </>
  );
}
