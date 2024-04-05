import { Outlet, Link, useLocation } from "react-router-dom";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { MdSpaceDashboard } from "react-icons/md";
import { RiUser3Line } from "react-icons/ri";
import { RiUser3Fill } from "react-icons/ri";
import { useAdmin } from "../../hooks/auth";
import { useLocalStorage } from "usehooks-ts";

export default function AdminLayout() {
  const { data: admin } = useAdmin();
  const [, , removeToken] = useLocalStorage("auth-admin");

  return (
    <div className="flex min-h-screen">
      <div className="sticky top-0 flex h-screen min-w-[250px] max-w-[250px] flex-col items-center gap-4 bg-[#3D4B64] px-5 py-8">
        <img
          src="/site-logo.png"
          alt="Meal Mate"
          className="mb-4 h-auto w-[120px] object-contain"
        />
        <div className="w-full">
          <SidebarItem
            activeIcon={<MdSpaceDashboard size={24} />}
            inactiveIcon={<MdOutlineSpaceDashboard size={24} />}
            title={"Dashboard"}
            href={""}
          />
          <SidebarItem
            activeIcon={<RiUser3Fill size={24} />}
            inactiveIcon={<RiUser3Line size={24} />}
            title={"Users"}
            href={"/users"}
          />
        </div>
      </div>
      <div className="flex flex-grow flex-col">
        <div className="menu-bar !py-4">
          <p className="text-xl">Meal Mate Dashboard</p>
          <div className="flex flex-col items-end">
            <p>{admin.name}</p>
            <button className="hover:underline" onClick={() => removeToken()}>
              Logout
            </button>
          </div>
        </div>
        <div className="flex-grow bg-[#F8F8FA] p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ activeIcon, inactiveIcon, title, href }) {
  const { pathname } = useLocation();
  const isActive = pathname === `/admin${href}`;

  return (
    <Link
      to={`/admin${href}`}
      style={{
        display: "block",
        backgroundColor: isActive ? "#303C54" : "transparent",
        color: "#dddddd",
        fontWeight: isActive ? "bold" : undefined,
        borderRadius: 4,
      }}
    >
      <div
        style={{
          padding: 13,
          paddingTop: 12,
          paddingBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 13,
        }}
      >
        {isActive ? activeIcon : inactiveIcon}
        <p>{title}</p>
      </div>
    </Link>
  );
}
