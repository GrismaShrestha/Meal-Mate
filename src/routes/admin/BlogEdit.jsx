import { useEffect, useState } from "react";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import $axios from "../../axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../../ckeditor-editor.css";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import LoadingIndicator from "../../components/LoadingIndicator";

export default function BlogEdit() {
  const [imageLoading, setImageLoading] = useState(false);
  const [content, setContent] = useState("");
  const [banner, setBanner] = useState();
  const navigate = useNavigate();

  const { id } = useParams();

  // Blog details
  const { isLoading, data } = useQuery({
    queryKey: ["admin-dashboard", "blog"],
    queryFn: () => $axios.get(`/blog/${id}`).then((res) => res.data.blog),
  });
  useEffect(() => {
    if (!data) return;
    setContent(data.content);
    setBanner(data.banner);
  }, [data]);

  // Edit blog
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["edit-blog"],
    mutationFn: (values) => $axios.patch(`/admin/blog/${id}`, values),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["admin-dashboard", "blogs"],
      });
      toast.success("Blog edited successfully!");
      navigate("/admin/blogs");
    },
  });

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      <form
        className="mt-4"
        onSubmit={async (e) => {
          e.preventDefault();

          const title = e.target.elements.title.value;

          let imageUrl;

          if (banner instanceof File) {
            // Upload image

            const data = new FormData();
            data.append("file", banner);
            data.append("upload_preset", "zgmsnehi");

            try {
              setImageLoading(true);
              const res = await axios.post(
                `https://api.cloudinary.com/v1_1/dkuba0vro/upload`,
                data,
              );
              setImageLoading(false);
              imageUrl = res?.data?.secure_url;
            } catch (error) {
              setImageLoading(false);
              console.log("image upload failed...");
            }
          } else {
            imageUrl = banner;
          }

          mutate({ title, banner: imageUrl, content });
        }}
      >
        <TextInput
          label="Title"
          placeholder="Title of the blog"
          id="title"
          required
          defaultValue={data.title}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="banner" className="mt-4 font-normal text-gray-400">
            Banner
          </label>
          <img
            src={data.banner}
            className="h-[256px] w-[800px] self-center object-contain"
          />
          <input
            placeholder="Banner"
            type="file"
            id="banner"
            onChange={(e) => {
              setBanner(e.target.files[0]);
            }}
          />
        </div>

        <div className="mt-2 flex flex-col gap-1">
          <label htmlFor="content" className="mt-4 font-normal text-gray-400">
            Content
          </label>
          <CKEditor
            id="content"
            editor={ClassicEditor}
            config={{
              toolbar: ["heading", "bold", "italic"],
            }}
            data={content}
            onChange={(_, e) => {
              setContent(e.getData());
            }}
            onReady={(editor) => {
              editor.editing.view.change((writer) => {
                writer.setStyle(
                  "min-height",
                  "300px",
                  editor.editing.view.document.getRoot(),
                );
              });
            }}
          />
        </div>

        <Button className="mt-8" loading={isPending || imageLoading}>
          Submit
        </Button>
      </form>
    </div>
  );
}
