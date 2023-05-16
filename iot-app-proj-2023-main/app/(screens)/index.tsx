import { useCallback, useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button } from "react-native-elements";
import { LineChart } from "react-native-chart-kit";
import tw from "twrnc";
import { FontAwesomeIcon } from "../../components/atoms/icon";
import { useIntervalAsync } from "../../hooks/useInterval";
import { useSensorDataStore } from "../../store/sensorData/slice";
import { useDataStore } from "../../store/chartCompare/fetchData";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";

const name = "HTTT2";
const elecConsumeDay = 32.5;
const elecConsumeWeek = 342;
type SensorDate = {
  x: string;
  y: number;
  z: number | undefined;
};
const MyChart = () => {
  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: "5",
      strokeWidth: "0",
      stroke: "#000000",
    },
  };

  type FilterOption = "TEMPERATURE" | "HUMIDITY" | "NONE";

  const currentdayValue = useDataStore((state) => state.currentList);
  const yesterdayValue = useDataStore((state) => state.yesterdayList);
  const currentWeekValue = useDataStore((state) => state.currentWeekList);
  const lastWeekValue = useDataStore((state) => state.lastWeekList);
  const updateData = useDataStore((state) => state.fetchData);
  const update = useIntervalAsync(updateData, 10000);

  const currentTemperatureData = currentdayValue.length
    ? currentdayValue.map((currentSensor) => ({
        x: currentSensor.time,
        y: currentSensor.dataTemp,
        z: currentSensor.dataHumi,
      }))
    : [{ x: "2023 00:00:00", y: 0, z: 0 }];

  const yesterdayTemperatureData = yesterdayValue.length
    ? yesterdayValue.map((yesterdaySensor, index) => ({
        x: yesterdaySensor.time,
        y: yesterdaySensor.dataTemp,
        z: currentdayValue[index] ? currentdayValue[index].dataTemp : undefined,
      }))
    : [{ x: "2023 00:00:00", y: 0, z: 0 }];

  const yesterdayHumidityData = yesterdayValue.length
    ? yesterdayValue.map((yesterdaySensor, index) => ({
        x: yesterdaySensor.time,
        y: yesterdaySensor.dataHumi,
        z: currentdayValue[index] ? currentdayValue[index].dataHumi : undefined,
      }))
    : [{ x: "2023 00:00:00", y: 0, z: 0 }];

  console.log(yesterdayTemperatureData);
  const weekTemperatureData = lastWeekValue.length
    ? lastWeekValue.map((lastWeekSensor, index) => ({
        y: lastWeekSensor.avgTemp,
        z: currentWeekValue[index]
          ? currentWeekValue[index].avgTemp
          : undefined,
      }))
    : [{ y: 0, z: 0 }];

  const weekHumidityData = lastWeekValue.length
    ? lastWeekValue.map((lastWeekSensor, index) => ({
        y: lastWeekSensor.avgHumi,
        z: currentWeekValue[index]
          ? currentWeekValue[index].avgHumi
          : undefined,
      }))
    : [{ y: 0, z: 0 }];

  const [data, setData] = useState(currentTemperatureData);
  const [lastDate, setLastDate] = useState(Date.now());
  const [filter, setFilter] = useState<FilterOption>("NONE");

  useEffect(() => {
    const updateChart = () => {
      const temp_value = Math.floor(Math.random() * 6) + 30;
      const humi_value = Math.floor(Math.random() * 10) + 60;
      setData((prevData) => {
        const newData = {
          x: new Date().toISOString().slice(0, 19),
          y: temp_value,
          z: humi_value,
        };
        const updatedData = [...prevData.slice(-7), newData]; // keep only the latest 8 values
        // setLastDate(newData);
        return updatedData;
      });

      // setData_temp((prevData) => {
      //   const newData = [...prevData];
      //   for (let i = 0; i < newData.length; i++) {
      //     if (newData[i].z === undefined) {
      //       newData[i].z = temp_value;
      //       break;
      //     }
      //   }
      //   return newData;
      // });

      // setData_humi((prevData) => {
      //   const newData = [...prevData];
      //   for (let i = 0; i < newData.length; i++) {
      //     if (newData[i].z === undefined) {
      //       newData[i].z = humi_value;
      //       break;
      //     }
      //   }
      //   return newData;
      // });

      // setData_temp_w((prevData) => {
      //   const newData = [...prevData];
      //   for (let i = 0; i < newData.length; i++) {
      //     if (newData[i].z === undefined) {
      //       newData[i].z = temp_value;
      //       break;
      //     }
      //   }
      //   return newData;
      // });

      // setData_humi_w((prevData) => {
      //   const newData = [...prevData];
      //   for (let i = 0; i < newData.length; i++) {
      //     if (newData[i].z === undefined) {
      //       newData[i].z = humi_value;
      //       break;
      //     }
      //   }
      //   return newData;
      // });
    };
    const interval = setInterval(() => {
      const currentHour = new Date().getHours();
      const currentMinutes = new Date().getMinutes();
      const hoursToUpdateChart = [0, 3, 6, 9, 12, 15, 18, 21];
      if (hoursToUpdateChart.includes(currentHour) && currentMinutes === 0) {
        updateChart();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  type Dataset = {
    data: number[];
    backgroundColor: string;
    color: () => string;
  };

  type ChartData = {
    labels: string[];
    datasets: Dataset[];
  };

  const filterChartData = (
    chartData: ChartData,
    filter: FilterOption,
  ): ChartData => {
    if (filter === "TEMPERATURE") {
      const filteredData = chartData.datasets.filter(
        (dataset: Dataset) => dataset.backgroundColor === "#F47945",
      );
      return { ...chartData, datasets: filteredData };
    } else if (filter === "HUMIDITY") {
      const filteredData = chartData.datasets.filter(
        (dataset: Dataset) => dataset.backgroundColor === "#01A4FF",
      );
      return { ...chartData, datasets: filteredData };
    } else {
      return chartData;
    }
  };

  // --------------------------------------------------------------------------------//

  const chartData: ChartData = {
    labels: currentTemperatureData.map((item) =>
      new Date(item.x).toLocaleTimeString("en-US", {
        hour: "numeric",
      }),
    ),
    datasets: [
      {
        data: currentTemperatureData.map((item) => item.y),
        backgroundColor: "#F47945",
        color: () => "#F47945",
      },
      {
        data: currentTemperatureData
          .map((item) => item.z)
          .filter((z) => z !== undefined) as number[],
        backgroundColor: "#01A4FF",
        color: () => "#01A4FF",
      },
    ],
  };

  // --------------------------------------------------------------------------------//
  const chart_yesterday_temp: ChartData = {
    labels: yesterdayTemperatureData.map((item) =>
      new Date(item.x).toLocaleTimeString("en-US", {
        hour: "numeric",
      }),
    ),
    datasets: [
      {
        data: yesterdayTemperatureData.map((item) => item.y),
        backgroundColor: "#FCC4A4",
        color: () => "#FCC4A4",
      },
      {
        data: yesterdayTemperatureData
          .map((item) => item.z)
          .filter((z) => z !== undefined) as number[],
        backgroundColor: "#F47945",
        color: () => "#F47945",
      },
    ],
  };

  const dataYesterdayHumidity = yesterdayHumidityData
    .map((item) => item.z)
    .filter((z) => z !== undefined) as number[];
  const chart_yesterday_humi: ChartData = {
    labels: yesterdayHumidityData.map((item) =>
      new Date(item.x).toLocaleTimeString("en-US", {
        hour: "numeric",
      }),
    ),
    datasets: [
      {
        data: yesterdayHumidityData.map((item) => item.y),
        backgroundColor: "#BBD5EC",
        color: () => "#BBD5EC",
      },
      ...(dataYesterdayHumidity.length > 0
        ? [
            {
              data: yesterdayHumidityData
                .map((item) => item.z)
                .filter((z) => z !== undefined) as number[],
              backgroundColor: "#01A4FF",
              color: () => "#01A4FF",
            },
          ]
        : []),
    ],
  };

  const chart_yesterday: ChartData = {
    labels: yesterdayTemperatureData.map((item) =>
      new Date(item.x).toLocaleTimeString("en-US", {
        hour: "numeric",
      }),
    ),
    datasets: [
      {
        data: yesterdayTemperatureData.map((item) => item.y),
        backgroundColor: "#FCC4A4",
        color: () => "#FCC4A4",
      },
      {
        data: yesterdayHumidityData.map((item) => item.y),
        backgroundColor: "#BBD5EC",
        color: () => "#BBD5EC",
      },
    ],
  };

  // --------------------------------------------------------------------------------//

  const labels = [];
  const currentDate = moment().day("Sunday"); // set to the current Sunday
  const weekAgo = moment().subtract(1, "week").day("Monday"); // set to last Monday

  while (currentDate.diff(weekAgo, "days") >= 0) {
    labels.push(currentDate.format("ddd DD"));
    currentDate.subtract(1, "day");
  }

  const dataWeekTemperature = weekTemperatureData
    .map((item) => item.z)
    .filter((z) => z !== undefined) as number[];
  const chart_week_temp: ChartData = {
    labels: weekTemperatureData.length ? labels.reverse() : ["Sun 1"],
    datasets: [
      {
        data: weekTemperatureData.map((item) => item.y),
        backgroundColor: "#FCC4A4",
        color: () => "#FCC4A4",
      },
      ...(dataWeekTemperature.length > 0
        ? [
            {
              data: weekTemperatureData
                .map((item) => item.z)
                .filter((z) => z !== undefined) as number[],
              backgroundColor: "#F47945",
              color: () => "#F47945",
            },
          ]
        : []),
    ],
  };

  const dataWeekHumidity = weekHumidityData
    .map((item) => item.z)
    .filter((z) => z !== undefined) as number[];
  const chart_week_humi: ChartData = {
    labels: weekHumidityData.length ? labels.reverse() : ["Sun 1"],
    datasets: [
      {
        data: weekHumidityData.map((item) => item.y),
        backgroundColor: "#BBD5EC",
        color: () => "#BBD5EC",
      },
      ...(dataWeekHumidity.length > 0
        ? [
            {
              data: weekHumidityData
                .map((item) => item.z)
                .filter((z) => z !== undefined) as number[],
              backgroundColor: "#01A4FF",
              color: () => "#01A4FF",
            },
          ]
        : []),
    ],
  };

  const chart_week: ChartData = {
    labels: weekTemperatureData.length ? labels.reverse() : ["Sun 1"],
    datasets: [
      {
        data: weekTemperatureData.map((item) => item.y),
        backgroundColor: "#FCC4A4",
        color: () => "#FCC4A4",
      },
      {
        data: weekHumidityData.map((item) => item.y),
        backgroundColor: "#BBD5EC",
        color: () => "#BBD5EC",
      },
    ],
  };
  // --------------------------------------------------------------------------------//

  const filteredData = filterChartData(chartData, filter);

  const day = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const previousDay = new Date(
    Date.now() - 24 * 60 * 60 * 1000,
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const chartOptions = [
    { label: `${day} - Now`, value: "filteredData" },
    { label: `${previousDay} - Yesterday`, value: "chartA" },
    { label: "Last week", value: "chartB" },
    { label: "Last month", value: "chartC" },
  ];

  const [selectedChart, setSelectedChart] = useState("NONE");

  const ChartA = () => {
    return (
      <View>
        {filter === "TEMPERATURE" ? (
          <LineChart
            data={chart_yesterday_temp}
            width={400}
            height={160}
            chartConfig={chartConfig}
            bezier
            style={{ marginVertical: 8, left: -22 }}
            fromZero={true}
            withInnerLines={false}
          />
        ) : filter === "NONE" ? (
          <LineChart
            data={chart_yesterday}
            width={400}
            height={160}
            chartConfig={chartConfig}
            bezier
            style={{ marginVertical: 8, left: -22 }}
            fromZero={true}
            withInnerLines={false}
          />
        ) : (
          <LineChart
            data={chart_yesterday_humi}
            width={400}
            height={160}
            chartConfig={chartConfig}
            bezier
            style={{ marginVertical: 8, left: -22 }}
            fromZero={true}
            withInnerLines={false}
          />
        )}
      </View>
    );
  };

  const ChartB = () => {
    return (
      <View>
        {filter === "TEMPERATURE" ? (
          <LineChart
            data={chart_week_temp}
            width={400}
            height={160}
            chartConfig={chartConfig}
            bezier
            style={{ marginVertical: 8, left: -22 }}
            fromZero={true}
            withInnerLines={false}
          />
        ) : filter === "NONE" ? (
          <LineChart
            data={chart_week}
            width={400}
            height={160}
            chartConfig={chartConfig}
            bezier
            style={{ marginVertical: 8, left: -22 }}
            fromZero={true}
            withInnerLines={false}
          />
        ) : (
          <LineChart
            data={chart_week_humi}
            width={400}
            height={160}
            chartConfig={chartConfig}
            bezier
            style={{ marginVertical: 8, left: -22 }}
            fromZero={true}
            withInnerLines={false}
          />
        )}
      </View>
    );
  };

  const data1 = {
    labels: ["1", "4", "8", "12", "16", "20", "24", "28"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 40, 45],
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const ChartC = () => {
    return (
      <ScrollView horizontal>
        <LineChart
          data={data1}
          width={400}
          height={160}
          chartConfig={chartConfig}
          bezier
          style={{ marginVertical: 8, left: -22 }}
          fromZero={true}
          withInnerLines={false}
        />
      </ScrollView>
    );
  };

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", left: 35 }}>
          <Button
            title="Both"
            onPress={() => setFilter("NONE")}
            containerStyle={{ margin: 5 }}
            buttonStyle={{
              backgroundColor: filter === "NONE" ? "green" : "gray",
              paddingVertical: 1,
              paddingHorizontal: 5,
            }}
            titleStyle={{ fontSize: 11 }}
          />
          <Button
            title="Temperature"
            onPress={() => setFilter("TEMPERATURE")}
            containerStyle={{ margin: 5 }}
            buttonStyle={{
              backgroundColor: filter === "TEMPERATURE" ? "red" : "gray",
              paddingVertical: 1,
              paddingHorizontal: 5,
            }}
            titleStyle={{ fontSize: 11 }}
          />
          <Button
            title="Humidity"
            onPress={() => setFilter("HUMIDITY")}
            containerStyle={{ margin: 5 }}
            buttonStyle={{
              backgroundColor: filter === "HUMIDITY" ? "blue" : "gray",
              paddingVertical: 1,
              paddingHorizontal: 5,
            }}
            titleStyle={{ fontSize: 11 }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Picker
            selectedValue={selectedChart}
            onValueChange={(value) => setSelectedChart(value)}
            style={{ width: "100%", marginTop: -10, marginLeft: 60 }}
          >
            {chartOptions.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
                style={{ fontSize: 13 }}
              />
            ))}
          </Picker>
        </View>
      </View>
      <ScrollView>
        {selectedChart === "filteredData" ? (
          <LineChart
            data={filteredData}
            width={400}
            height={160}
            chartConfig={chartConfig}
            bezier
            style={{ marginVertical: 8, left: -22 }}
            fromZero={true}
            withInnerLines={false}
          />
        ) : selectedChart === "chartA" ? (
          <ChartA />
        ) : selectedChart === "chartB" ? (
          <ChartB />
        ) : selectedChart === "chartC" ? (
          <ChartC />
        ) : (
          <LineChart
            data={filteredData}
            width={400}
            height={160}
            chartConfig={chartConfig}
            bezier
            style={{ marginVertical: 8, left: -22 }}
            fromZero={true}
            withInnerLines={false}
          />
        )}
      </ScrollView>
    </View>
  );
};

function CurrentConditionInfoBar() {
  const temperatureValue = useSensorDataStore(
    (state) => state.temperatureValue,
  );
  const humidityValue = useSensorDataStore((state) => state.humidityValue);
  const irValue = useSensorDataStore((state) => state.irValue);
  const lastUpdated = useSensorDataStore((state) => state.timestamp);
  const updateData = useSensorDataStore(
    useCallback((state) => state.fetchData, []),
  );
  const update = useIntervalAsync(updateData, 10000);
  return (
    <View style={styles.home}>
      <View style={styles.containerTop}>
        <View style={styles.containerInfo}>
          <View style={styles.hello}>
            <Text style={styles.valueInfo}>Hello, {name}</Text>
            <Text style={{ color: "white" }}>
              What controls do you want to manage today.!
            </Text>
          </View>
          <View style={styles.value}>
            <View style={styles.dataInfo}>
              <Text style={styles.textInfo}>NHIỆT ĐỘ</Text>
              <Text style={styles.valueInfo}>
                {" "}
                {`${temperatureValue}\u1D52C`}{" "}
              </Text>
            </View>
            <View style={styles.dataInfo}>
              <Text style={styles.textInfo}>ĐỘ ẨM</Text>
              <Text style={styles.valueInfo}> {`${humidityValue}%`} </Text>
            </View>
            <View
              style={{
                position: "relative",
                backgroundColor: "#01a4ff",
                width: 110,
                alignItems: "center",
              }}
            >
              <Text style={styles.textInfo}>TRẠNG THÁI</Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 13,
                  textAlign: "center",
                  top: 4,
                  fontWeight: "bold",
                }}
              >
                {" "}
                {irValue ? "Có người" : "Không có người"}{" "}
              </Text>
            </View>
            <View style={styles.dataInfo}>
              <Text style={{ color: "white", fontSize: 13, bottom: 5 }}>
                {" "}
                Cập nhật lúc{" "}
              </Text>
              <Text style={{ color: "white", fontSize: 11 }}>
                {lastUpdated}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.containerBot}>
        <View style={{ flex: 0.7 }} />
        <View style={styles.elecConsume}>
          <View style={styles.electricInfo}>
            <Text style={styles.TextelectricInfo1}>
              <FontAwesomeIcon name="plug" /> {elecConsumeDay} KwH
            </Text>
            <Text style={styles.TextelectricInfo2}>
              Lượng điện tiêu thụ trong ngày
            </Text>
          </View>
          <View style={styles.electricInfo}>
            <Text style={styles.TextelectricInfo1}>
              <FontAwesomeIcon name="bolt" /> {elecConsumeWeek} KwH
            </Text>
            <Text style={styles.TextelectricInfo2}>
              Lượng điện tiêu thụ trong tuần
            </Text>
          </View>
        </View>
        <View style={{ flex: 1.2, left: 17 }}>
          <Text>AA</Text>
        </View>
      </View>
      <View style={styles.chart}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              left: 69,
              marginTop: 6,
            }}
          >
            Biểu đồ nhiệt độ và độ ẩm
          </Text>
        </View>
        <MyChart />
      </View>
    </View>
    // <View>
    //   <Text>AAAAAAAA</Text>
    // </View>
  );
}

