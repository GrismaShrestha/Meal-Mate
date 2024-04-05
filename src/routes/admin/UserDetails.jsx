import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import $axios from "../../axios";
import LoadingIndicator from "../../components/LoadingIndicator";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import { IoChevronBack } from "react-icons/io5";
import { toast } from "react-toastify";

export default function UserDetails() {
  const { id } = useParams();

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard", "user-details", id],
    queryFn: () =>
      $axios
        .get(`/admin/user/${id}`)
        .then((res) => res.data)
        .catch(() => null),
  });
  // Edit user
  const { mutate, isPending } = useMutation({
    mutationKey: ["edit-user"],
    mutationFn: (values) =>
      $axios.patch(`/admin/user/${values.id}`, values.details),
    onSuccess: () => {
      toast.success("User edited successfully!");
      queryClient.refetchQueries({
        queryKey: ["admin-dashboard", "users"],
      });
      queryClient.refetchQueries({
        queryKey: ["admin-dashboard", "user-details", id],
      });
    },
  });

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (data == null) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-4xl">Given user not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <Link
        to={"/admin/users"}
        className="flex items-center gap-1 self-start hover:underline"
      >
        <IoChevronBack size={14} /> All users
      </Link>
      <h2 className="mt-2 text-3xl">User details</h2>
      <form
        className="mt-4 flex w-[400px] flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();

          const name = e.target.elements.name.value;
          const email = e.target.elements.email.value;
          const phone = e.target.elements.phone.value;

          // Data validation

          if (name == "" || email == "" || phone == "") {
            toast.error("All fields are required!");
            return;
          }

          mutate({
            id,
            details: {
              name,
              email,
              phone,
            },
          });
        }}
      >
        <TextInput label="Name" id="name" defaultValue={data.user.name} />
        <TextInput
          label="Email"
          id="email"
          defaultValue={data.user.email}
          type="email"
        />
        <TextInput label="Phone" id="phone" defaultValue={data.user.phone} />
        <Button className="mt-4" loading={isPending}>
          Save
        </Button>
      </form>
    </div>
  );
}
