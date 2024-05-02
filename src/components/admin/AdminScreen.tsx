import { useEffect, useState } from "react";
import { useUserContext } from "../../hooks/ContextHooks";
import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import UserList from "./UserList";
import AdminData from "./AdminData";
import FontAwesome from "react-native-vector-icons/FontAwesome";


const AdminScreen = () => {
  const { user, handleLogout } = useUserContext();

  const [open, setOpen] = useState<boolean>(false);

  if (user?.user_level_id !== 1) {
  return <ActivityIndicator size="large" />;
  }

  const showDropdown = () => {
    setOpen(!open);
  }



  // Admin user content
  return (
    <SafeAreaView className="flex-1 pt-14">
    <View className="w-full flex flex-row justify-center items-center">
      <Text className="text-2xl font-medium py-2 ">Admin Panel</Text>

      <TouchableOpacity
        onPress={showDropdown}
        className="absolute right-4 top-2 z-30"
      >
        <FontAwesome
          name={open ? 'times' : 'bars'}
          size={25}
          color="black"
        />
      </TouchableOpacity>
    </View>
    <View className="border border-b  border-gray-400 w-full" />
    {open && (
      <View className="absolute w-full z-10 px-4 pt-[50px] bg-white" style={{ top: 60 }}>
        <TouchableOpacity onPress={handleLogout} className="mb-4 w-full items-center justify-center py-2 bg-red-500 rounded-xl">
          <Text className="text-lg font-bold text-white">Logout</Text>
        </TouchableOpacity>
      </View>
    )}
    <AdminData />
    <UserList />
  </SafeAreaView>
  );
}

export default AdminScreen;