export default function HomeScreen() {
  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <CurrentConditionInfoBar />
    </View>
  );
}

const styles = StyleSheet.create({
  hello: {
    width: "80%",
    height: "20%",
    backgroundColor: "#01a4ff",
    flex: 1,
    position: "relative",
    top: 20,
    left: 30,
  },
  value: {
    width: "100%",
    flex: 1,
    backgroundColor: "#01a4ff",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  chart: {
    top: 170,
    position: "absolute",
    backgroundColor: "white",
    width: 360,
    height: 240,
    left: 20,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
    ...(Platform.OS === "android" ? { elevation: 5 } : {}),
    ...(Platform.OS === "ios"
      ? {
          shadowColor: "black",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 2,
        }
      : {}),
  },
  chart1: {
    width: "100%",
    flex: 1,
    backgroundColor: "yellow",
    position: "absolute",
    left: 50,
    top: 50,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerTop: {
    flex: 1.2,
    backgroundColor: "#01a4ff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    position: "relative",
  },
  containerBot: {
    flex: 2,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    position: "relative",
  },
  containerInfo: {
    flex: 0.7,
    backgroundColor: "#01a4ff",
  },
  home: {
    flex: 1,
    backgroundColor: "#01a4ff",
  },
  dataInfo: {
    color: "white",
    position: "relative",
    backgroundColor: "#01a4ff",
    width: 85,
    alignItems: "center",
  },
  textInfo: {
    color: "white",
    fontSize: 14,
    bottom: 5,
    textAlign: "center",
  },
  valueInfo: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  elecConsume: {
    flex: 0.3,
    alignItems: "center",
    textAlign: "left",
    width: "92%",
    bottom: 10,
    left: 20,
    borderRadius: 10,
    backgroundColor: "#ffb22d",
    flexDirection: "row",
    justifyContent: "space-evenly",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  electricInfo: {
    flex: 1,
    backgroundColor: "#ffb22d",
    borderWeight: 200,
  },
  TextelectricInfo1: {
    left: 27,
    fontSize: 16,
    fontWeight: "bold",
  },
  TextelectricInfo2: {
    left: 35,
    fontSize: 10,
  },
});
