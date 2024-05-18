import { useQuery } from "@tanstack/react-query";
import $axios from "../../axios";
import LoadingIndicator from "../../components/LoadingIndicator";
import dayjs from "dayjs";
import Modal from "react-modal";
import { useState } from "react";
import ReactStars from "react-stars";

export default function UserRatings() {
  const { isLoading, data } = useQuery({
    queryKey: ["user-ratings"],
    queryFn: () =>
      $axios.get("/admin/user-ratings").then((res) => res.data.ratings),
  });
  const [selectedDetails, setSelectedDetails] = useState(null);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      <div className="mt-2 flex flex-col gap-6">
        {data.length == 0 && <p>No user ratings</p>}
        <ul className="list-disc pl-4">
          {data.map((d) => (
            <li
              key={d.id}
              className="cursor-pointer hover:underline"
              onClick={() => setSelectedDetails(d)}
            >
              <span className="font-semibold">{d.name}</span> rated us{" "}
              <span className="font-semibold">{d.rating} stars</span> at{" "}
              {dayjs(d.created_at).format("YYYY-MM-DD")}
            </li>
          ))}
        </ul>
      </div>

      <Modal
        isOpen={!!selectedDetails}
        onRequestClose={() => setSelectedDetails(null)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
        contentLabel="Rating details"
      >
        {selectedDetails ? (
          <>
            <p className="text-xl">
              By <span className="font-semibold">{selectedDetails.name}</span>
            </p>

            <ReactStars
              count={5}
              value={selectedDetails.rating}
              size={30}
              half={false}
              color2={"#ffd700"}
              className="pointer-events-none"
            />

            <p className="max-w-[400px]">{selectedDetails.content}</p>
          </>
        ) : null}
      </Modal>
    </div>
  );
}
