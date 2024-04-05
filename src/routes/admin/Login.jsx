import { Link } from "react-router-dom";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import { useMutation } from "@tanstack/react-query";
import $axios from "../../axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

export default function LoginAdmin() {
  const [, setToken] = useLocalStorage("auth-admin");
  const navigate = useNavigate();

  const { mutate, isPending, isError } = useMutation({
    mutationKey: ["login", "admin"],
    mutationFn: (values) =>
      $axios.post("/admin/login", values).then((res) => res.data),
    onSuccess: (data) => {
      setToken(data.token);
      toast.success("Admin login was successful!", {
        position: "bottom-right",
      });
      navigate("/admin", { replace: true });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-2 overflow-x-clip">
      <img
        src="/site-logo-2.png"
        alt="Meal Mate"
        className="h-auto w-[200px] object-contain"
      />
      <p className="-mt-4 mb-2 text-center text-4xl font-semibold">Admin</p>
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();

          const phone = e.target.elements.phone.value;
          const password = e.target.elements.password.value;

          mutate({
            phone,
            password,
          });
        }}
      >
        <TextInput
          label="Phone number"
          id="phone"
          placeholder="Enter your number"
          autoFocus
        />
        <TextInput
          label="Password"
          id="password"
          placeholder="Enter your password"
          type="password"
        />
        <Button className="mt-3" loading={isPending} error={isError}>
          Sign in
        </Button>
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
