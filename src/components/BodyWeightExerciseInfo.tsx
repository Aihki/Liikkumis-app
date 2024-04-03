import { Text } from "react-native"
import { View } from "react-native"
import { Exercise } from "../types/DBTypes"

const BodyWeightExerciseInfo = ({exercise}: {exercise: Exercise}) => {
  return (
    <View>
      <Text>
        Body Weight Exercise Info
      </Text>
    </View>
  )
}

export default BodyWeightExerciseInfo
