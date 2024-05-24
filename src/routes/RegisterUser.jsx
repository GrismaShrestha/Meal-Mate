import { Link } from "react-router-dom";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { useMutation } from "@tanstack/react-query";
import $axios from "../axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function RegisterUser() {
  const navigate = useNavigate();

  const { mutate, isPending, isError } = useMutation({
    mutationKey: ["register", "user"],
    mutationFn: (values) => $axios.post("/user/register", values),
    onSuccess: () => {
      toast.success("User created successfully!");
      navigate("/login/user");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  return (
    <div className="grid min-h-screen grid-cols-2">
      <div className="bg-[url('/get-started/main-veggies.png')] bg-cover bg-no-repeat" />
      <div className="flex flex-col items-center justify-center p-16">
        <p className="text-center text-4xl font-semibold">Sign up</p>
        <p className="mt-2 text-center text-2xl font-light text-gray-400">
          Create an account to access exclusive features
        </p>
        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();

            const name = e.target.elements.name.value;
            const email = e.target.elements.email.value;
            const phone = e.target.elements.phone.value;
            const password = e.target.elements.password.value;
            const confirm = e.target.elements.confirm.value;

            // Data validation

            if (
              name == "" ||
              email == "" ||
              phone == "" ||
              password == "" ||
              confirm == ""
            ) {
              toast.error("All fields are required!");
              return;
            }

            if (password != confirm) {
              toast.error("Passwords do not match");
              return;
            }
            mutate({
              name,
              email,
              phone,
              password,
            });
          }}
        >
          <TextInput
            label="Enter your full name"
            id="name"
            placeholder="Grishma Shrestha"
            autoFocus
          />
          <TextInput
            label="Email"
            id="email"
            placeholder="grishmastha@gmail.com"
            type="email"
          />
          <TextInput
            label="Phone number"
            id="phone"
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
            id="confirm"
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
            <Button
              className="mt-1 w-full text-xl"
              loading={isPending}
              error={isError}
            >
              Sign up
            </Button>
            <p className="mt-1 text-center font-light text-gray-400">
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
