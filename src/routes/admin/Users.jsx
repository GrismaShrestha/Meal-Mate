import { Table } from "ka-table";
import { DataType } from "ka-table/enums";
import "ka-table/style.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import $axios from "../../axios";
import LoadingIndicator from "../../components/LoadingIndicator";
import dayjs from "dayjs";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";

export default function Users() {
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery({
    queryKey: ["admin-dashboard", "users"],
    queryFn: () => $axios.get("/admin/dashboard/users").then((res) => res.data),
  });
  const { mutate, isPending, variables } = useMutation({
    mutationKey: ["delete-user"],
    mutationFn: (values) => $axios.delete(`/admin/user/${values.id}`),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["admin-dashboard", "users"],
      });
    },
  });

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <Table
      columns={[
        { key: "id", title: "ID", dataType: DataType.Number, width: 40 },
        { key: "name", title: "Name", dataType: DataType.String },
        { key: "phone", title: "Phone", dataType: DataType.String },
        { key: "email", title: "Email", dataType: DataType.String },
        { key: "created_at", title: "Created at", dataType: DataType.String },
        { key: "actions", title: "Actions", width: 150 },
      ]}
      data={data.users}
      rowKeyField={"id"}
      format={({ column, value, rowData }) => {
        if (column.key == "created_at") {
          return dayjs(value).format("YYYY/MM/DD");
        }
        if (column.key == "actions") {
          return (
            <div className="flex flex-col">
              <Link to={`/admin/users/${rowData.id}`}>
                <button className="flex items-center gap-2 text-green-600 hover:underline">
                  <MdEdit /> Edit
                </button>
              </Link>
              <button
                className="flex items-center gap-2 text-red-500 hover:underline"
                disabled={isPending && variables?.id == rowData.id}
                onClick={() => {
                  if (
                    window.confirm(
                      `Are you sure you want to delete the given user?\n\nName: ${rowData.name}\nPhone: ${rowData.phone}\nEmail: ${rowData.email}`,
                    )
                  ) {
                    mutate({ id: rowData.id });
                  }
                }}
              >
                <MdDelete /> Delete{" "}
                {isPending && variables?.id == rowData.id && (
                  <Spinner size={13} className="ml-1 text-red-500" />
                )}
              </button>
            </div>
          );
        }
        return value;
      }}
      width={"100%"}
    />
  );
}
