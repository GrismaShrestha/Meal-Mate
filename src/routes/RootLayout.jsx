import { Outlet, Link } from "react-router-dom";
import Button from "../components/Button";
import { RxCaretRight } from "react-icons/rx";

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

const footerLinks = [
  {
    title: "Quick Links",
    links: [
      {
        name: "Home",
        href: "/",
      },
      {
        name: "About",
        href: "/",
      },
      {
        name: "Settings",
        href: "/",
      },
      {
        name: "Help",
        href: "/",
      },
      {
        name: "Terms and policies",
        href: "/",
      },
    ],
  },
  {
    title: "Our Services",
    links: [
      {
        name: "Customization of meals",
        href: "/",
      },
      {
        name: "Reminder system",
        href: "/",
      },
      {
        name: "Recipes",
        href: "/",
      },
    ],
  },
  {
    title: "Others",
    links: [
      {
        name: "Gifts",
        href: "/",
      },
      {
        name: "Articles",
        href: "/",
      },
      {
        name: "Ratings",
        href: "/",
      },
    ],
  },
];

export default function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

function Header() {
  return (
    <header className="bg-primary-dark text-gray-100">
      <div className="container flex items-center justify-between py-2">
        <Link to="/" className="block w-[120px]">
          <img src="/logo.png" alt="Meal Mate" className="h-auto w-full" />
        </Link>
        <div className="flex items-center gap-16">
          <div className="flex items-center gap-6">
            {headerLinks.map((l) => (
              <button
                key={l.title}
                className="text-xl font-semibold uppercase transition-colors duration-500 hover:text-primary-light"
              >
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

function Footer() {
  return (
    <div className="bg-primary-dark py-12 text-gray-100">
      <div className="container flex items-stretch justify-center gap-24">
        <img
          src="/site-logo.png"
          alt="Meal Mate"
          className="h-auto w-[250px] object-contain"
        />
        {footerLinks.map((f) => (
          <div key={f.title}>
            <p className="border-b-[3px] border-b-white pb-3 text-3xl font-semibold text-white">
              {f.title}
            </p>
            <div className="mt-6 flex flex-col gap-3 text-xl">
              {f.links.map((l) => (
                <Link
                  to={l.href}
                  key={l.name}
                  className="hover:text-primary-very-light group flex items-center transition-all duration-300"
                >
                  <RxCaretRight
                    size={22}
                    className="absolute -ml-[7px] block opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />{" "}
                  <span className="transition-transform duration-300 group-hover:translate-x-[14px]">
                    {l.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
