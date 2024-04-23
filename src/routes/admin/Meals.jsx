import { Table } from "ka-table";
import { DataType } from "ka-table/enums";
import "ka-table/style.css";
import { useQuery } from "@tanstack/react-query";
import $axios from "../../axios";
import LoadingIndicator from "../../components/LoadingIndicator";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";

export default function Meals() {
  const { isLoading, data } = useQuery({
    queryKey: ["admin-dashboard", "meals"],
    queryFn: () => $axios.get("/meal").then((res) => res.data),
  });

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <Table
      columns={[
        { key: "id", title: "ID", dataType: DataType.Number, width: 40 },
        { key: "main_image", title: "Image", width: 250 },
        { key: "name", title: "Name", dataType: DataType.String },
        {
          key: "meal",
          title: "Meal",
          dataType: DataType.String,
          style: { textTransform: "capitalize" },
        },
        { key: "calories", title: "Calories", dataType: DataType.Number },
        { key: "actions", title: "Actions", width: 150 },
      ]}
      data={data.meals}
      rowKeyField={"id"}
      format={({ column, value, rowData }) => {
        if (column.key == "main_image") {
          return (
            <Link to={`/meal/${rowData.id}`}>
              <img src={rowData.main_image} />
            </Link>
          );
        }
        if (column.key == "actions") {
          return (
            <div className="flex flex-col">
              <Link to={`/admin/meals/${rowData.id}`}>
                <button className="flex items-center gap-2 text-green-600 hover:underline">
                  <MdEdit /> Edit
                </button>
              </Link>
            </div>
          );
        }
        return value;
      }}
      width={"100%"}
    />
  );
}
