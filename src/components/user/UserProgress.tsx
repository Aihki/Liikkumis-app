import React, { useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {useUserProgress} from '../../hooks/apiHooks';
import {UserProgress} from '../../types/DBTypes';
import { useUserContext } from '../../hooks/ContextHooks';
import { useFocusEffect } from '@react-navigation/native';

const UserProgressList = ({user_id}: {user_id: number}) => {
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const {getUserProgress} = useUserProgress();
  const {handleReloadUser} = useUserContext();




  useFocusEffect(
    React.useCallback(() => {
      const fetchUserProgress = async () => {
        const data = await getUserProgress(user_id);
        setUserProgress(data);
      };

      fetchUserProgress();

      return () => {};
    }, [user_id])
  );


  return (
    userProgress.length === 0 ? (
      <View className="flex items-center justify-center">
      <Text className="text-xl">No progress data available</Text>
    </View>

    ) : (
    <FlatList
      data={userProgress}
      keyExtractor={(item) => item.user_id.toString()}
      renderItem={({item}) => (
          <>
          <View className="flex-row justify-between my-1 mx-2 border-b border-black">
          <Text className="flex text-base">Height:</Text>
          <Text className="flex text-base">{item.progress_height} cm</Text>
        </View><View className="flex-row justify-between my-1 mx-2 border-b border-black">
            <Text className="flex text-base">Weight:</Text>
            <Text className="flex text-base">{item.progress_weight} kg</Text>
          </View><View className="flex-row justify-between my-1 mx-2 border-b border-black">
            <Text className="flex text-base">Bicep_left:</Text>
            <Text className="flex text-base">
              {item.progress_circumference_bicep_l} cm
            </Text>
          </View><View className="flex-row justify-between my-1 mx-2 border-b border-black">
            <Text className="flex text-base">Bicep_right:</Text>
            <Text className="flex text-base">
              {item.progress_circumference_bicep_r} cm
            </Text>
          </View><View className="flex-row justify-between my-1 mx-2 border-b border-black">
            <Text className="flex text-base">Claves_left:</Text>
            <Text className="flex text-base">
              {item.progress_circumference_calves_l} cm
            </Text>
          </View><View className="flex-row justify-between my-1 mx-2 border-b border-black">
            <Text className="flex text-base ">Claves_right:</Text>
            <Text className="flex text-base">
              {item.progress_circumference_calves_r} cm
            </Text>
          </View><View className="flex-row justify-between my-1 mx-2 border-b border-black">
            <Text className="flex text-base">Chest:</Text>
            <Text className="flex text-base">
              {item.progress_circumference_chest} cm
            </Text>
          </View><View className="flex-row justify-between my-1 mx-2 border-b border-black">
            <Text className="flex text-base">Thigh_left:</Text>
            <Text className="flex text-base">
              {item.progress_circumference_thigh_l} cm
            </Text>
          </View><View className="flex-row justify-between my-1 mx-2 border-b border-black">
            <Text className="flex text-base">Thigh_right:</Text>
            <Text className="flex text-base">
              {item.progress_circumference_thigh_r} cm
            </Text>
          </View><View className="flex-row justify-between my-1 mx-2 border-b border-black">
            <Text className="flex text-base">Waist:</Text>
            <Text className="flex text-base">
              {item.progress_circumference_waist} cm
            </Text>
          </View>
          </>
      )}
    />
    )
  );
};

export default UserProgressList;
