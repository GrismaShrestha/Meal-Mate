import { Link } from "react-router-dom";
import Button from "../components/Button";
import TextInput from "../components/TextInput";

export default function LoginUser() {
  return (
    <div className="login-section relative flex min-h-screen flex-col items-center justify-center gap-2 overflow-x-clip">
      <img
        src="/site-logo-2.png"
        alt="Meal Mate"
        className="h-auto w-[200px] object-contain"
      />
      <form className="flex flex-col gap-2">
        <TextInput
          label="Phone number"
          id="phone-number"
          placeholder="Enter your number"
          autoFocus
        />
        <TextInput
          label="Password"
          id="password"
          placeholder="Enter your password"
          type="password"
        />
        <Button className="mt-3">Sign in</Button>
        <Link
          to="/forgot-password"
          className="text-center text-gray-600 hover:underline"
        >
          Forgot your password?
        </Link>
      </form>
    </div>
  );
}
