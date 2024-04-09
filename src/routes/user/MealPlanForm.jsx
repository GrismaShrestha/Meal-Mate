import Button from "../../components/Button";
import Select from "../../components/Select";
import TextInput from "../../components/TextInput";

export default function MealPlanForm() {
  return (
    <div className="min-w-screen flex min-h-screen items-center justify-center bg-[#DCE6FE]">
      <form className="my-12 flex flex-col items-center justify-center bg-[#FDFFFF] p-8 shadow-[10px_12px_0px_3px_rgba(181,193,230,1)]">
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
          <Select autoFocus id="gender" label="Gender">
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
          />
          <TextInput
            id="height"
            label="Height (in cm)"
            placeholder="Enter your height in cm"
            type="number"
          />
          <TextInput
            id="weight"
            label="Weight (in km)"
            placeholder="Enter your weight in km"
            type="number"
          />
          <Select
            id="activity-level"
            label="Activity Level (1 = Least active, 6 = Most active)"
          >
            <option disabled value="" selected>
              Select your activity level
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </Select>
        </div>
        <Button className="mt-6" color="purple">
          Submit
        </Button>
      </form>
    </div>
  );
}
