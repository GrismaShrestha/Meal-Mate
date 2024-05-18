import { useState } from "react";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import $axios from "../../axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../../ckeditor-editor.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function BlogAdd() {
  const [imageLoading, setImageLoading] = useState(false);
  const [content, setContent] = useState("");
  const [banner, setBanner] = useState();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["add-blog"],
    mutationFn: (values) => $axios.post(`/admin/blog`, values),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["admin-dashboard", "blogs"],
      });
      toast.success("Blog added successfully!");
      navigate("/admin/blogs", { replace: true });
    },
  });

  return (
    <div>
      <form
        className="mt-4"
        onSubmit={async (e) => {
          e.preventDefault();

          const title = e.target.elements.title.value;

          let imageUrl;

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

          mutate({ title, banner: imageUrl, content });
        }}
      >
        <TextInput
          label="Title"
          placeholder="Title of the blog"
          id="title"
          required
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="banner" className="mt-4 font-normal text-gray-400">
            Banner
          </label>
          <input
            placeholder="Banner"
            type="file"
            id="banner"
            onChange={(e) => {
              setBanner(e.target.files[0]);
            }}
            required
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
              toolbar: ["heading", "bold", "italic", "numberedList", "bulletedList"], }}
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
