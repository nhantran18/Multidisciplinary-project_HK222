import { Pressable, Text, View } from "react-native";
import tw from "twrnc";
import { FontAwesomeIcon } from "../../components/atoms/icon";
import { useIntervalAsync } from "../../hooks/useInterval";
import { useMountEffect } from "../../hooks/useMountEffect";
import { useOuputDeviceDataStore } from "../../store/outputDevice/slice";
import { useSensorDataStore } from "../../store/sensorData/slice";
import axios from "axios";
import React, { useState, useEffect } from "react";

// const elecConsumeDay = 32.5;
const elecConsumeWeek = 342;
const powerOfFan = 45;
const powerOfPump = 200;

interface DataPoint {
  value: string;
  created_at: string;
}

const fetchAndUpdateData = async (feedKey: string) => {
  try {
    // set start is 0:00AM today
    const currentDate = new Date();
    const start = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      0,
      0,
      0,
    ); // 0:00AM
    // console.log(start.getTime());
    const end = new Date(); //current time
    // console.log(end.getTime());
    // get data from 0:00 to current time
    const response = await axios.get<DataPoint[]>(
      `https://io.adafruit.com/api/v2/luutodinh/feeds/${feedKey}/data`,
      {
        params: {
          start_time: start.toISOString(),
          end_time: end.toISOString(),
        },
        timeout: 5000,
      },
    );

    const data = response.data;
    const duration = processHistoricalData(data);

    return duration;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.message);
    } else {
      console.error("Error:", error);
    }
    return 0;
  }
};
// 0 - h
const processHistoricalData = (data: DataPoint[]) => {
  let isValueOne = false; // flag
  let endTime: Date; //
  let duration = 0;
  let firstTime = true; //flag for the first timstamp

  data.forEach((dataPoint) => {
    const value = dataPoint.value;

    if (value === "0" && !isValueOne) {
      // Start of 1 value duration
      endTime = new Date(dataPoint.created_at);
      console.log(endTime.getTime());
      isValueOne = true;
    } else if (value === "1" && isValueOne) {
      // End of 1 value duration
      const startTime = new Date(dataPoint.created_at);
      console.log(startTime.getTime());

      const durationInSeconds =
        (endTime.getTime() - startTime.getTime()) / 1000;
      duration += durationInSeconds; //
      isValueOne = false;
    } else if (value === "1" && !isValueOne && firstTime) {
      firstTime = false;
      endTime = new Date();
      const startTime = new Date(dataPoint.created_at);
      console.log(endTime.getTime());
      console.log(startTime.getTime());
      const durationInSeconds =
        (endTime.getTime() - startTime.getTime() - 235000) / 1000; // off set of the new Date()
      duration += durationInSeconds; //
      isValueOne = false;
    }
    if (firstTime === true) firstTime = false;
  });

  console.log("Total Duration:", duration);
  return duration; // thời gian bật quạt/ bơm
};

