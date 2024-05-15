import { useState } from "react";
import ReactStars from "react-stars";
import TextAreaInput from "../components/TextAreaInput";
import Button from "../components/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import $axios from "../axios";
import LoadingIndicator from "../components/LoadingIndicator";
import { toast } from "react-toastify";

export default function RateUs() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const { isLoading, data } = useQuery({
    queryKey: ["user-rating"],
    queryFn: () => $axios.get("/user/rating").then((res) => res.data),
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["add-user-rating"],
    mutationFn: (values) => $axios.post("/user/rating", values),
    onSuccess: () => {
      toast.success("Your review has been recorded!");
      queryClient.refetchQueries({
        queryKey: ["user-rating"],
      });
    },
  });

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="container grow py-7">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate({ rating, content: review });
        }}
      >
        <h1 className="mb-6 text-4xl font-bold text-primary">Rate Us</h1>

        {data ? (
          <p>Your review has been recorded!</p>
        ) : (
          <>
            <div>
              <p className="text-gray-400">Select a rating:</p>
              <ReactStars
                count={5}
                value={rating}
                onChange={(val) => setRating(val)}
                size={36}
                half={false}
                color2={"#ffd700"}
              />
            </div>
            <div>
              <TextAreaInput
                label="Review"
                placeholder="Please enter your review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
                rows={6}
              />
            </div>
            <Button className="ml-auto mt-4" loading={isPending}>
              Submit
            </Button>
          </>
        )}
      </form>
    </div>
  );
}
