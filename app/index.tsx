import { Redirect } from "expo-router";
import { getToken } from "../utilis/variables";

export default function StartPage() {
  const isSignIn = getToken();
  if (isSignIn) {
    return <Redirect href="/Expense" />;
  } else {
    return <Redirect href="/SignIn" />;
  }
}
