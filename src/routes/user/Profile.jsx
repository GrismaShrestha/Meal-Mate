import { Link } from "react-router-dom";
import $axios from "../../axios";
import Button from "../../components/Button";
import LoadingIndicator from "../../components/LoadingIndicator";
import TextInput from "../../components/TextInput";
import { useUser } from "../../hooks/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function UserProfilePage() {
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  // Update user profile
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: (values) => $axios.patch("/user/profile", values),
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong!");
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["user-auth"],
      });
      toast.success("Your profile has been updated!");
    },
  });

  // Plan settings
  const { data: planSettings, isLoading: isLoadingPlanSettings } = useQuery({
    queryKey: ["user-settings", user?.id],
    queryFn: () =>
      $axios.get("/user/meal-gen-settings").then((res) => res.data),
  });

  if (isLoadingPlanSettings) {
    return <LoadingIndicator />;
  }

  return (
    <div className="p-16 pt-10">
      <div>
        <h1 className="mb-8 text-center text-3xl font-semibold">
          User Profile
        </h1>

        {/* Basic info */}
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();

            const name = e.target.elements.name.value;
            const email = e.target.elements.email.value;

            updateProfile({ name, email });
          }}
        >
          <h2 className="text-xl font-medium">Basic Info</h2>
          <TextInput
            label="Your name"
            placeholder="Enter your name"
            id="name"
            defaultValue={user.name}
            required
          />
          <TextInput
            label="Your email"
            placeholder="Enter your email"
            id="email"
            type="email"
            defaultValue={user.email}
            required
          />
          <TextInput
            label="Your phone number (You cannot change your phone number)"
            placeholder="Enter your phone number"
            defaultValue={user.phone}
            required
            disabled
          />
          <Button className="mt-2 self-start" loading={isUpdatingProfile}>
            Update
          </Button>
        </form>

        {/* Plan settings */}
        <div>
          <h2 className="mb-4 mt-10 text-xl font-medium">Plan settings</h2>
          <div className="mb-5 grid w-max grid-cols-2 gap-1">
            <p className="font-medium">Gender</p>
            <p className="capitalize">{planSettings.gender}</p>
            <p className="font-medium">Age</p>
            <p>{planSettings.age} years</p>
            <p className="font-medium">Height</p>
            <p>{planSettings.height} cm</p>
            <p className="font-medium">Weight</p>
            <p>{planSettings.weight} kg</p>
            <p className="font-medium">Activity level</p>
            <p className="capitalize">
              {planSettings.activity_level.split("_").join(" ")}
            </p>
            <p className="font-medium">Goal</p>
            <p className="capitalize">
              {planSettings.goal.split("-").join(" ")}
            </p>
          </div>
          <Link to="/user/meal-plan-form" className="block w-max">
            <Button>Update plan settings</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
