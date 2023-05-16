import { MaterialIcons } from "@expo/vector-icons";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { useThresholdDataStore } from "../../store/thresholdData/slice";
import { Link } from "expo-router";

export default function HomeScreen() {
  // const [selectedValue, setSelectedValue] = useState("0");
  const [editModeTemp, setTempEditMode] = useState(false);
  const [inputTempValue, setTempInputValue] = useState("");
  const [editModeHumid, setHumidEditMode] = useState(false);
  const [inputHumidValue, setHumidInputValue] = useState("");
  const tempThresholdValue = useThresholdDataStore(
    (state) => state.tempThresholdValue,
  );
  const humidThresholdValue = useThresholdDataStore(
    (state) => state.humidThresholdValue,
  );
  // const toggleEditMode = () => {
  //   setTempEditMode(!editModeTemp);
  // };

  const handleTempTextPress = () => {
    setTempEditMode(true);
    setTempInputValue(humidThresholdValue.toString());
  };

  const handleTempTextInputChange = (value: string) => {
    setTempInputValue(value.replace(/[^0-9]/g, ""));
  };

  const handleTempTextInputSubmit = () => {
    const newValue = parseInt(inputTempValue, 10);
    if (!isNaN(newValue) && newValue >= 18 && newValue <= 37) {
      handleSelectHumidThreshold(newValue.toString());
    }
    if (newValue < 18) handleSelectHumidThreshold("18");
    if (newValue > 37) handleSelectHumidThreshold("37");
    setTempEditMode(false);
    setTempInputValue("");
    // handleSelectTempThreshold(selectedValue);
  };

  const handleHumidTextPress = () => {
    setHumidEditMode(true);
    setHumidInputValue(tempThresholdValue.toString());
  };

  const handleHumidTextInputChange = (value: string) => {
    setHumidInputValue(value.replace(/[^0-9]/g, ""));
  };

  const handleHumidTextInputSubmit = () => {
    const newValue = parseInt(inputHumidValue, 10);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      handleSelectTempThreshold(newValue.toString());
    }
    if (newValue < 0) handleSelectTempThreshold("0");
    if (newValue > 100) handleSelectTempThreshold("100");
    setHumidEditMode(false);
    setHumidInputValue("");
    // handleSelectTempThreshold(selectedValue);
  };

  const pushThresholdValue = useThresholdDataStore(
    (state) => state.pushThresholdValue,
  );
  const handleSelectTempThreshold = async (text: string) => {
    const value = Number(text);
    useThresholdDataStore.setState({ tempThresholdValue: value });
    await pushThresholdValue("tempThreshold", value);
  };
  const handleSelectHumidThreshold = async (text: string) => {
    const value = Number(text);
    useThresholdDataStore.setState({ humidThresholdValue: value });
    await pushThresholdValue("humidThreshold", value);
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={styles.hello}>
            <Text style={styles.valueInfo}>Settings</Text>
          </View>
          <View style={styles.top}>
            <View style={styles.item}>
              <View style={styles.title}>
                <Text style={styles.content}>Đặt ngưỡng nhiệt độ</Text>
              </View>
              <View style={styles.box}>
                {/* <TextInput
                  style={{ flex: 0 }}
                  editable
                  numberOfLines={1}
                  maxLength={2}
                  onChangeText={handleSelectTempThreshold}
                  value={tempThresholdValue.toString()}
                  placeholder="10"
                  cursorColor={"#01A4FF"}
                  keyboardType="number-pad"
                /> */}

                {editModeTemp ? (
                  <TextInput
                    style={{ width: 20 }}
                    value={inputTempValue}
                    onChangeText={handleTempTextInputChange}
                    onSubmitEditing={handleTempTextInputSubmit}
                    keyboardType="numeric"
                    autoFocus={true}
                  />
                ) : (
                  <Text
                    style={[{ textAlign: "center", paddingTop: 5 }]}
                    onPress={handleTempTextPress}
                  >
                    {humidThresholdValue.toString()}
                  </Text>
                )}

                <Text style={{ paddingVertical: 5 }}>°C</Text>
              </View>
            </View>
            <View style={styles.item}>
              <View style={styles.title}>
                <Text style={styles.content}>Đặt ngưỡng độ ẩm</Text>
              </View>
              <View style={styles.box}>
                {/* <TextInput
                  style={{ flex: 0 }}
                  editable
                  numberOfLines={1}
                  maxLength={2}
                  onChangeText={handleSelectHumidThreshold}
                  value={humidThresholdValue.toString()}
                  placeholder="10"
                  cursorColor={"#01A4FF"}
                  keyboardType="number-pad"
                /> */}
                {editModeHumid ? (
                  <TextInput
                    style={{ width: 20 }}
                    value={inputHumidValue}
                    onChangeText={handleHumidTextInputChange}
                    onSubmitEditing={handleHumidTextInputSubmit}
                    keyboardType="numeric"
                    autoFocus={true}
                  />
                ) : (
                  <Text
                    style={[{ textAlign: "center", paddingTop: 5 }]}
                    onPress={handleHumidTextPress}
                  >
                    {tempThresholdValue.toString()}
                  </Text>
                )}
                <Text style={{ paddingVertical: 5 }}> %</Text>
              </View>
            </View>
            <View style={styles.item}>
              <View style={styles.title}>
                <Text style={styles.content}>Lịch sử</Text>
              </View>
              <Link href="/history">
                <MaterialIcons name="navigate-next" size={24} color="black" />
              </Link>
            </View>
            <View style={styles.item}>
              <View style={styles.title}>
                <Text style={styles.content}>Đăng xuất</Text>
              </View>
              <MaterialIcons name="navigate-next" size={24} color="black" />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 0,
    margin: 0,
    position: "relative",
  },
  body: {
    flex: 1,
    backgroundColor: "#01a4ff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    position: "relative",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  hello: {
    width: "85%",
    height: "30%",
    backgroundColor: "#01a4ff",
    flex: 0.8,
    position: "relative",
    top: 20,
    left: 30,
  },
  valueInfo: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  top: {
    flex: 1,
    backgroundColor: "#01A4FF",
    borderWidth: 0,
    marginTop: 30,
    marginBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 15,
    margin: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    width: 140,
    height: 20,
    backgroundColor: "#fff",
    //alignItems: "center",
    justifyContent: "center",
  },
  box: {
    flexDirection: "row",
    width: "30%",
    backgroundColor: "grey",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: "center",
  },
  content: {
    color: "black",
  },
});
