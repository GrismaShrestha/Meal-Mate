import { TbCaretDownFilled } from "react-icons/tb";
import { Link } from "react-router-dom";

export default function GetStarted() {
  return (
    <div className="grid min-h-screen grid-cols-2 bg-[url('/background.png')]">
      <div className="flex flex-col p-8">
        <img
          src="/site-logo-2.png"
          alt="Meal Mate"
          className="h-auto w-[250px] self-start object-contain"
        />
        <p className="mt-14 text-6xl font-semibold uppercase text-primary-dark">
          Meal Mate
        </p>
        <p className="mt-6 text-4xl font-light text-primary">
          Welcome to Meal Mate! We{`'`}re thrilled to have you on board. Whether
          you{`'`}re a seasoned chef or just getting started in the kitchen,
          Meal Mate is here to make your meal planning journey easy and
          enjoyable.
        </p>

        <div className="ml-4 mt-10 flex gap-8">
          <div className="group w-[260px]">
            <div className="flex cursor-pointer items-center justify-center gap-4 rounded-lg bg-primary px-6 py-3 text-xl text-gray-100 transition-all hover:bg-primary-hover">
              Create an account
              <TbCaretDownFilled />
            </div>
            <div className="absolute origin-top translate-x-8 translate-y-[1px] scale-y-0 text-gray-100 drop-shadow-2xl transition-all duration-[400ms] group-hover:scale-y-100">
              <Link
                to="/register/user"
                className="block w-[190px] bg-primary px-4 py-3 hover:bg-primary-hover"
              >
                User
              </Link>
            </div>
          </div>
          <div className="group w-[200px]">
            <div className="flex cursor-pointer items-center justify-center gap-4 rounded-lg bg-primary px-6 py-3 text-xl text-gray-100 transition-all hover:bg-primary-hover">
              Login
              <TbCaretDownFilled />
            </div>
            <div className="absolute origin-top translate-x-8 translate-y-[1px] scale-y-0 text-gray-100 drop-shadow-2xl transition-all duration-[400ms] group-hover:scale-y-100">
              <Link
                to="/login/admin"
                className="block w-[140px] border-b border-b-white bg-primary px-4 py-3 hover:bg-primary-hover"
              >
                Admin
              </Link>
              <Link
                to="/login/user"
                className="block w-[140px] bg-primary px-4 py-3 hover:bg-primary-hover"
              >
                User
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[url('/get-started/main-veggies.png')] bg-cover bg-no-repeat" />
    </div>
  );
}
