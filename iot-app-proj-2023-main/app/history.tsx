import { Text, View } from "react-native";
import { ScrollView, StyleSheet } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { Platform } from "react-native";
import { StatusBar } from "react-native";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import { useDataStore } from "../store/chartCompare/historyData";

type FilterOption = "TEMPERATURE" | "HUMIDITY" | "NONE";
export default function History() {
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

  const onehourValue = useDataStore((state) => state.onehourList);
  const currentdayValue = useDataStore((state) => state.currentList);
  const yesterdayValue = useDataStore((state) => state.yesterdayList);
  const currentWeekValue = useDataStore((state) => state.currentWeekList);
  const lastWeekValue = useDataStore((state) => state.lastWeekList);
  const updateData = useDataStore((state) => state.fetchData);
  updateData();

  const onehourTemperatureData = onehourValue.map((onehourSensor, index) => ({
    x: onehourSensor.time,
    y: onehourSensor.dataTemp,
    z: currentdayValue[index] ? currentdayValue[index].dataTemp : undefined,
  }));

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
  ];
  const chartOptions1 = [
    { label: `${day} - Now`, value: "filteredData" },
    { label: `${previousDay} - Yesterday`, value: "chartA" },
    { label: "Last week", value: "chartB" },
  ];
  const chartOptions2 = [
    { label: `${day} - Now`, value: "filteredData" },
    { label: `${previousDay} - Yesterday`, value: "chartA" },
    { label: "Last week", value: "chartB" },
  ];

  const initialData = [
    { x: new Date("2023-01-01T00:00:00").getTime(), y: 27, z: 60 },
    { x: new Date("2023-01-01T03:00:00").getTime(), y: 25, z: 63 },
    { x: new Date("2023-01-01T06:00:00").getTime(), y: 23, z: 68 },
    { x: new Date("2023-01-01T09:00:00").getTime(), y: 26, z: 60 },
    { x: new Date("2023-01-01T12:00:00").getTime(), y: 25, z: 69 },
    { x: new Date("2023-01-01T15:00:00").getTime(), y: 36, z: 73 },
    { x: new Date("2023-01-01T18:00:00").getTime(), y: 34, z: 63 },
    { x: new Date("2023-01-01T21:00:00").getTime(), y: 32, z: 64 },
  ];

  const [data, setData] = useState(currentTemperatureData);
  const [lastDate, setLastDate] = useState(Date.now());
  const [filter, setFilter] = useState<FilterOption>("NONE");
  const labels = [];
  const currentDate = moment();
  const weekAgo = moment().subtract(1, "week");

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
      const hoursToUpdateChart = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23,
      ];
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

  while (currentDate.diff(weekAgo, "days") >= 0) {
    if (!currentDate.isSame(moment(), "day")) {
      labels.push(currentDate.format("ddd DD"));
    }
    currentDate.subtract(1, "day");
  }
  const [selectedChart, setSelectedChart] = useState("NONE");
  const [selectedChart1, setSelectedChart1] = useState("NONE");
  const [selectedChart2, setSelectedChart2] = useState("NONE");

  const dataYesterdayTemperature = yesterdayTemperatureData
    .map((item) => item.z)
    .filter((z) => z !== undefined) as number[];

  const chartBData_Lastweek = {
    labels: labels.reverse(),
    datasets: [
      {
        data: [10, 25, 58, 40, 49, 23],
        color: (opacity = 1) => `rgba(225, 0, 0, ${opacity})`,
      },
    ],
  };

  const dataWithoutUndefined = currentTemperatureData
    .map((item) => item.z)
    .filter((z) => z !== undefined) as number[];

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
      ...(dataWithoutUndefined.length > 0
        ? [
            {
              data: currentTemperatureData
                .map((item) => item.z)
                .filter((z) => z !== undefined) as number[],
              backgroundColor: "#01A4FF",
              color: () => "#01A4FF",
            },
          ]
        : []),
    ],
  };

  const ChartB = (props: { ChartData: LineChartData }) => {
    return (
      <LineChart
        data={props.ChartData}
        width={400}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{ marginVertical: 8, left: -22 }}
        fromZero={true}
        withInnerLines={false}
      />
    );
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

  const filteredData = filterChartData(chartData, filter);

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
      // {
      //   data: yesterdayTemperatureData
      //     .map((item) => item.z)
      //     .filter((z) => z !== undefined) as number[],
      //   backgroundColor: "#F47945",
      //   color: () => "#F47945",
      // },
    ],
  };
  // console.log(chart_yesterday_temp)
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
      // ...(dataYesterdayHumidity.length > 0
      //   ? [
      //       {
      //         data: yesterdayHumidityData
      //           .map((item) => item.z)
      //           .filter((z) => z !== undefined) as number[],
      //         backgroundColor: "#01A4FF",
      //         color: () => "#01A4FF",
      //       },
      //     ]
      //   : []),
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

  console.log(chart_yesterday_humi);
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={styles.hello}>
            <Text style={styles.valueInfo}>Lịch sử</Text>
          </View>
        </View>
        <View>
          <View style={styles.top} />
          <View style={styles.parentitem}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.valueInfo1}>Nhiệt độ</Text>
              <Picker
                selectedValue={selectedChart}
                onValueChange={(value) => setSelectedChart(value)}
                style={{ width: "50%", paddingTop: 10 }}
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
            <View style={styles.chart}>
              <ScrollView horizontal={true}>
                {selectedChart === "filteredData" ? (
                  <ChartB ChartData={filteredData} />
                ) : selectedChart === "chartA" ? (
                  <ChartB ChartData={chart_yesterday_temp} />
                ) : selectedChart === "chartB" ? (
                  <ChartB ChartData={chartBData_Lastweek} />
                ) : (
                  <ChartB ChartData={filteredData} />
                )}
              </ScrollView>
            </View>
          </View>
          <View style={styles.parentitem}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.valueInfo1}>Độ ẩm</Text>
              <Picker
                selectedValue={selectedChart1}
                onValueChange={(value) => setSelectedChart1(value)}
                style={{ width: "50%", paddingTop: 10 }}
              >
                {chartOptions1.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    style={{ fontSize: 13 }}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.chart}>
              <ScrollView horizontal={true}>
                {selectedChart1 === "filteredData" ? (
                  <ChartB ChartData={filteredData} />
                ) : selectedChart1 === "chartA" ? (
                  <ChartB ChartData={chart_yesterday_humi} />
                ) : selectedChart1 === "chartB" ? (
                  <ChartB ChartData={chartBData_Lastweek} />
                ) : (
                  <ChartB ChartData={filteredData} />
                )}
              </ScrollView>
            </View>
          </View>
          <View style={styles.parentitem}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.valueInfo1}>Nhật ký hoạt động</Text>
              <Picker
                selectedValue={selectedChart2}
                onValueChange={(value) => setSelectedChart2(value)}
                style={{ width: "50%", paddingTop: 10 }}
              >
                {chartOptions2.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    style={{ fontSize: 13 }}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.chart}>
              <BarChart
                // style={graphStyle}
                yAxisLabel=""
                // chartConfig={chartConfig}
                data={{
                  labels: ["12PM", "1PM", "2PM", "3PM", "4PM"],
                  datasets: [
                    {
                      data: [25, 30, 35, 32, 30],
                    },
                  ],
                }}
                width={320} // from react-native
                height={220}
                yAxisSuffix=""
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                  backgroundColor: "#e26a00",
                  backgroundGradientFrom: "#fb8c00",
                  backgroundGradientTo: "#ffa726",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726",
                  },
                }}
                style={{
                  marginVertical: 10,
                  borderRadius: 16,
                }}
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
    flex: 1,
    justifyContent: "space-between",
    padding: 0,
    margin: 0,
    position: "relative",
  },
  body: {
    flex: 1,
    backgroundColor: "#01a4ff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
    position: "relative",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  hello: {
    // top: 20,
    // left: 30,
  },
  chart: {
    flexDirection: "row",
    marginLeft: 10,
    marginRight: 10,
  },
  valueInfo: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  valueInfo1: {
    color: "grey",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    paddingLeft: 20,
    paddingVertical: 10,
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
    alignItems: "center",
    justifyContent: "space-between",
  },
  parentitem: {
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 15,
    margin: 10,
  },
  box: {
    flexDirection: "row",
    //   width: "40%",
    backgroundColor: "grey",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 0,
    justifyContent: "center",
  },
  content: {
    color: "black",
  },
});
