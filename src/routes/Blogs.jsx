import { useQuery } from "@tanstack/react-query";
import $axios from "../axios";
import LoadingIndicator from "../components/LoadingIndicator";
import { Link } from "react-router-dom";
import truncate from "truncate-html";
import dayjs from "dayjs";

export default function Blogs() {
  const { isLoading, data } = useQuery({
    queryKey: ["blogs"],
    queryFn: () => $axios.get("/blog").then((res) => res.data.blogs),
  });

  if (isLoading) {
    return (
      <div className="my-5 flex flex-grow items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="container flex-grow">
      <div className="mt-8 flex flex-col gap-6">
        <p className="mb-4 text-4xl font-semibold text-gray-800">All Blogs</p>
        {data.length == 0 && <p>No blogs</p>}
        {data.map((d) => (
          <div key={d.id} className="flex items-center gap-6">
            <Link
              to={`/blogs/${d.id}`}
              className="text-xl font-semibold hover:underline"
            >
              <div className="h-[64px] w-[300px] min-w-[200px]">
                <img src={d.banner} className="h-full w-full object-contain" />
              </div>
            </Link>
            <div className="flex flex-col gap-2">
              <Link
                to={`/blogs/${d.id}`}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
