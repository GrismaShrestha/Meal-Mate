import TimePicker from "rc-time-picker";
import moment from "moment";
import Button from "../../components/Button";

export default function Reminders() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-4xl font-medium">Your reminders</h1>

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
          defaultValue={moment().hour(7).minute(0)}
          use12Hours
          className="w-[80px]"
          clearIcon={null}
          allowEmpty={false}
          name="water-01"
        />
        <TimePicker
          showSecond={false}
          defaultValue={moment().hour(9).minute(0)}
          use12Hours
          className="w-[80px]"
          clearIcon={null}
          allowEmpty={false}
          name="water-02"
        />
        <TimePicker
          showSecond={false}
          defaultValue={moment().hour(11).minute(0)}
          use12Hours
          className="w-[80px]"
          clearIcon={null}
          allowEmpty={false}
          name="water-03"
        />
        <TimePicker
          showSecond={false}
          defaultValue={moment().hour(13).minute(0)}
          use12Hours
          className="w-[80px]"
          clearIcon={null}
          allowEmpty={false}
          name="water-04"
        />
        <TimePicker
          showSecond={false}
          defaultValue={moment().hour(15).minute(0)}
          use12Hours
          className="w-[80px]"
          clearIcon={null}
          allowEmpty={false}
          name="water-05"
        />
        <TimePicker
          showSecond={false}
          defaultValue={moment().hour(17).minute(0)}
          use12Hours
          className="w-[80px]"
          clearIcon={null}
          allowEmpty={false}
          name="water-06"
        />
        <TimePicker
          showSecond={false}
          defaultValue={moment().hour(19).minute(0)}
          use12Hours
          className="w-[80px]"
          clearIcon={null}
          allowEmpty={false}
          name="water-07"
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
                defaultValue={moment().hour(7).minute(0)}
                use12Hours
                className="w-[80px]"
                clearIcon={<button className="ml-4 text-xs">Remove</button>}
                name="workout-sun"
                placeholder="Rest Day"
              />
            </td>
            <td className="px-4 py-2">
              <TimePicker
                showSecond={false}
                defaultValue={moment().hour(7).minute(0)}
                use12Hours
                className="w-[80px]"
                clearIcon={<button className="ml-4 text-xs">Remove</button>}
                name="workout-mon"
                placeholder="Rest Day"
              />
            </td>
            <td className="px-4 py-2">
              <TimePicker
                showSecond={false}
                defaultValue={moment().hour(7).minute(0)}
                use12Hours
                className="w-[80px]"
                clearIcon={<button className="ml-4 text-xs">Remove</button>}
                name="workout-tue"
                placeholder="Rest Day"
              />
            </td>
            <td className="px-4 py-2">
              <TimePicker
                showSecond={false}
                defaultValue={moment().hour(7).minute(0)}
                use12Hours
                className="w-[80px]"
                clearIcon={<button className="ml-4 text-xs">Remove</button>}
                name="workout-wed"
                placeholder="Rest Day"
              />
            </td>
            <td className="px-4 py-2">
              <TimePicker
                showSecond={false}
                defaultValue={moment().hour(7).minute(0)}
                use12Hours
                className="w-[80px]"
                clearIcon={<button className="ml-4 text-xs">Remove</button>}
                name="workout-thru"
                placeholder="Rest Day"
              />
            </td>
            <td className="px-4 py-2">
              <TimePicker
                showSecond={false}
                defaultValue={moment().hour(7).minute(0)}
                use12Hours
                className="w-[80px]"
                clearIcon={<button className="ml-4 text-xs">Remove</button>}
                name="workout-fri"
                placeholder="Rest Day"
              />
            </td>
            <td className="px-4 py-2">
              <TimePicker
                showSecond={false}
                defaultValue={undefined}
                use12Hours
                className="w-[80px]"
                clearIcon={<button className="ml-4 text-xs">Remove</button>}
                name="workout-sat"
                placeholder="Rest Day"
              />
            </td>
          </tr>
        </table>
      </div>

      <Button className="mt-5">Save</Button>
    </div>
  );
}
