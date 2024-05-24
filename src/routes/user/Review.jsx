import {useQuery} from "@tanstack/react-query";
import $axios from "../../axios";
import LoadingIndicator from "../../components/LoadingIndicator";
import ReactStars from "react-stars";
import TextAreaInput from "../../components/TextAreaInput";
import dayjs from "dayjs";
import {Link} from "react-router-dom";

export default function UserReviewPage() {
  const {isLoading, data} = useQuery({
    queryKey: ["user-rating"],
    queryFn: () => $axios.get("/user/rating").then((res) => res.data),
  });

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-8">Your review</h1>
      {data ?
        <div>
          <p className="text-gray-500 font-semibold mb-4">You had submitted your review on {dayjs(data.created_at).format("YYYY-MM-DD")}
          </p>
          <div className="mb-4">
            <p className="text-gray-400">Your rating:</p>
            <ReactStars
              count={5}
              value={data.rating}
              size={36}
              half={false}
              color2={"#ffd700"}
              edit={false}
            />
          </div>
          <div>
            <TextAreaInput
              label="Your Review"
              placeholder="Your Review"
              value={data.content}
              rows={6}
              readOnly
            />
          </div>
        </div> : <p>You are yet to submit your review. <Link to={"/rate-us"} className="text-primary font-bold underline">Click here</Link>.</p>
      }
    </div>
  );
}
