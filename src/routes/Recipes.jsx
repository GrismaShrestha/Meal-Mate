import { useQuery } from "@tanstack/react-query";
import $axios from "../axios";
import LoadingIndicator from "../components/LoadingIndicator";
import { useState } from "react";
import TextInput from "../components/TextInput";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Select from "../components/Select";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

export default function Recipes() {
  const [searchBy, setSearchBy] = useState("meal-name");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

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
      <div className="flex items-end gap-3">
        <Select
          label="Search by"
          value={searchBy}
          onChange={(e) => {
            setSearch("");
            setPage(1);
            setSearchBy(e.target.value);
          }}
        >
          <option value="meal-name">By meal name</option>
          <option value="ingredients">By ingredients</option>
        </Select>
        <TextInput
          placeholder={
            searchBy == "meal-name" ? "Meal name" : "Ingredient name"
          }
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          autoFocus
          rootClassName="flex-grow"
        />
      </div>
      <div className="mb-4 mt-6 grid grid-cols-4 gap-10">
        {data
          .slice((page - 1) * 10, (page - 1) * 10 + 12)
          .filter((d) => {
            if (searchBy == "meal-name") {
              return d.name.toLowerCase().includes(search.toLowerCase());
            } else {
              return d.ingredients.toLowerCase().includes(search.toLowerCase());
            }
          })
          .map((d) => (
            <MealEntry
              key={d.id}
              id={d.id}
              name={d.name}
              image={d.main_image}
            />
          ))}
      </div>

      <ReactPaginate
        breakLabel="..."
        nextLabel={<FaAngleRight />}
        previousLabel={<FaAngleLeft />}
        forcePage={page - 1}
        onPageChange={(e) => {
          setPage(e.selected + 1);
          window.scrollTo(0, 0);
        }}
        pageCount={Math.ceil(data.length / 12)}
        renderOnZeroPageCount={null}
        containerClassName="pagination"
      />
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
