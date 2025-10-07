import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
    const { user } = useAuth();
    return user ? <Redirect href="/(protected)/home" /> : <Redirect href="/login" />;
}
