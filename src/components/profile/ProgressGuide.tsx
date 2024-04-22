import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';


const guideTexts = {
  Chest: "Mittaa noin nännin korkeudelta",
  Waist: "Mittaa noin vatsan leveimmältä kohdalta. usein navan alta.",
  Pelvis: "Mittaa lantion leveimmältä kohdalta",
  Thigh: "Mittaa reiden paksuimmasta kohdasta",
  Bicep: "Mittaa noin käsivartesi yläosan leveimmältä kohdalta.",
  Calves: "Mittaa pohkeen leveimmältä kohdalta",
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
