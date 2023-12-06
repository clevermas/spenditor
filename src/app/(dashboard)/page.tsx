import Home from "./components/home";

export default async function HomePage() {
  const data = { totalExpenses: 0 };

  return <Home {...data}></Home>;
}
