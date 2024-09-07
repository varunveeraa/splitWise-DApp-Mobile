import { Redirect } from "expo-router";
import { useAccount } from "wagmi";

export default function StartPage() {
  const { isConnected } = useAccount(); 

  if (isConnected) {
    return <Redirect href="/Expense" />;
  } else {
    return <Redirect href="/SignIn" />;
  }
}
