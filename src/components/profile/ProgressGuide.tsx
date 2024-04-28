import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';


const guideTexts = {
  Chest: "Measure from about nipple height.",
  Waist: "Measure around the widest part of the abdomen, often below the navel.",
  Pelvis: "Measure at the widest point of the pelvis.",
  Thigh: "Measure from the thickest part of the thigh.",
  Bicep: "Measure around the widest point at the top of your arm.",
  Calves: "Measure at the widest point of the calf.",
};

const styles = StyleSheet.create({
  iconContainer: {
    paddingLeft: 10,
  },
  menuOptions: {
    borderRadius: 10,
  },
});

const TooltipButton = ({ guideName }) => (
  <Menu>
    <MenuTrigger>
      <View style={styles.iconContainer}>
        <FontAwesomeIcon icon={faCircleInfo} />
      </View>
    </MenuTrigger>
    <MenuOptions customStyles={{ optionsContainer: styles.menuOptions }}>
      <MenuOption>
        <Text>{guideTexts[guideName]}</Text>
      </MenuOption>
    </MenuOptions>
  </Menu>
);

export default TooltipButton;
