import $axios from "../../axios";
import Button from "../../components/Button";
import Select from "../../components/Select";
import TextInput from "../../components/TextInput";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/auth";
import LoadingIndicator from "../../components/LoadingIndicator";

export default function MealPlanForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["user-settings", user?.id],
    queryFn: () =>
      $axios.get("/user/meal-gen-settings").then((res) => res.data),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["meal-plan-generation"],
    mutationFn: (values) => $axios.post("/user/meal-plan", values),
    onSuccess: () => {
      toast.success("Your meal plan has been generated!");
      navigate("/user", { replace: true });
      queryClient.refetchQueries({
        queryKey: ["user-settings"],
      });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="min-w-screen flex min-h-screen items-center justify-center bg-[#DCE6FE]">
      <form
        className="my-12 flex flex-col items-center justify-center bg-[#FDFFFF] p-8 shadow-[10px_12px_0px_3px_rgba(181,193,230,1)]"
        onSubmit={(e) => {
          e.preventDefault();

          const gender = e.target.elements.gender.value;
          const age = e.target.elements.age.value;
          const height = e.target.elements.height.value;
          const weight = e.target.elements.weight.value;
          const activityLevel = e.target.elements["activity-level"].value;
          const goal = e.target.elements.goal.value;

          mutate({
            gender,
            age,
            height,
            weight,
            "activity-level": activityLevel,
            goal,
          });
        }}
      >
        <img
          src="/vector-graphics/diet-plan.png"
          className="h-[130px] w-auto object-cover"
        />
        <p className="mt-4 text-xl font-medium text-gray-600">
          Your personalized meal plan awaits!
        </p>
        <p className="mt-1 text-[0.9rem] text-gray-600">
          All we ask are your basic info:
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <Select
            autoFocus
            id="gender"
            label="Gender"
            required
            defaultValue={data.gender}
          >
            <option disabled value="" selected>
              Select your gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Select>
          <TextInput
            id="age"
            placeholder="Enter your age"
            label="Age"
            type="number"
            min={1}
            max={99}
            required
            defaultValue={data.age || undefined}
          />
          <TextInput
            id="height"
            label="Height (in cm)"
            placeholder="Enter your height in cm"
            type="number"
            min={121}
            max={241}
            required
            defaultValue={data.height || undefined}
          />
          <TextInput
            id="weight"
            label="Weight (in kg)"
            placeholder="Enter your weight in kg"
            type="number"
            min={20}
            max={400}
            required
            defaultValue={data.weight || undefined}
          />
          <Select
            id="activity-level"
            label="Activity Level (1 = Least active, 6 = Most active)"
            required
            defaultValue={data.activity_level}
          >
            <option disabled value="" selected>
              Select your activity level
            </option>
            <option value="level_1">1</option>
            <option value="level_2">2</option>
            <option value="level_3">3</option>
            <option value="level_4">4</option>
            <option value="level_5">5</option>
            <option value="level_6">6</option>
          </Select>
          <Select id="goal" label="Your goal" required defaultValue={data.goal}>
            <option disabled value="" selected>
              Select your goal
            </option>
            <option value="maintain-weight">Maintain weight</option>
            <option value="mild-weight-loss">Mild weight loss</option>
            <option value="weight-loss">Weight loss</option>
            <option value="extreme-weight-loss">Extreme weight loss</option>
            <option value="mild-weight-gain">Mild weight gain</option>
            <option value="weight-gain">Weight gain</option>
            <option value="extreme-weight-gain">Extreme weight gain</option>
          </Select>
        </div>
        <Button className="mt-6" color="purple" loading={isPending}>
          Submit
        </Button>
        <p className="mt-2 text-xs text-gray-500">
          Note that the meal plan generation will take some time!
        </p>
      </form>
    </div>
  );
}
