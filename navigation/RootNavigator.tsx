// import React, { useContext } from "react";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import Login from "../app/(auth)/Login";
// import Register from "../app/(auth)/Register";
// import DashboardTabs from "./DashboardTabs";
// import Loading from "../components/Loading";
// import { AuthContext } from "../contexts/AuthContext";
//
// const Stack = createNativeStackNavigator();
//
// export default function RootNavigator() {
//     const { user, loading } = useContext(AuthContext);
//
//     if (loading) return <Loading />;
//
//     return (
//         <Stack.Navigator screenOptions={{ headerShown: false }}>
//             {!user ? (
//                 <>
//                     <Stack.Screen name="Login" component={Login} />
//                     <Stack.Screen name="Register" component={Register} />
//                 </>
//             ) : (
//                 <Stack.Screen name="Dashboard" component={DashboardTabs} />
//             )}
//         </Stack.Navigator>
//     );
// }
