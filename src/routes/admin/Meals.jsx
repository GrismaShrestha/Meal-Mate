import { Table } from "ka-table";
import { DataType } from "ka-table/enums";
import "ka-table/style.css";
import { useQuery } from "@tanstack/react-query";
import $axios from "../../axios";
import LoadingIndicator from "../../components/LoadingIndicator";
import dayjs from "dayjs";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";

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
        return value;
      }}
      width={"100%"}
    />
  );
}
