import { Link } from "react-router-dom";
import TextInput from "../components/TextInput";
import Button from "../components/Button";

export default function RegisterUser() {
  return (
    <div className="grid min-h-screen grid-cols-2">
      <div className="bg-[url('/get-started/main-veggies.png')] bg-cover bg-no-repeat" />
      <div className="flex flex-col p-16 justify-center items-center">
        <p className="text-center text-4xl font-semibold">Sign up</p>
        <p className="mt-2 text-center text-2xl font-light text-gray-400">
          Create an account to access exclusive features
        </p>
        <form className="mt-8 flex flex-col gap-4">
          <TextInput
            label="Enter your full name"
            id="full-name"
            placeholder="Grishma Shrestha"
          />
          <TextInput
            label="Email"
            id="email"
            placeholder="grishmastha@gmail.com"
            type="email"
          />
          <TextInput
            label="Phone number"
            id="phone-number"
            placeholder="Enter correct number"
          />
          <TextInput
            label="Password"
            id="password"
            placeholder="Enter a secure password"
            type="password"
          />
          <TextInput
            label="Confirm password"
            id="password-confirm"
            placeholder="Confirm your password"
            type="password"
          />
          <div className="mt-2">
            <p className="font-light text-gray-400">
              By signing up, you agree to our{" "}
              <Link to="/terms" className="text-gray-700 hover:underline">
                Terms and Privacy Policy
              </Link>
              .
            </p>
            <Button className="mt-1 w-full text-xl">Sign up</Button>
            <p className="text-center font-light text-gray-400 mt-1">
              Already have an account?{" "}
              <Link to="/login/user" className="text-gray-700 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
