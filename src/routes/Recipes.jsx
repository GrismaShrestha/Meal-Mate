import { useQuery } from "@tanstack/react-query";
import $axios from "../axios";
import LoadingIndicator from "../components/LoadingIndicator";
import { useState } from "react";
import TextInput from "../components/TextInput";
import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function Recipes() {
  const [search, setSearch] = useState("");

  const { isLoading, data } = useQuery({
    queryKey: ["meals"],
    queryFn: () => $axios.get("/meal").then((res) => res.data.meals),
  });

  if (isLoading) {
    return (
      <div className="flex-grow items-center justify-center py-8">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="container my-6 flex-grow">
      <p className="mb-4 text-3xl font-semibold">Search Meals for Recipes</p>
      <TextInput
        placeholder="Search for meal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
      />
      <div className="mb-4 mt-6 grid grid-cols-4 gap-10">
        {data
          .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
          .map((d) => (
            <MealEntry
              key={d.id}
              id={d.id}
              name={d.name}
              image={d.main_image}
            />
          ))}
      </div>
    </div>
  );
}

function MealEntry({ id, name, image }) {
  return (
    <Link className="flex h-[350px] flex-col" to={`/meal/${id}`}>
      <img src={image} className="h-[100px] w-[350px] flex-grow object-cover" />
      <p className="my-4 text-center text-2xl">{name}</p>
      <Button className={"text-center text-white"}>Try now</Button>
    </Link>
  );
}
