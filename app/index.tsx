import { Redirect } from "expo-router";

export default function Index() {
  // In a real app, logic here would check if user is authenticated
  // and redirect to (tabs) or (auth) accordingly.
  return <Redirect href="/login" />;
}
