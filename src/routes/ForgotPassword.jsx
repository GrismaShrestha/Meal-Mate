import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import $axios from "../axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  // Send OTP request
  const {
    mutate: sendOTP,
    isPending: isSendingOTP,
    variables: sendOTPVariables,
  } = useMutation({
    mutationKey: ["forgot-password-send-otp"],
    mutationFn: (values) =>
      $axios.post("/user/forgot-password/send-otp", values),
    onSuccess: () => {
      toast.success("An OTP has been sent to your phone number");
      setCurrentStep(1);
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    },
  });
  // Verify OTP
  const {
    mutate: verifyOTP,
    isPending: isVerifyingOTP,
    variables: verifyOTPVariables,
  } = useMutation({
    mutationKey: ["forgot-password-check-otp"],
    mutationFn: (values) =>
      $axios.post("/user/forgot-password/verify", {
        phone: sendOTPVariables.phone,
        otp: values.otp,
      }),
    onSuccess: () => {
      toast.success("OTP verified!");
      setCurrentStep(2);
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    },
  });
  // Change password
  const { mutate: changePassword, isPending: isChangingPassword } = useMutation(
    {
      mutationKey: ["forgot-password-change"],
      mutationFn: (values) =>
        $axios.post("/user/forgot-password/set", {
          phone: sendOTPVariables.phone,
          otp: verifyOTPVariables.otp,
          password: values.password,
        }),
      onSuccess: () => {
        toast.success("Your password has been updated successfully!");
        navigate("/login/user", { replace: true });
      },
      onError: (err) => {
        toast.error(err.response.data.message);
      },
    },
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-medium">Forgot Password</h1>

      {/* Phone number input */}
      {currentStep == 0 && (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();

            const phoneNumber = e.target.elements.phone.value;

            if (
              phoneNumber.length != 10 ||
              (!phoneNumber.startsWith("98") &&
                !phoneNumber.startsWith("97") &&
                !phoneNumber.startsWith("96"))
            ) {
              toast.error("Invalid phone number");
              return;
            }

            sendOTP({ phone: phoneNumber });
          }}
        >
          <TextInput
            id="phone"
            placeholder="Your phone number"
            label="Enter your phone number"
            required
          />
          <Button loading={isSendingOTP}>Send OTP</Button>
        </form>
      )}

      {/* OTP input */}
      {currentStep == 1 && (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const otp = e.target.elements.otp.value;
            verifyOTP({ otp });
          }}
        >
          <TextInput
            id="otp"
            placeholder="Your OTP"
            label="Enter the OTP sent to your number"
            required
          />
          <Button loading={isVerifyingOTP}>Confirm OTP</Button>
        </form>
      )}

      {/* New password */}
      {currentStep == 2 && (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const password = e.target.elements.password.value;
            const passwordConfirm = e.target.elements.passwordconfirm.value;

            if (password != passwordConfirm) {
              toast.error("Passwords do not match");
              return;
            }

            changePassword({ password: password });
          }}
        >
          <TextInput
            id="password"
            placeholder="New Password"
            label="Enter your new password"
            required
            type="password"
          />
          <TextInput
            id="passwordconfirm"
            placeholder="Confirm Password"
            label="Confirm your new password"
            required
            type="password"
          />
          <Button loading={isChangingPassword}>Change password</Button>
        </form>
      )}
    </main>
  );
}
