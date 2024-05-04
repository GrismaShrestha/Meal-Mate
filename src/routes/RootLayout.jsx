import { Outlet, Link } from "react-router-dom";
import Button from "../components/Button";
import { RxCaretRight } from "react-icons/rx";
import { useUser } from "../hooks/auth";
import { useLocalStorage } from "usehooks-ts";
import { toast } from "react-toastify";
import { FaUserAlt } from "react-icons/fa";

const headerLinks = [
  {
    title: "Home",
    href: "/",
  },
  // {
  //   title: "Blogs",
  //   href: "/blogs",
  // },
  {
    title: "Planner",
    href: "/user",
  },
  {
    title: "Reminders",
    href: "/user/reminders",
  },
  {
    title: "Recipes",
    href: "/recipes",
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
  const { data: user } = useUser();

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
            <button className="text-xl font-semibold uppercase transition-colors duration-500 hover:text-primary-light">
              {user && <Link to={"/user/profile"}>Your profile</Link>}
            </button>
          </div>
          <Auth />
        </div>
      </div>
    </header>
  );
}

function Auth() {
  const { data: user } = useUser();
  const [, , removeToken] = useLocalStorage("auth");

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <FaUserAlt size={23} color="white" className="inline-block" />
          <div>
            <p>Hi! {user.name}</p>
          </div>
          <Button
            onClick={() => {
              removeToken();
              toast.success("Logged out successfully!", {
                position: "bottom-right",
              });
            }}
          >
            Log out
          </Button>
        </>
      ) : (
        <Link to="/get-started">
          <Button>Login / Register</Button>
        </Link>
      )}
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
                  className="group flex items-center transition-all duration-300 hover:text-primary-very-light"
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
