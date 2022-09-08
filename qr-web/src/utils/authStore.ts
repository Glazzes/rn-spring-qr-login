import {proxy} from "valtio";
import {User} from "./types";

type State = {
  accessToken: string;
  user: User;
};

export const authState = proxy<State>({
  accessToken: "",
  user: {id: "", username: "", profilePicture: ""},
});

export function setUser(user: User) {
  authState.user = user;
}

export function setAccessToken(token: string) {
  authState.accessToken = token;
}
