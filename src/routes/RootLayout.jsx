import { Outlet, Link } from "react-router-dom";
import Button from "../components/Button";

const headerLinks = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Planner",
    href: "/planner",
  },
  {
    title: "Recipes",
    href: "/recipes",
  },
  {
    title: "Reminders",
    href: "/reminders",
  },
  {
    title: "Settings",
    href: "/settings",
  },
];

export default function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function Header() {
  return (
    <header className="bg-primary-dark text-gray-100">
      <div className="container py-2 flex items-center justify-between">
        <Link to="/" className="block w-[120px]">
          <img src="/logo.png" alt="Meal Mate" className="w-full h-auto" />
        </Link>
        <div className="flex items-center gap-16">
          <div className="flex items-center gap-6">
            {headerLinks.map((l) => (
              <button key={l.title} className="text-xl font-semibold uppercase hover:text-primary-light transition-colors duration-500">
                <Link to={l.href}>{l.title}</Link>
              </button>
            ))}
          </div>
          <Auth />
        </div>
      </div>
    </header>
  );
}

function Auth() {
  return (
    <div className="flex items-center gap-4">
      <p>Hi! Grishma</p>
      <Button>Log out</Button>
    </div>
  );
}
