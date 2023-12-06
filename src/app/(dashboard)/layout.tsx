import AppBar from "@/components/app-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppBar></AppBar>
      <main>{children}</main>
    </>
  );
}
