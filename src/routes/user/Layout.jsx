import { Outlet, Link, useLocation } from "react-router-dom";
import { useUser } from "../../hooks/auth";
import { GiMeal } from "react-icons/gi";
import { twMerge } from "tailwind-merge";
import { FaUserClock } from "react-icons/fa6";

export default function UserDashboardLayout() {
  const { data: user } = useUser();
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      <div className="sticky top-0 h-screen w-full max-w-[260px] bg-[#121315] text-gray-50">
        <Link to="/" className="mx-auto mt-4 block w-[120px]">
          <img src="/logo.png" alt="Meal Mate" className="h-auto w-full" />
        </Link>
        <img
          src="/avatar.png"
          alt={user.name}
          className="mx-auto mt-8 h-auto w-[85px] rounded-full"
        />
        <div className="mt-10 flex flex-col gap-2 px-6">
          <Link to="/user">
            <button
              className={twMerge(
                "w-full rounded-xl py-2 text-[1.1rem] font-bold text-gray-400",
                location.pathname == "/user" && "bg-[#252627] text-white",
              )}
            >
              <GiMeal className="mr-4 inline" size={30} />
              Meal Plan
            </button>
          </Link>
          <Link to="/user/remainders">
            <button
              className={twMerge(
                "w-full rounded-xl py-2 text-[1.1rem] font-bold text-gray-400",
                location.pathname == "/user/remainders" &&
                  "bg-[#252627] text-white",
              )}
            >
              <FaUserClock className="mr-4 inline" size={30} />
              Remainders
            </button>
          </Link>
        </div>
      </div>
      <div className="flex-grow bg-[#F1F2F8]">
        <Outlet />
      </div>
    </div>
  );
}
