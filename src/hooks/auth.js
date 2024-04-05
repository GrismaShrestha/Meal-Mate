import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";
import $axios from "../axios.js";

export function useUser() {
  const [token, , removeToken] = useLocalStorage("auth");

  return useQuery({
    queryKey: ["user-auth", token],
    queryFn: () =>
      $axios
        .get("/user/details")
        .then((res) => res.data)
        .catch(() => {
          removeToken();
          return null;
        }),
  });
}

export function useAdmin() {
  const [token, , removeToken] = useLocalStorage("auth-admin");

  return useQuery({
    queryKey: ["admin-auth", token],
    queryFn: () =>
      $axios
        .get("/admin/details")
        .then((res) => res.data)
        .catch(() => {
          removeToken();
          return null;
        }),
  });
}
