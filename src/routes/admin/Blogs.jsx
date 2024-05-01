import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import $axios from "../../axios";
import LoadingIndicator from "../../components/LoadingIndicator";
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import truncate from "truncate-html";
import dayjs from "dayjs";
import { MdDelete } from "react-icons/md";
import Spinner from "../../components/Spinner";

export default function Blogs() {
  const { isLoading, data } = useQuery({
    queryKey: ["admin-dashboard", "blogs"],
    queryFn: () => $axios.get("/blog").then((res) => res.data.blogs),
  });

  // Delete blog
  const queryClient = useQueryClient();
  const { mutate, isPending, variables } = useMutation({
    mutationKey: ["delete-blog"],
    mutationFn: (values) => $axios.delete(`/admin/blog/${values.id}`),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["admin-dashboard", "blogs"],
      });
    },
  });

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      <Link to="/admin/blogs/add">
        <Button>Add a blog</Button>
      </Link>
      <div className="mt-6 flex flex-col gap-6">
        {data.length == 0 && <p>No blogs</p>}
        {data.map((d) => (
          <div key={d.id} className="flex items-center gap-6">
            <Link
              to={`/admin/blogs/${d.id}`}
              className="text-xl font-semibold hover:underline"
            >
              <div className="h-[64px] w-[200px] min-w-[200px]">
                <img src={d.banner} className="h-full w-full object-contain" />
              </div>
            </Link>
            <div className="flex flex-col gap-2">
              <Link
                to={`/admin/blogs/${d.id}`}
                className="text-xl font-semibold hover:underline"
              >
                {d.title}
              </Link>
              <div
                className="text-sm"
                dangerouslySetInnerHTML={{
                  __html: truncate(d.content, {
                    length: 200,
                    excludes: ["img", "table"],
                    ellipsis: "...",
                  }),
                }}
              />
              <p className="text-xs text-gray-600">
                {dayjs(d.created_at).format("YYYY-MM-DD hh:mm A")}
              </p>
              <button
                className="flex items-center gap-2 text-sm text-red-500 hover:underline"
                disabled={isPending && variables?.id == d.id}
                onClick={() => {
                  if (
                    window.confirm(
                      `Are you sure you want to delete the given blog?\n\nTitle: ${d.title}`,
                    )
                  ) {
                    mutate({ id: d.id });
                  }
                }}
              >
                <MdDelete /> <p className="mt-[2px]">Delete</p>{" "}
                {isPending && variables?.id == d.id && (
                  <Spinner size={13} className="ml-1 text-red-500" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
