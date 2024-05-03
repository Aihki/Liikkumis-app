import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Button, SafeAreaView } from 'react-native';
import { useUserFoodDiary } from '../hooks/apiHooks'; // Adjust the import path as needed
import { useUserContext } from '../hooks/ContextHooks'; // Adjust the import path as needed
import { FoodDiary as FoodDiaryType} from '../types/DBTypes'; // Adjust the import path as needed
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from '@react-navigation/native';

const FoodDiary = () => {
  const [foodDiaryEntries, setFoodDiaryEntries] = useState<FoodDiaryType[]>([]);
  const { getUserFoodDiary, postFoodDiary, deleteFoodDiary } = useUserFoodDiary();
  const { user } = useUserContext(); // Get userId from the context
  const [newMeal, setNewMeal] = useState({meal: "", notes: "", ingredients: ""});
  const [meal, setMeal ] = useState("");
  const [notes, setNotes] = useState("");
  const [ingredients, setIngredients] = useState("");

  const fetchData = async () => {
    if (user) {
      const entries = await getUserFoodDiary(user.user_id);
      if (entries) {
        setFoodDiaryEntries(entries);
      }
    }
  };



  const handleAddMeal = async () => {
    if (!user) {
      alert('You must be logged in to add meals.');
      return;
    }
    const newEntry = {
      user_id: user.user_id,
      food_diary_date: new Date().toISOString().split('T')[0], // Keep as string
      food_diary_meal: meal,
      food_diary_notes: notes,
      food_diary_ingredients: ingredients,
      food_diary_calories: 0,
      created_at: new Date(),
      createdAt: new Date(),
    };

    try {
      const response = await postFoodDiary(user.user_id, newEntry);

      const foodDiaryId = (response as any).food_diary_id;
      // console.log('New food diary entry ID:', foodDiaryId);

      const updatedNewEntry = { ...newEntry, food_diary_id: foodDiaryId };
      setFoodDiaryEntries([...foodDiaryEntries, updatedNewEntry]);
      console.log(foodDiaryEntries);
      setNewMeal({ meal: '', notes: '', ingredients: '' });
    } catch (error) {
      console.error('Failed to add new meal entry:', error);

    }
  };


  const handleDeleteMeal = async (foodDiaryId: number) => {
    if (!user) {
      alert('You must be logged in to delete meals.');
      return;
      }

    const response = await deleteFoodDiary(user.user_id, foodDiaryId);
    console.log(response);

    setFoodDiaryEntries(foodDiaryEntries.filter((entry) => entry.food_diary_id !== foodDiaryId));
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();

      return () => {};
    }, [])
  );


  return (
    <ScrollView className="flex-1 bg-gray-100 pt-10">
      <View className="p-4  border-gray-300 border-b ">
          <Text className="text-lg font-bold mb-2 mt-3 ml-1">Meal Name</Text>
          <TextInput
            className="border border-gray-300 p-2 rounded mb-2"
            onChangeText={(text) => setMeal(text.substring(0, 35))}
            value={meal}
            placeholder="e.g. Breakfast, or Meal 1"
          />
          <Text className="text-lg font-bold mb-2 ml-1">Notes</Text>
        <View className='relative'>
          <TextInput
            className="border border-gray-300 p-3 rounded mb-2 "
            onChangeText={(text) => setNotes(text.substring(0, 200))}
            value={notes}
            numberOfLines={4}
            textAlignVertical="top"
            placeholder="Any notes about the meal"
            multiline
          />
          <Text
            className={`absolute right-2 bottom-5 ${
            notes.length > 175
              ? notes.length >= 200
                ? 'text-red-500'
                : 'text-orange-500'
              : 'text-gray-600'
            }`}>
            {notes.length} / 200
          </Text>
        </View>
        <Text className="text-lg font-bold mb-2 ml-1">Ingredients</Text>
        <View className='relative'>
          <TextInput
            className="border border-gray-300 p-3 rounded mb-4"
            onChangeText={(text) => setIngredients(text.substring(0, 200))}
            value={ingredients}
            numberOfLines={4}
            textAlignVertical="top"
            placeholder="e.g. 200g chicken, 100g rice"
            multiline
          />
          <Text
            className={`absolute right-2 bottom-5 ${
              ingredients.length > 175
              ? ingredients.length >= 175
                  ? 'text-red-500'
                  : 'text-orange-500'
              : 'text-gray-600'
            }`}>
            {ingredients.length} / 200
          </Text>
        </View>
        <View className="bg-cyan-700 rounded-md ">
          <TouchableOpacity onPress={handleAddMeal} >
            <Text className="text-white text-center p-2 font-semibold text-[18px]">Add Meal</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className='mb-14'>
  {foodDiaryEntries.length === 0 ? (
      <Text className='text-center text-[20px] mt-[100px]'>No meals added yet.</Text>
  ) : (
    foodDiaryEntries.map((entry) => (
      <View className="relative mx-4 my-2 p-4 bg-white rounded-lg shadow " key={entry.food_diary_id}>
        <TouchableOpacity
          className="absolute top-0 right-1 p-2"
          onPress={() => handleDeleteMeal(entry.food_diary_id!)}
        >
          <FontAwesome
            name='times'
            size={23}
            color="red"
          />
        </TouchableOpacity>
        <Text className="text-lg font-bold mb-2">{entry.food_diary_meal}</Text>
        <Text className="font-medium">Notes: </Text>
        <Text className="mb-1 ">{entry.food_diary_notes}</Text>
        <Text className='font-medium'>Ingredients:</Text>
        <Text>{entry.food_diary_ingredients}</Text>
      </View>
    ))
  )}
</View>
    </ScrollView>
  );
}


export default FoodDiary;
