import { useQuery } from "@tanstack/react-query";
import $axios from "../axios";
import LoadingIndicator from "../components/LoadingIndicator";
import { Link, useParams } from "react-router-dom";
import "../ckeditor-editor.css";
import { IoChevronBack } from "react-icons/io5";

export default function BlogDetails() {
  const { id } = useParams();

  // Blog details
  const { isLoading, data } = useQuery({
    queryKey: ["admin-dashboard", "blog"],
    queryFn: () => $axios.get(`/blog/${id}`).then((res) => res.data.blog),
  });

  if (isLoading) {
    return (
      <div className="my-5 flex flex-grow items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="my container my-5 flex-grow">
      <Link
        to={"/blogs"}
        className="flex items-center gap-1 self-start hover:underline"
      >
        <IoChevronBack size={14} /> All blogs
      </Link>
      <h1 className="mt-5 text-4xl font-semibold">{data.title}</h1>
      <div className="flex w-full justify-center">
        <img
          className="h-[400px] w-[1200px] object-contain "
          src={data.banner}
        />
      </div>
      <div
        className="ck-editor"
        dangerouslySetInnerHTML={{
          __html: data.content,
        }}
      />
    </div>
  );
}
