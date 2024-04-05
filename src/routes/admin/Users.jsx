import { Table } from "ka-table";
import { DataType } from "ka-table/enums";
import "ka-table/style.css";

export default function Users() {
  return (
    <Table
      columns={[
        { key: "id", title: "ID", dataType: DataType.Number, width: 40 },
        { key: "name", title: "Name", dataType: DataType.String },
        { key: "phone", title: "Phone", dataType: DataType.String },
        { key: "email", title: "Email", dataType: DataType.String },
      ]}
      data={[
        {
          id: 1,
          name: "Foo Bar",
          phone: "9876543210",
          email: "foo@bar.com",
        },
      ]}
      rowKeyField={"id"}
    />
  );
}
