//call user profile for other users
import UserProfile from "../../../components/UserProfile";
import { useLocalSearchParams } from "expo-router";

export default function OtherUserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <UserProfile id={`${id}`} />;
}