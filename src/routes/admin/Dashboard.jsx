import { FaUserAlt } from "react-icons/fa";
import { GiMeal } from "react-icons/gi";
import { FaBookBookmark } from "react-icons/fa6";
import { FaBlog } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import { Chart } from "react-google-charts";
import { useQuery } from "@tanstack/react-query";
import $axios from "../../axios";
import LoadingIndicator from "../../components/LoadingIndicator";

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => $axios.get("/admin/dashboard").then((res) => res.data),
  });

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="flex flex-col gap-[40px]">
      <div className="flex items-start gap-[20px]">
        <div className="grid flex-grow grid-cols-2 gap-[20px]">
          <StatEntry
            title="Total users"
            value={data.metrics.totalUsers}
            icon={<FaUserAlt size={30} color="white" />}
            divStyle={{
              backgroundColor: "#875fc0",
              backgroundImage:
                "linear-gradient(315deg, #875fc0 0%, #5346ba 74%)",
            }}
          />
          <StatEntry
            title="Total meals"
            value={10}
            icon={<GiMeal size={40} color="white" />}
            divStyle={{
              backgroundColor: "#47c5f4",
              backgroundImage:
                "linear-gradient(315deg, #47c5f4 0%, #6791d9 74%)",
            }}
          />
          <StatEntry
            title="Total recipes"
            value={34}
            icon={<FaBookBookmark size={30} color="white" />}
            divStyle={{
              backgroundColor: "#eb4786",
              backgroundImage:
                "linear-gradient(315deg, #eb4786 0%, #b854a6 74%)",
            }}
          />
          <StatEntry
            title="Total blogs"
            value={8}
            icon={<FaBlog size={30} color="white" />}
            divStyle={{
              backgroundColor: "#ffb72c",
              backgroundImage:
                "linear-gradient(315deg, #ffb72c 0%, #f57f59 74%)",
            }}
          />
        </div>
        <StatCard title="Meals and Recipes" className="w-[500px] !p-0">
          <Chart
            chartType="PieChart"
            data={[
              ["Type", "Count"],
              ["Recipes", 34],
              ["Meals", 10],
            ]}
            options={{
              is3D: true,
            }}
            width={"100%"}
            height={300}
          />
        </StatCard>
      </div>
      <StatCard
        title={"Recipe followers"}
        style={{ height: 500, width: "100%" }}
      >
        <Chart
          chartType="Bar"
          width="100%"
          height="400px"
          data={[
            ["Recipe", "Followers"],
            ["Black Bean and Sausage Soup", 1000],
            ["Lentil, Vegetable and Tuna Salad", 1170],
            ["Chorizo, potato & cheese omelette", 660],
            ["Mediterranean Salmon Twist", 1030],
            ["Pan-Fried Wild Salmon", 234],
            ["Lemon Pepper Chicken Pitas", 229],
            ["Paleo Bunless Burgers", 113],
            ["Chargrilled Chicken Tostada Salad", 234],
            ["Chicken and Cinnamon Apple", 534],
          ]}
          options={{
            chart: {
              title: "Number of users adding a given recipe",
            },
          }}
        />
      </StatCard>
      <StatCard title={"Most popular 4 meals"}>
        <div
          style={{ display: "flex", gap: 20, justifyContent: "space-between" }}
        >
          <MealEntry
            id={1}
            name="Peanut Butter Smoothie"
            image="http://localhost:8001/assets/image/peanut_butter.jpg"
          />
          <MealEntry
            id={2}
            name="Spring Roll"
            image="http://localhost:8001/assets/image/spring_roll.jpeg"
          />
          <MealEntry
            id={3}
            name="Quinoa Salad"
            image="http://localhost:8001/assets/image/quenioa_salad.jpeg"
          />
          <MealEntry
            id={4}
            name="Asian Noodles"
            image="http://localhost:8001/assets/image/asian_noodles.PNG"
          />
        </div>
      </StatCard>
    </div>
  );
}

function StatEntry({ title, value, icon, divStyle }) {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        paddingTop: "2rem",
        paddingBottom: "2rem",
        gap: "1rem",
        alignItems: "center",
        borderRadius: "0.375rem",
        width: "100%",
        height: 180,
        ...divStyle,
      }}
    >
      <div className="py-2">{icon}</div>
      <div className="flex flex-col justify-between gap-1">
        <p className="text-sm font-semibold uppercase text-white">{title}</p>
        <p className="text-[2rem] font-extrabold text-white">{value}</p>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="absolute bottom-0 left-0 w-full"
      >
        <path
          fill="rgba(255,255,255,0.3)"
          fillOpacity="1"
          d="M0,192L30,208C60,224,120,256,180,245.3C240,235,300,181,360,144C420,107,480,85,540,96C600,107,660,149,720,154.7C780,160,840,128,900,117.3C960,107,1020,117,1080,112C1140,107,1200,85,1260,74.7C1320,64,1380,64,1410,64L1440,64L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
}

function StatCard({ title, children, className }) {
  return (
    <div className="rounded-md border border-[#E8EAF0] bg-white">
      <div className="border-b border-b-[#E8EAF0] p-4">
        <p className="text-black">{title}</p>
      </div>
      <div className={twMerge("p-5", className)}>{children}</div>
    </div>
  );
}

function MealEntry({ id, name, image }) {
  return (
    <div className="flex h-[300px] w-[200px] flex-col" to={`/meals/${id}`}>
      <img src={image} className="h-[250px] w-[200px] object-cover" />
      <p className="my-4 text-center">{name}</p>
    </div>
  );
}
