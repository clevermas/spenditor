import AppBar from "@/components/app-bar";

export default function Layout({ children }) {
  return (
    <>
      <AppBar></AppBar>
      <main>{children}</main>
    </>
  );
}
