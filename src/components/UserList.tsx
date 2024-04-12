import { useEffect, useState } from "react";
import { useUser } from "../hooks/apiHooks"
import { User } from "../types/DBTypes";
import { useUserContext } from "../hooks/ContextHooks";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";




const UserList = () => {

  const { getUsers, getUserCount, deleteUserAsAdmin } = useUser();
  const { user } = useUserContext();
  const currentUsername = user?.username


  const [ users, setUsers ] = useState<User[] | []>([]);
  const [isOpen, setIsOpen] = useState(false)
  const [usersCount, setUserCount] = useState<number>();

  const toggleUserList = () => {
    setIsOpen(!isOpen);
  }

  const deleteUser = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !user) return
    try {
    await deleteUserAsAdmin(id, token)
    } catch (error) {

    }
  };

  const getAllUsers = async () => {
    if (user?.user_level_id !== 1) {
      return
    }
    try {
      const users = await getUsers();
      const filteredUsers = users.filter(user => user.username !== currentUsername);
      setUsers(filteredUsers)
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchUserCount = async () => {
    try {
      const userCount = await getUserCount();
      setUserCount(userCount.count);
    } catch (error) {
      console.error("Failed to fetch user count:", error);
    }
  };


  useEffect(() => {
    getAllUsers();
    fetchUserCount();
  }, [])

  return (
      <View className="p-4 w-screen">
        <View className="flex flex-row items-center justify-center mb-[1px]">
        <TouchableOpacity
          className="flex flex-row items-center bg-white border border-gray-400 p-2 rounded-lg w-full"
          onPress={toggleUserList}
        >
          <Text className="text-xl font-bold mr-3 flex-1 text-center">User List</Text>
          <FontAwesome
            name={isOpen ? 'caret-up' : 'caret-down'}
            size={25}
            color="black"
            style={{ alignSelf: 'center' }} // Center align if needed
          />
        </TouchableOpacity>

        </View>
        {isOpen && (
          <View className=" h-full">
            <View className="bg-green-100 border border-green-300 p-2 mt-1 mb-2 rounded-lg">
              <Text className="text-xl font-normal text-center">
                Users Count: <Text className="font-bold">{usersCount}</Text>
              </Text>
            </View>
            <View className="flex-1 pb-[225px]">
              <FlatList
                data={users}
                keyExtractor={(item) => item.user_id.toString()}
                renderItem={({ item }) => (
                  <View className="bg-white rounded-lg p-4 mb-1 shadow">
                    <TouchableOpacity onPress={() => deleteUser(item.user_id)}>
                      <FontAwesome
                        name="times"
                        size={25}
                        color="black"
                      />
                    </TouchableOpacity>
                    <Text className="text-lg font-semibold text-gray-800 text-center">{item.username}</Text>
                    <Text className="text-gray-600 text-center">{item.email}</Text>
                    <Text className="text-gray-400 text-center">{new Date(item.created_at).toLocaleString()}</Text>
                  </View>
                )}
              />
            </View>
          </View>
        )}

      </View>
  );
}

export default UserList
