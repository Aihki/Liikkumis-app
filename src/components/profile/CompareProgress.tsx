import {
  View,
  Text,
  Button,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useUserContext} from '../../hooks/ContextHooks';
import {useUserProgress} from '../../hooks/apiHooks';
import {UserProgress} from '../../types/DBTypes';
import DateTimePicker from '@react-native-community/datetimepicker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
const units = {
  progress_Weight: 'kg',
  progress_Height: 'cm',
  progress_circumference_Chest: 'cm',
  progress_circumference_Waist: 'cm',
  progress_circumference_Thigh_r: 'cm',
  progress_circumference_Thigh_l: 'cm',
  progress_circumference_Bicep_r: 'cm',
  progress_circumference_Bicep_l: 'cm',
  progress_circumference_Calves_r: 'cm',
  progress_circumference_Calves_l: 'cm',
};


const CompareProgress = () => {
  const {user} = useUserContext();
  const {getUserProgress, getUserProgressByDate} = useUserProgress();
  const [latestProgress, setLatestProgress] = useState<UserProgress[]>([]);
  const [selectedProgress, setSelectedProgress] = useState<UserProgress[]>([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) {
        return;
      }
      const latest = await getUserProgress(user.user_id);
      console.log('newest', latest);
      setLatestProgress(latest);
    };

    fetchProgress();
  }, [user?.user_id]);

  const onChange = async (_: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);

    if (!user) {
      return;
    }
    const date = currentDate.toISOString().split('T')[0].replace(/-/g, '');
    const progress = await getUserProgressByDate(user.user_id, date);
    console.log('selected', progress);
    setSelectedProgress(progress);
  };

  const calculateImprovement = (
    latest: UserProgress[],
    selected: UserProgress[],
    key: keyof UserProgress,
  ) => {
    const latestTotal = latest.reduce(
      (total, progress) => total + Number(progress[key] || 0),
      0,
    );
    const selectedTotal = selected.reduce(
      (total, progress) => total + Number(progress[key] || 0),
      0,
    );
    const improvement = latestTotal - selectedTotal;
    let status: JSX.Element | null = null;
    if (improvement > 0) {
      status = <FontAwesomeIcon icon={faArrowUp} />;
    } else if (improvement < 0) {
      status = <FontAwesomeIcon icon={faArrowDown} />;
    } else {
      status = <FontAwesomeIcon icon={faMinus} />;
    }
    return {latestTotal, selectedTotal, improvement, status};
  };

  return (
    <>
      <ScrollView>
        <View className="flex items-center">
          <Text className="text-2xl font-bold text-center">
            Compare Progress
          </Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}
          className='bg-cyan-700 p-2 rounded-md  self-center m-1.5 mb-7'
          >
            <Text className='text-white text-bold text-lg'>Pick the date what you want to compare</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
          {[
            'progress_weight',
            'progress_height',
            'progress_circumference_chest',
            'progress_circumference_waist',
            'progress_circumference_thigh_r',
            'progress_circumference_thigh_l',
            'progress_circumference_bicep_r',
            'progress_circumference_bicep_l',
            'progress_circumference_calves_r',
            'progress_circumference_calves_l',
          ].map((key) => {
            const {latestTotal, selectedTotal, improvement, status} =
              calculateImprovement(latestProgress, selectedProgress, key);
            return (
              <View className="bg-white shadow-lg rounded-lg p-4 m-1 w-[100%]">
                <View key={key} className="items-center">
                  <Text className="text-center text-xl">
                  {key.replace('progress_', '').replace('_', ' ').replace('circumference', '')}:
                  </Text>
                  <View className="flex-row">
                    <Text className="text-center text-lg">
                      Latest: {latestTotal} {units[key]} {' '}
                      {improvement !== 0 ? (
                        <>
                          ({status} {Math.abs(improvement)} {units[key]})
                        </>
                      ) : (
                        '(-)'
                      )}
                    </Text>
                    <Text className="text-center text-lg ml-[8px]">
                      Selected: {selectedTotal} {units[key]}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
};

export default CompareProgress;
