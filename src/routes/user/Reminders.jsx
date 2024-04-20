import TimePicker from "rc-time-picker";
import moment from "moment";
import Button from "../../components/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import $axios from "../../axios";
import { toast } from "react-toastify";
import { useUser } from "../../hooks/auth";
import LoadingIndicator from "../../components/LoadingIndicator";

export default function Reminders() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-reminders"],
    mutationFn: (values) => $axios.post("/user/reminders", values),
    onSuccess: () => {
      toast.success("Your reminders has been updated!");
      queryClient.refetchQueries({
        queryKey: ["user-reminders"],
      });
    },
  });
  const { data, isLoading } = useQuery({
    queryKey: ["user-reminders", user?.id],
    queryFn: () =>
      $axios
        .get("/user/reminders")
        .then((res) => res.data)
        .catch(() => null),
  });

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-4xl font-medium">Your reminders</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          const water_01 = e.target.elements.water_01.value;
          const water_02 = e.target.elements.water_02.value;
          const water_03 = e.target.elements.water_03.value;
          const water_04 = e.target.elements.water_04.value;
          const water_05 = e.target.elements.water_05.value;
          const water_06 = e.target.elements.water_06.value;
          const water_07 = e.target.elements.water_07.value;
          const workout_sun = e.target.elements.workout_sun.value;
          const workout_mon = e.target.elements.workout_mon.value;
          const workout_tue = e.target.elements.workout_tue.value;
          const workout_wed = e.target.elements.workout_wed.value;
          const workout_thru = e.target.elements.workout_thru.value;
          const workout_fri = e.target.elements.workout_fri.value;
          const workout_sat = e.target.elements.workout_sat.value;

          mutate({
            water_01,
            water_02,
            water_03,
            water_04,
            water_05,
            water_06,
            water_07,
            workout_sun,
            workout_mon,
            workout_tue,
            workout_wed,
            workout_thru,
            workout_fri,
            workout_sat,
          });
        }}
      >
        {/* Water intakes */}
        <h2 className="mb-2 text-xl font-medium">Water intakes</h2>
        <p>
          Select the times throughout the day at which you want to be reminded
          about your water intake:
        </p>
        <p className="text-sm text-gray-500">Start with our recommended plan</p>
        <div className="my-3 flex gap-4">
          <TimePicker
            showSecond={false}
            defaultValue={data?.reminders?.water_01 && moment(data?.reminders?.water_01, "hh:mm a")}
            use12Hours
            className="w-[80px]"
            clearIcon={null}
            allowEmpty={false}
            name="water_01"
          />
          <TimePicker
            showSecond={false}
            defaultValue={data?.reminders?.water_02 && moment(data?.reminders?.water_02, "hh:mm a")}
            use12Hours
            className="w-[80px]"
            clearIcon={null}
            allowEmpty={false}
            name="water_02"
          />
          <TimePicker
            showSecond={false}
            defaultValue={data?.reminders?.water_03 && moment(data?.reminders?.water_03, "hh:mm a")}
            use12Hours
            className="w-[80px]"
            clearIcon={null}
            allowEmpty={false}
            name="water_03"
          />
          <TimePicker
            showSecond={false}
            defaultValue={data?.reminders?.water_04 && moment(data?.reminders?.water_04, "hh:mm a")}
            use12Hours
            className="w-[80px]"
            clearIcon={null}
            allowEmpty={false}
            name="water_04"
          />
          <TimePicker
            showSecond={false}
            defaultValue={data?.reminders?.water_05 && moment(data?.reminders?.water_05, "hh:mm a")}
            use12Hours
            className="w-[80px]"
            clearIcon={null}
            allowEmpty={false}
            name="water_05"
          />
          <TimePicker
            showSecond={false}
            defaultValue={data?.reminders?.water_06 && moment(data?.reminders?.water_06, "hh:mm a")}
            use12Hours
            className="w-[80px]"
            clearIcon={null}
            allowEmpty={false}
            name="water_06"
          />
          <TimePicker
            showSecond={false}
            defaultValue={data?.reminders?.water_07 && moment(data?.reminders?.water_07, "hh:mm a")}
            use12Hours
            className="w-[80px]"
            clearIcon={null}
            allowEmpty={false}
            name="water_07"
          />
        </div>

        {/* Workout */}
        <h2 className="mb-2 mt-8 text-xl font-medium">Workout</h2>
        <p>
          Select the times throughout the week at which you want to be reminded
          about your workout:
        </p>
        <p className="text-sm text-gray-500">Start with our recommended plan</p>
        <div className="my-3 flex gap-2">
          <table className="p-2">
            <tr>
              <th className="font-medium">Sun</th>
              <th className="font-medium">Mon</th>
              <th className="font-medium">Tue</th>
              <th className="font-medium">Wed</th>
              <th className="font-medium">Thru</th>
              <th className="font-medium">Fri</th>
              <th className="font-medium">Sat</th>
            </tr>
            <tr>
              <td className="px-4 py-2">
                <TimePicker
                  showSecond={false}
                  defaultValue={
                    data?.reminders?.workout_sun &&
                    moment(data?.reminders?.workout_sun, "hh:mm a")
                  }
                  use12Hours
                  className="w-[80px]"
                  clearIcon={<button className="ml-4 text-xs">Remove</button>}
                  name="workout_sun"
                  placeholder="Rest Day"
                />
              </td>
              <td className="px-4 py-2">
                <TimePicker
                  showSecond={false}
                  defaultValue={
                    data?.reminders?.workout_mon &&
                    moment(data?.reminders?.workout_mon, "hh:mm a")
                  }
                  use12Hours
                  className="w-[80px]"
                  clearIcon={<button className="ml-4 text-xs">Remove</button>}
                  name="workout_mon"
                  placeholder="Rest Day"
                />
              </td>
              <td className="px-4 py-2">
                <TimePicker
                  showSecond={false}
                  defaultValue={
                    data?.reminders?.workout_tue &&
                    moment(data?.reminders?.workout_tue, "hh:mm a")
                  }
                  use12Hours
                  className="w-[80px]"
                  clearIcon={<button className="ml-4 text-xs">Remove</button>}
                  name="workout_tue"
                  placeholder="Rest Day"
                />
              </td>
              <td className="px-4 py-2">
                <TimePicker
                  showSecond={false}
                  defaultValue={
                    data?.reminders?.workout_wed &&
                    moment(data?.reminders?.workout_wed, "hh:mm a")
                  }
                  use12Hours
                  className="w-[80px]"
                  clearIcon={<button className="ml-4 text-xs">Remove</button>}
                  name="workout_wed"
                  placeholder="Rest Day"
                />
              </td>
              <td className="px-4 py-2">
                <TimePicker
                  showSecond={false}
                  defaultValue={
                    data?.reminders?.workout_thru &&
                    moment(data?.reminders?.workout_thru, "hh:mm a")
                  }
                  use12Hours
                  className="w-[80px]"
                  clearIcon={<button className="ml-4 text-xs">Remove</button>}
                  name="workout_thru"
                  placeholder="Rest Day"
                />
              </td>
              <td className="px-4 py-2">
                <TimePicker
                  showSecond={false}
                  defaultValue={
                    data?.reminders?.workout_fri &&
                    moment(data?.reminders?.workout_fri, "hh:mm a")
                  }
                  use12Hours
                  className="w-[80px]"
                  clearIcon={<button className="ml-4 text-xs">Remove</button>}
                  name="workout_fri"
                  placeholder="Rest Day"
                />
              </td>
              <td className="px-4 py-2">
                <TimePicker
                  showSecond={false}
                  defaultValue={
                    data?.reminders?.workout_sat &&
                    moment(data?.reminders?.workout_sat, "hh:mm a")
                  }
                  use12Hours
                  className="w-[80px]"
                  clearIcon={<button className="ml-4 text-xs">Remove</button>}
                  name="workout_sat"
                  placeholder="Rest Day"
                />
              </td>
            </tr>
          </table>
        </div>

        <Button className="mt-5" loading={isPending}>
          Save
        </Button>
      </form>
    </div>
  );
}
