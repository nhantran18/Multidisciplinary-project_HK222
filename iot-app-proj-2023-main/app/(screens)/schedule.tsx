import {
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  Switch,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import tw from "twrnc";

import axios from "axios";
import {
  ADAFRUIT_IO_URL,
  ADAFRUIT_IO_USERNAME,
  ADAFRUIT_IO_API_KEY,
} from "@env";

// import { Feather } from "@expo/vector-icons";

const sendToAdafruitIO = async (feedKey: string, data: string) => {
  try {
    const response = await axios.post(
      `${ADAFRUIT_IO_URL}/${ADAFRUIT_IO_USERNAME}/feeds/${feedKey}/data`,
      {
        value: data,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-AIO-Key": ADAFRUIT_IO_API_KEY,
        },
      },
    );

    console.log(`Data sent to Adafruit IO (${feedKey}):`, response.data);
  } catch (error) {
    console.error(`Error sending data to Adafruit IO (${feedKey}):`, error);
  }
};

function TimerPage() {
  const [showTextInput, setShowTextInput] = useState(false);

  const [fanStartHourText, setFanStartHourText] = useState("12");
  const [fanStartMinuteText, setFanStartMinuteText] = useState("30");
  const [fanEndHourText, setFanEndHourText] = useState("13");
  const [fanEndMinuteText, setFanEndMinuteText] = useState("30");

  const [pumpStartHourText, setPumpStartHourText] = useState("12");
  const [pumpStartMinuteText, setPumpStartMinuteText] = useState("30");
  const [pumpEndHourText, setPumpEndHourText] = useState("13");
  const [pumpEndMinuteText, setPumpEndMinuteText] = useState("30");

  const [isFanToggled, setIsFanToggled] = useState(false);
  const [isPumpToggled, setIsPumpToggled] = useState(false);

  const handleButtonPress = () => {
    if (showTextInput) {
      let sendData;
      if (!isFanToggled) {
        sendData = `${fanStartHourText}h${fanStartMinuteText}-${fanEndHourText}h${fanEndMinuteText}-0`;
      } else {
        sendData = `${fanStartHourText}h${fanStartMinuteText}-${fanEndHourText}h${fanEndMinuteText}-1`;
      }
      sendToAdafruitIO("thoigianquat", sendData);
      if (!isPumpToggled) {
        sendData = `${pumpStartHourText}h${pumpStartMinuteText}-${pumpEndHourText}h${pumpEndMinuteText}-0`;
      } else {
        sendData = `${pumpStartHourText}h${pumpStartMinuteText}-${pumpEndHourText}h${pumpEndMinuteText}-1`;
      }

      sendToAdafruitIO("thoigianbom", sendData);
    }
    setShowTextInput(!showTextInput);
  };

  const handleFanToggle = () => {
    let sendData;
    if (isFanToggled) {
      sendData = `${fanStartHourText}h${fanStartMinuteText}-${fanEndHourText}h${fanEndMinuteText}-0`;
    } else {
      sendData = `${fanStartHourText}h${fanStartMinuteText}-${fanEndHourText}h${fanEndMinuteText}-1`;
    }
    setIsFanToggled(!isFanToggled);
    sendToAdafruitIO("thoigianquat", sendData);
  };

  const handlePumpToggle = () => {
    let sendData;
    if (isPumpToggled) {
      sendData = `${pumpStartHourText}h${pumpStartMinuteText}-${pumpEndHourText}h${pumpEndMinuteText}-0`;
    } else {
      sendData = `${pumpStartHourText}h${pumpStartMinuteText}-${pumpEndHourText}h${pumpEndMinuteText}-1`;
    }
    setIsPumpToggled(!isPumpToggled);
    sendToAdafruitIO("thoigianbom", sendData);
  };

  const handleFanStartHourInputChange = (inputText: string) => {
    // Remove any non-numeric characters
    const numericInput = inputText.replace(/[^0-9]/g, "");

    // Validate the input range
    if (parseInt(numericInput, 10) <= 23) {
      if (numericInput.length === 1) setFanStartHourText(`0${numericInput}`);
      else if (numericInput.length === 0) setFanStartHourText("00");
      else setFanStartHourText(numericInput.slice(-2));
    } else {
      setFanStartHourText("23");
    }
  };

  const handlePumpStartHourInputChange = (inputText: string) => {
    // Remove any non-numeric characters
    const numericInput = inputText.replace(/[^0-9]/g, "");

    // Validate the input range
    if (parseInt(numericInput, 10) <= 23) {
      if (numericInput.length === 1) setPumpStartHourText(`0${numericInput}`);
      else if (numericInput.length === 0) setPumpStartHourText("00");
      else setPumpStartHourText(numericInput.slice(-2));
    } else {
      setPumpStartHourText("23");
    }
  };

  const handleFanStartMinuteInputChange = (inputText: string) => {
    // Remove any non-numeric characters
    const numericInput = inputText.replace(/[^0-9]/g, "");

    // Validate the input range
    if (parseInt(numericInput, 10) <= 59) {
      if (numericInput.length === 1) setFanStartMinuteText(`0${numericInput}`);
      else if (numericInput.length === 0) setFanStartMinuteText("00");
      else setFanStartMinuteText(numericInput.slice(-2));
    } else {
      setFanStartMinuteText("59");
    }
  };

  const handlePumpStartMinuteInputChange = (inputText: string) => {
    // Remove any non-numeric characters
    const numericInput = inputText.replace(/[^0-9]/g, "");

    // Validate the input range
    if (parseInt(numericInput, 10) <= 59) {
      if (numericInput.length === 1) setPumpStartMinuteText(`0${numericInput}`);
      else if (numericInput.length === 0) setPumpStartMinuteText("00");
      else setPumpStartMinuteText(numericInput.slice(-2));
    } else {
      setPumpStartMinuteText("59");
    }
  };

  const handleFanEndHourInputChange = (inputText: string) => {
    // Remove any non-numeric characters
    const numericInput = inputText.replace(/[^0-9]/g, "");

    // Validate the input range
    if (parseInt(numericInput, 10) <= 23) {
      if (numericInput.length === 1) setFanEndHourText(`0${numericInput}`);
      else if (numericInput.length === 0) setFanEndHourText("00");
      else setFanEndHourText(numericInput.slice(-2));
    } else {
      setFanEndHourText("23");
    }
  };

  const handlePumpEndHourInputChange = (inputText: string) => {
    // Remove any non-numeric characters
    const numericInput = inputText.replace(/[^0-9]/g, "");

    // Validate the input range
    if (parseInt(numericInput, 10) <= 23) {
      if (numericInput.length === 1) setPumpEndHourText(`0${numericInput}`);
      else if (numericInput.length === 0) setPumpEndHourText("00");
      else setPumpEndHourText(numericInput.slice(-2));
    } else {
      setPumpEndHourText("23");
    }
  };

  const handleFanEndMinuteInputChange = (inputText: string) => {
    // Remove any non-numeric characters
    const numericInput = inputText.replace(/[^0-9]/g, "");

    // Validate the input range
    if (parseInt(numericInput, 10) <= 59) {
      if (numericInput.length === 1) setFanEndMinuteText(`0${numericInput}`);
      else if (numericInput.length === 0) setFanEndMinuteText("00");
      else setFanEndMinuteText(numericInput.slice(-2));
    } else {
      setFanEndMinuteText("59");
    }
  };

  const handlePumpEndMinuteInputChange = (inputText: string) => {
    // Remove any non-numeric characters
    const numericInput = inputText.replace(/[^0-9]/g, "");

    // Validate the input range
    if (parseInt(numericInput, 10) <= 59) {
      if (numericInput.length === 1) setPumpEndMinuteText(`0${numericInput}`);
      else if (numericInput.length === 0) setPumpEndMinuteText("00");
      else setPumpEndMinuteText(numericInput.slice(-2));
    } else {
      setPumpEndMinuteText("59");
    }
  };

  return (
    // Outest box
    <ScrollView style={[tw`flex w-full`]}>
      {/* Top box */}
      <View
        style={[
          tw`flex flex-row px-5 pt-15`,
          { backgroundColor: "#01a4ff", height: 200, marginBottom: -80 },
        ]}
      >
        {/* Title box */}
        <View style={[tw`flex items-end bg-transparent`, { width: "59%" }]}>
          <Text style={[{ color: "white", fontSize: 21, fontWeight: "bold" }]}>
            Đặt lịch
          </Text>
        </View>
        {/* Fix Button */}
        <View style={[tw`items-end bg-transparent`, { width: "41%" }]}>
          <Pressable
            style={[
              tw`flex items-center flex-row bg-transparent`,
              { height: 28, width: 28 },
            ]}
            onPress={handleButtonPress}
          >
            <Text style={[tw``, { fontWeight: "bold", color: "blue" }]}>
              {showTextInput ? "Ok" : "Sửa"}
            </Text>
          </Pressable>
        </View>
      </View>
      {/* bottom box */}
      <View style={[tw`px-5`]}>
        {/* Fan timer box */}
        <View
          style={[
            tw`flex flex-row items-center bg-white rounded-xl shadow-xl w-full h-28 my-3`,
          ]}
        >
          {/* logo and name */}
          <View style={[tw`bg-transparent w-1/5 items-center`, {}]}>
            {/* logo */}
            <View style={tw`mb-1`}>
              <MaterialCommunityIcons name="fan" size={30} color="blue" />
            </View>
            <View>
              <Text style={[{ fontWeight: "bold" }]}>Quạt</Text>
            </View>
            {/* name */}
          </View>
          {/* time */}
          <View style={[tw`bg-transparent w-3/5 flex flex-row`, {}]}>
            {/* Start Hour */}
            {showTextInput ? (
              <TextInput
                onChangeText={handleFanStartHourInputChange}
                value={fanStartHourText}
                placeholder="Enter number here"
                keyboardType="numeric"
                style={{
                  borderWidth: 0,
                  width: 40,
                  fontSize: 30,
                  paddingHorizontal: 1,
                  backgroundColor: "bg-transparent",
                  fontWeight: "bold",
                }}
              />
            ) : (
              <Text
                // onPress={handleButtonPress}
                style={{
                  borderWidth: 0,
                  width: 40,
                  fontSize: 30,
                  paddingHorizontal: 1,
                  backgroundColor: "bg-transparent",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                {fanStartHourText}
              </Text>
            )}
            {/* hour symbol here*/}
            <Text style={[{ fontWeight: "bold", fontSize: 30 }]}>:</Text>
            {/* Start minute */}
            {showTextInput ? (
              <TextInput
                onChangeText={handleFanStartMinuteInputChange}
                value={fanStartMinuteText}
                placeholder="Enter number here"
                keyboardType="numeric"
                style={{
                  borderWidth: 0,
                  width: 40,
                  fontSize: 30,
                  paddingHorizontal: 1,
                  backgroundColor: "bg-transparent",
                  fontWeight: "bold",
                }}
              />
            ) : (
              <Text
                // onPress={handleButtonPress}
                style={{
                  borderWidth: 0,
                  width: 40,
                  fontSize: 30,
                  paddingHorizontal: 1,
                  backgroundColor: "bg-transparent",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                {fanStartMinuteText}
              </Text>
            )}

            {/* Dash Symbol */}
            <Text style={[{ fontWeight: "bold", fontSize: 30 }]}> - </Text>
            {/* End Hour */}
            {showTextInput ? (
              <TextInput
                onChangeText={handleFanEndHourInputChange}
                value={fanEndHourText}
                placeholder="Enter number here"
                keyboardType="numeric"
                style={{
                  borderWidth: 0,
                  width: 40,
                  paddingHorizontal: 1,
                  backgroundColor: "bg-transparent",
                  fontSize: 30,
                  fontWeight: "bold",
                }}
              />
            ) : (
              <Text
                // onPress={handleButtonPress}
                style={{
                  borderWidth: 0,
                  width: 40,
                  paddingHorizontal: 1,
                  backgroundColor: "bg-transparent",
                  color: "#000",
                  fontWeight: "bold",
                  fontSize: 30,
                }}
              >
                {fanEndHourText}
              </Text>
            )}
            {/* hour symbol here*/}
            <Text style={[{ fontWeight: "bold", fontSize: 30 }]}>:</Text>
            {/* End minute */}
            {showTextInput ? (
              <TextInput
                onChangeText={handleFanEndMinuteInputChange}
                value={fanEndMinuteText}
                placeholder="Enter number here"
                keyboardType="numeric"
                style={{
                  borderWidth: 0,
                  width: 40,
                  fontSize: 30,
                  paddingHorizontal: 1,
                  backgroundColor: "bg-transparent",
                  fontWeight: "bold",
                }}
              />
            ) : (
              <Text
                // onPress={handleButtonPress}
                style={{
                  borderWidth: 0,
                  width: 40,
                  fontSize: 30,
                  paddingHorizontal: 1,
                  backgroundColor: "bg-transparent",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                {fanEndMinuteText}
              </Text>
            )}
          </View>
          {/* toggle button */}
          <View style={[tw`bg-transparent w-1/5`]}>
            <View style={styles.container}>
              <Switch
                trackColor={{ false: "#b2b2b2", true: "#0f0" }}
                thumbColor={isFanToggled ? "#fff" : "#909090"}
                ios_backgroundColor="#000"
                onValueChange={handleFanToggle}
                value={isFanToggled}
                style={styles.switch}
              />
            </View>
          </View>
        </View>
        {/* Pump Timer box */}
        <View
          style={[
            tw`flex flex-row items-center bg-white rounded-xl shadow-xl w-full h-28 my-3`,
          ]}
        >
          {/* logo and name */}
          <View style={[tw`bg-transparent w-1/5 items-center`, {}]}>
            {/* logo */}
            <View style={tw`mb-1`}>
              <Ionicons name="water" size={30} color="blue" />
            </View>
            <View>
              <Text style={[{ fontWeight: "bold", fontSize: 13 }]}>
                Máy phun
              </Text>
            </View>
            <View>
              <Text style={[{ fontWeight: "bold", fontSize: 13 }]}>sương</Text>
            </View>
            {/* name */}
          </View>
          {/* time */}
          <View style={[tw`bg-transparent w-3/5 flex flex-row`, {}]}>
            {/* Start Hour */}
            {showTextInput ? (
              <TextInput
                onChangeText={handlePumpStartHourInputChange}
                value={pumpStartHourText}
                placeholder="Enter number here"
                keyboardType="numeric"
                style={{
                  borderWidth: 0,
                  width: 40,
                  fontSize: 30,
                  paddingHorizontal: 1,
                  backgroundColor: "bg-transparent",
                  fontWeight: "bold",
                }}
              />
            ) : (
              <Text
                // onPress={handleButtonPress}
                style={{
                  borderWidth: 0,
                  width: 40,
                  fontSize: 30,
                  paddingHorizontal: 1,
                  backgroundColor: "bg-transparent",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                {pumpStartHourText}
              </Text>
            )}
            {/* hour symbol here*/}
            <Text style={[{ fontWeight: "bold", fontSize: 30 }]}>:</Text>
            {/* Start minute */}
            {showTextInput ? (
              <TextInput
                onChangeText={handlePumpStartMinuteInputChange}
                value={pumpStartMinuteText}
                placeholder="Enter number here"
                keyboardType="numeric"
                style={{
                  borderWidth: 0,
                  width: 40,
                  fontSize: 30,
                  paddingHorizontal: 1,
                  backgroundColor: "bg-transparent",
                  fontWeight: "bold",
                }}
              />
            ) : (
              <Text
                // onPress={handleButtonPress}
                style={{
                  borderWidth: 0,
                  width: 40,
                  fontSize: 30,
                  paddingHorizontal: 1,
                  backgroundColor: "bg-transparent",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                {pumpStartMinuteText}
              </Text>
            )}

            {/* Dash Symbol */}
            <Text style={[{ fontWeight: "bold", fontSize: 30 }]}> - </Text>
            {/* End Hour */}
            {showTextInput ? (
              <TextInput
                onChangeText={handlePumpEndHourInputChange}
                value={pumpEndHourText}
                placeholder="Enter number here"
                keyboardType="numeric"
                style={{
                  borderWidth: 0,
                  width: 40,
                  paddingHorizontal: 1,
                  backgroundColor: "bg-transparent",
                  fontSize: 30,
                  fontWeight: "bold",
                }}
              />
            ) : (
              <Text
                // onPress={handleButtonPress}
                style={{
                  borderWidth: 0,
                  width: 40,
                  paddingHorizontal: 1,
                  backgroundColor: "bg-transparent",
                  color: "#000",
                  fontWeight: "bold",
                  fontSize: 30,
                }}
              >
                {pumpEndHourText}
              </Text>
            )}
            {/* hour symbol here*/}
            <Text style={[{ fontWeight: "bold", fontSize: 30 }]}>:</Text>
            {/* End minute */}
            {showTextInput ? (
              <TextInput
                onChangeText={handlePumpEndMinuteInputChange}
                value={pumpEndMinuteText}
                placeholder="Enter number here"
                keyboardType="numeric"
                style={{
                  borderWidth: 0,
                  width: 40,
                  fontSize: 30,
                  paddingHorizontal: 1,
                  backgroundColor: "bg-transparent",
                  fontWeight: "bold",
                }}
              />
            ) : (
              <Text
                // onPress={handleButtonPress}
                style={{
                  borderWidth: 0,
                  width: 40,
                  fontSize: 30,
                  paddingHorizontal: 1,
                  backgroundColor: "bg-transparent",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                {pumpEndMinuteText}
              </Text>
            )}
          </View>
          {/* toggle button */}
          <View style={[tw`bg-transparent w-1/5`]}>
            <View style={styles.container}>
              <Switch
                trackColor={{ false: "#b2b2b2", true: "#0f0" }}
                thumbColor={isPumpToggled ? "#fff" : "#909090"}
                ios_backgroundColor="#000"
                onValueChange={handlePumpToggle}
                value={isPumpToggled}
                style={styles.switch}
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    height: 10,
    width: 40,
  },
  switch: {
    transform: [{ scaleX: 2.5 }, { scaleY: 2.5 }],
  },
});

export default function TimerScreen() {
  return (
    <View style={tw`flex-1 `}>
      <View style={tw`items-center flex-1`}>
        <TimerPage />
      </View>
    </View>
  );
}
