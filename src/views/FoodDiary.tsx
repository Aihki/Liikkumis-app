import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Button, SafeAreaView } from 'react-native';
import { useUserFoodDiary } from '../hooks/apiHooks'; // Adjust the import path as needed
import { useUserContext } from '../hooks/ContextHooks'; // Adjust the import path as needed
import { FoodDiary as FoodDiaryType} from '../types/DBTypes'; // Adjust the import path as needed

const FoodDiary = () => {
  const [foodDiaryEntries, setFoodDiaryEntries] = useState<FoodDiaryType[]>([]);
  const { getUserFoodDiary, postFoodDiary, deleteFoodDiary } = useUserFoodDiary();
  const { user } = useUserContext(); // Get userId from the context
  const [newMeal, setNewMeal] = useState({meal: "", notes: "", ingredients: ""});

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const entries = await getUserFoodDiary(user.user_id);
        if (entries) {
          setFoodDiaryEntries(entries);
        }
      }
    };

    fetchData();
  }, []);

  const handleAddMeal = async () => {
    if (!user) {
      alert('You must be logged in to add meals.');
      return;
    }
    const newEntry = {
      user_id: user.user_id,
      food_diary_date: new Date().toISOString().split('T')[0], // Keep as string
      food_diary_meal: newMeal.meal,
      food_diary_notes: newMeal.notes,
      food_diary_ingredients: newMeal.ingredients,
      food_diary_calories: 0,
      created_at: new Date(),
      createdAt: new Date(),
    };

    try {
      const response = await postFoodDiary(user.user_id, newEntry);
      console.log(response);

      const insertId = (response as any).insertId;

      const updatedNewEntry = { ...newEntry, foodDiary_id: insertId };

      setFoodDiaryEntries([...foodDiaryEntries, updatedNewEntry]);

      setNewMeal({ meal: '', notes: '', ingredients: '' });
    } catch (error) {
      console.error('Failed to add new meal entry:', error);

    }
  };


  const handleNotesChange = (text: string, foodDiaryId: number) => {
    setFoodDiaryEntries(foodDiaryEntries.map(entry =>
      entry.foodDiary_id === foodDiaryId ? { ...entry, food_diary_notes: text } : entry
    ));
  };

  const handleIngredientsChange = (text: string, foodDiaryId: number) => {
    setFoodDiaryEntries(foodDiaryEntries.map(entry =>
      entry.foodDiary_id === foodDiaryId ? { ...entry, food_diary_ingredients: text } : entry
    ));
  };

  const handleSaveMeal = async (entry: FoodDiaryType) => {
    const response = await postFoodDiary(user?.user_id ?? 0, entry);
    console.log(response);
  };

  const handleDeleteMeal = async (foodDiaryId: number) => {
    if (!user) {
      alert('You must be logged in to delete meals.');
      return;
      }

    const response = await deleteFoodDiary(user.user_id, foodDiaryId);
    console.log(response);

    setFoodDiaryEntries(foodDiaryEntries.filter((entry) => entry.foodDiary_id !== foodDiaryId));
  };

  return (
 <ScrollView className="flex-1 bg-gray-100 pt-10">
    <View className="p-4">
      <Text className="text-lg font-bold mb-4">Meal Name</Text>
      <TextInput
        className="border border-gray-300 p-2 rounded mb-4"
        onChangeText={(text) => setNewMeal({ ...newMeal, meal: text })}
        value={newMeal.meal}
        placeholder="e.g. Breakfast, or Meal 1"
      />
      <Text className="text-lg font-bold mb-4">Notes</Text>
      <TextInput
        className="border border-gray-300 p-2 rounded mb-4"
        onChangeText={(text) => setNewMeal({ ...newMeal, notes: text })}
        value={newMeal.notes}
        placeholder="Any notes about the meal"
        multiline
      />
      <Text className="text-lg font-bold mb-4">Ingredients</Text>
      <TextInput
        className="border border-gray-300 p-2 rounded mb-4"
        onChangeText={(text) => setNewMeal({ ...newMeal, ingredients: text })}
        value={newMeal.ingredients}
        placeholder="e.g. 200g chicken, 100g rice"
        multiline
      />
      <View className="bg-blue-500 rounded-md">
        <TouchableOpacity onPress={handleAddMeal} >
          <Text className="text-white text-center p-2 font-semibold">Add Meal</Text>
        </TouchableOpacity>
      </View>
    </View>
    {foodDiaryEntries.map((entry) => (
        <View className="relative m-4 p-4 bg-white rounded-lg shadow" key={entry.foodDiary_id}>
          <TouchableOpacity
            className="absolute top-0 right-0 p-2"
            onPress={() => handleDeleteMeal(entry.foodDiary_id!)}
          >
            <Text>
              <Text className="text-red-500">X</Text>
            </Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold mb-2">{entry.food_diary_meal}</Text>
          <Text className="mb-1">Notes: {entry.food_diary_notes}</Text>
          <Text>Ingredients:{'\n'}{entry.food_diary_ingredients}</Text>
        </View>
      ))}
  </ScrollView>
  );
}


export default FoodDiary;