function CurrentButtonInfoBar() {
  const temperatureValue = useSensorDataStore(
    (state) => state.temperatureValue,
  );
  const humidityValue = useSensorDataStore((state) => state.humidityValue);
  const fanValue = useOuputDeviceDataStore((state) => state.fanValue);
  const pumpValue = useOuputDeviceDataStore((state) => state.pumpValue);
  const autoValue = useOuputDeviceDataStore((state) => state.autoButtonValue);
  const lastUpdated = useSensorDataStore((state) => state.timestamp);
  const fetchData = useOuputDeviceDataStore((state) => state.fetchData);
  const controlDevice = useOuputDeviceDataStore((state) => state.controlDevice);
  useMountEffect(() => {
    fetchData();
  });
  const update = useIntervalAsync(fetchData, 2000);
  const [fanDuration, setFanDuration] = useState(0);
  const [pumpDuration, setPumpDuration] = useState(0);

  const updateDuration = async (
    feedKey: string,
    setDuration: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    const duration = await fetchAndUpdateData(feedKey);
    setDuration(duration);
  };

  useEffect(() => {
    // Fetch and update the total duration for Fan every 30 seconds
    const intervalId1 = setInterval(
      () => updateDuration("nutquat", setFanDuration),
      30000,
    );

    // Fetch and update the total duration for Pump every 45 seconds
    const intervalId2 = setInterval(
      () => updateDuration("nutbomnuoc", setPumpDuration),
      45000,
    );

    // Clean up the intervals on component unmount
    return () => {
      clearInterval(intervalId1);
      clearInterval(intervalId2);
    };
  }, []);

  const controlFan = async () => {
    const isSuccess = autoValue ? false : await controlDevice("fan");
    if (isSuccess) {
      useOuputDeviceDataStore.setState({ fanValue: !fanValue });
    }
  };
  const controlPump = async () => {
    const isSuccess = autoValue ? false : await controlDevice("pump");
    if (isSuccess) {
      useOuputDeviceDataStore.setState({ pumpValue: !pumpValue });
    }
  };
  const controlAutoButton = async () => {
    const isSuccess = await controlDevice("autoButton");
    if (isSuccess) {
      useOuputDeviceDataStore.setState({ autoButtonValue: !autoValue });
    }
  };
  return (
    // Outest box
    <View style={tw`w-full`}>
      {/* Top box */}
      <View style={[tw`px-5 pb-5 pt-15`, { backgroundColor: "#00adff" }]}>
        {/* Title */}
        <View style={[tw`flex items-center bg-transparent`, {}]}>
          <Text
            style={[
              {
                // fontFamily: "Montserrat",
                fontSize: 21,
                fontWeight: "700",
                color: "white",
              },
            ]}
          >
            Điều khiển thủ công
          </Text>
        </View>
        {/* stats */}
        <View
          style={tw`flex flex-row justify-around w-full py-6 bg-transparent`}
        >
          {/* Energy */}
          <View style={tw`flex flex-row items-center bg-transparent`}>
            <View style={tw`items-center bg-transparent w-9`}>
              <FontAwesomeIcon
                name="flash"
                color="#ffffff"
                style={tw`text-3xl`}
              />
            </View>
            <View style={tw`bg-transparent`}>
              <View style={tw`bg-transparent`}>
                <Text
                  style={[
                    tw`p-px text-white`,
                    {
                      // fontFamily: "Montserrat",
                      fontSize: 17,
                      fontWeight: "700",
                      color: "white",
                    },
                  ]}
                >
                  {elecConsumeWeek} KwH{" "}
                </Text>
                <Text
                  style={[
                    tw`p-px text-white`,
                    {
                      // fontFamily: "Montserrat",
                      fontSize: 10,
                      color: "white",
                      fontWeight: "normal",
                    },
                  ]}
                >
                  ĐIỆN TIÊU THỤ{" "}
                </Text>
              </View>
            </View>
          </View>
          {/* Temperature */}
          <View style={tw`flex flex-row items-center bg-transparent`}>
            <View style={tw`items-center bg-transparent w-9`}>
              <FontAwesomeIcon
                name="thermometer"
                color="#ffffff"
                style={tw`text-4xl`}
              />
            </View>
            <View style={tw`bg-transparent`}>
              <View style={tw`bg-transparent`}>
                <Text
                  style={[
                    tw`p-px text-white`,
                    {
                      // fontFamily: "Montserrat",
                      fontSize: 17,
                      fontWeight: "700",
                      color: "white",
                    },
                  ]}
                >
                  {`${temperatureValue}\u1D52C`}{" "}
                </Text>
                <Text
                  style={[
                    tw`p-px text-white`,
                    {
                      // fontFamily: "Montserrat",
                      fontSize: 10,
                      color: "white",
                      fontWeight: "normal",
                    },
                  ]}
                >
                  NHIỆT ĐỘ{" "}
                </Text>
              </View>
            </View>
          </View>
          {/* Humidity */}
          <View style={tw`flex flex-row items-center bg-transparent`}>
            <View style={tw`items-center bg-transparent w-9`}>
              <FontAwesomeIcon
                name="tint"
                color="#ffffff"
                style={tw`text-4xl`}
              />
            </View>
            <View style={tw`bg-transparent`}>
              <View style={tw`bg-transparent`}>
                <Text
                  style={[
                    tw`p-px text-white`,
                    {
                      // fontFamily: "Montserrat",
                      fontSize: 17,
                      fontWeight: "700",
                      color: "white",
                    },
                  ]}
                >
                  {`${humidityValue}%`}{" "}
                </Text>
                <Text
                  style={[
                    tw`p-px text-white`,
                    {
                      // fontFamily: "Montserrat",
                      fontSize: 10,
                      color: "white",
                      fontWeight: "normal",
                    },
                  ]}
                >
                  ĐỘ ẨM{" "}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* Buttons */}
        <View style={tw`flex flex-row items-center h-32 bg-transparent`}>
          <View style={tw`w-5/12 bg-transparent`}>
            {/* Auto Button */}
            <Pressable
              style={[
                {
                  borderBottomWidth: 2,
                  backgroundColor: autoValue ? "#00f" : "#E8E8E8",
                  height: "90%",
                },
                tw`flex flex-row items-center justify-around mx-1 border-t-0 border-black rounded-lg border-x-0`,
              ]}
              onPress={controlAutoButton}
            >
              <View style={tw`flex flex-row justify-around bg-transparent`}>
                <View style={tw`flex flex-row items-center bg-transparent`}>
                  <FontAwesomeIcon
                    name="cogs"
                    color={autoValue ? "#ffffff" : "#000"}
                    style={tw`pl-1 text-5xl`}
                  />
                </View>
                <View style={tw`ml-1 bg-transparent`}>
                  <View style={tw`flex items-center m-1 bg-transparent`}>
                    <Text
                      style={[
                        {
                          color: autoValue ? "white" : "black",
                          // fontFamily: "Montserrat",
                          fontSize: 12,
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      Tính năng
                    </Text>
                    <Text
                      style={[
                        {
                          color: autoValue ? "white" : "black",
                          // fontFamily: "Montserrat",
                          fontSize: 12,
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      tự động
                    </Text>
                  </View>
                  <View style={tw`m-1 bg-transparent`}>
                    <Text
                      style={[
                        {
                          color: autoValue ? "white" : "black",
                          // fontFamily: "Montserrat",
                          fontSize: 12,
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      {autoValue ? "ĐANG BẬT" : "ĐANG TẮT"}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          </View>
          <View style={[tw`w-7/12 bg-transparent `]}>
            {/* Fan Button */}
            <Pressable
              style={[
                tw`flex flex-row items-center justify-start px-px m-1 border-t-0 border-black rounded-lg border-x-0`,
                {
                  backgroundColor: fanValue ? "#0071ff" : "#ffffff",
                  borderBottomWidth: 2,
                  height: "43%",
                },
              ]}
              onPress={controlFan}
            >
              <View style={tw`mx-4 bg-transparent`}>
                <FontAwesomeIcon
                  name="asterisk"
                  color={fanValue ? "#ffffff" : "#0071ff"}
                  style={tw`text-3xl`}
                />
              </View>
              <View style={tw`mx-1 bg-transparent`}>
                <View style={tw`m-px bg-transparent`}>
                  <Text
                    style={[
                      {
                        color: fanValue ? "white" : "black",
                        // fontFamily: "Montserrat",
                        fontSize: 11,
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    Quạt
                  </Text>
                </View>
                <View style={tw`m-px bg-transparent`}>
                  <Text
                    style={[
                      {
                        color: fanValue ? "white" : "black",
                        // fontFamily: "Montserrat",
                        fontSize: 10,
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {fanValue ? "ĐANG BẬT" : "ĐANG TẮT"}
                  </Text>
                </View>
              </View>
            </Pressable>
            {/* Pump Button */}
            <Pressable
              style={[
                tw`flex flex-row items-center justify-start px-px m-1 border-t-0 border-black rounded-lg border-x-0`,
                {
                  backgroundColor: pumpValue ? "#0071ff" : "#ffffff",
                  borderBottomWidth: 2,
                  height: "43%",
                },
              ]}
              onPress={controlPump}
            >
              <View style={tw`mx-4 bg-transparent`}>
                <FontAwesomeIcon
                  name="cloud"
                  color={pumpValue ? "#ffffff" : "#0071ff"}
                  style={tw`text-3xl`}
                />
              </View>
              <View style={tw`bg-transparent `}>
                <View style={tw`m-px bg-transparent`}>
                  <Text
                    style={[
                      {
                        color: pumpValue ? "white" : "black",
                        // fontFamily: "Montserrat",
                        fontSize: 11,
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    Máy phun sương
                  </Text>
                </View>
                <View style={tw`m-px bg-transparent`}>
                  <Text
                    style={[
                      {
                        color: pumpValue ? "white" : "black",
                        // fontFamily: "Montserrat",
                        fontSize: 10,
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {pumpValue ? "ĐANG BẬT" : "ĐANG TẮT"}
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
      {/* Bottom box */}
      <View style={tw`px-5 py-2 bg-transparent`}>
        {/* Text  */}
        <View style={tw`flex items-end px-1 py-1 bg-transparent`}>
          <Text
            style={[
              {
                color: "#0071ff",
                fontSize: 10,
                fontWeight: "normal",
                backgroundColor: "transparent",
              },
            ]}
          >
            Số liệu được tính từ 0:00 AM
          </Text>
        </View>

        {/* Fan */}
        <View
          style={tw`flex items-center px-6 py-3 my-2 bg-white shadow-xl rounded-2xl`}
        >
          {/* Title */}
          <View style={[{}]}>
            <Text style={[{ color: "#0071ff", fontWeight: "bold" }]}>Quạt</Text>
          </View>
          {/* Content */}
          <View style={tw`flex flex-row justify-between w-full py-1`}>
            {/* Power */}
            <View style={tw`flex flex-row bg-transparent`}>
              <View style={tw`w-5 bg-transparent`}>
                <FontAwesomeIcon
                  name="flash"
                  color={"#000000"}
                  style={tw`text-2xl`}
                />
              </View>
              <View style={tw`bg-transparent`}>
                <View>
                  <Text style={[{ color: "#0071ff", fontWeight: "bold" }]}>
                    {Math.floor((powerOfFan * fanDuration) / 3600)} kwh
                  </Text>
                </View>
                <View>
                  <Text style={[{ fontWeight: "bold", fontSize: 10 }]}>
                    Lượng điện tiêu thụ
                  </Text>
                </View>
              </View>
            </View>
            {/* Time */}
            <View style={tw`flex flex-row bg-transparent`}>
              <View style={tw`mx-1 bg-transparent`}>
                <FontAwesomeIcon
                  name="clock-o"
                  color={"#000000"}
                  style={tw`text-2xl`}
                />
              </View>
              <View style={tw`bg-transparent`}>
                <View>
                  <Text style={[{ color: "#0071ff", fontWeight: "bold" }]}>
                    {Math.floor(fanDuration / 3600)}
                    h
                    {Math.floor((fanDuration % 3600) / 60)}
                    m
                  </Text>
                </View>
                <View>
                  <Text style={[{ fontWeight: "bold", fontSize: 10 }]}>
                    Thời gian sử dụng
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Pump */}
        <View
          style={tw`flex items-center px-6 py-3 my-2 bg-white shadow-xl rounded-2xl`}
        >
          {/* Title */}
          <View style={[{}]}>
            <Text style={[{ color: "#0071ff", fontWeight: "bold" }]}>
              Máy phun sương
            </Text>
          </View>
          {/* Content */}
          <View style={tw`flex flex-row justify-between w-full py-1`}>
            {/* Power */}
            <View style={tw`flex flex-row bg-transparent`}>
              <View style={tw`w-5 bg-transparent`}>
                <FontAwesomeIcon
                  name="flash"
                  color={"#000000"}
                  style={tw`text-2xl`}
                />
              </View>
              <View style={tw`bg-transparent`}>
                <View>
                  <Text style={[{ color: "#0071ff", fontWeight: "bold" }]}>
                    231 kwh
                  </Text>
                </View>
                <View>
                  <Text style={[{ fontWeight: "bold", fontSize: 10 }]}>
                    Lượng điện tiêu thụ
                  </Text>
                </View>
              </View>
            </View>
            {/* Time */}
            <View style={tw`flex flex-row bg-transparent`}>
              <View style={tw`mx-1 bg-transparent`}>
                <FontAwesomeIcon
                  name="clock-o"
                  color={"#000000"}
                  style={tw`text-2xl`}
                />
              </View>
              <View style={tw`bg-transparent`}>
                <View>
                  <Text style={[{ color: "#0071ff", fontWeight: "bold" }]}>
                    {Math.floor(pumpDuration / 3600)}
                    h
                    {Math.floor((pumpDuration % 3600) / 60)}
                    m
                  </Text>
                </View>
                <View>
                  <Text style={[{ fontWeight: "bold", fontSize: 10 }]}>
                    Thời gian sử dụng
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function ManualScreen() {
  return (
    <View style={tw`flex-1 `}>
      <View style={tw`items-center flex-1`}>
        <CurrentButtonInfoBar />
      </View>
    </View>
  );
}
