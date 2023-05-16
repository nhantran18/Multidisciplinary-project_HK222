import Pocketbase, { Record } from "pocketbase";
import { create } from "zustand";
import pb from "../../services/pocketbase/instance";
interface RecordMap {
  [key: string]: Record[];
}

type Date = {
  time: string;
  dataTemp: number;
  dataHumi: number;
};

type Week = {
  date: string;
  avgTemp: number;
  avgHumi: number;
};

interface chartData {
  onehourList: Date[];
  currentList: Date[];
  currentWeekList: Week[];
  yesterdayList: Date[];
  lastWeekList: Week[];
  fetchData: () => Promise<void>;
}

function reverseDate(dateStr: string) {
  const dateParts = dateStr.split("/");
  const date = new Date(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`);
  return date;
}

function formatDateTime(dateTimeStr: string) {
  const date = new Date(dateTimeStr);
  date.setHours(date.getHours() - 7); // subtract 7 hours
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function ReverseDateMonth(dateStr: string) {
  const dateParts = dateStr.split("/");
  const date = new Date(`${dateParts[2]}/${dateParts[0]}/${dateParts[1]}`);

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  return "2023/01/01";
}
export const useDataStore = create<chartData>((set) => ({
  onehourList: [],
  currentList: [],
  yesterdayList: [],
  currentWeekList: [],
  lastWeekList: [],
  fetchData: async () => {
    try {
      // ----------------------------YESTERDAY----------------------------- //
      const today = new Date();
      const yesterday = new Date(today.setDate(today.getDate() - 2));
      const current = new Date();

      const currentDate = current.toLocaleDateString();
      const yesterdayDate = yesterday.toLocaleDateString();
      // console.log("currentDate", currentDate);
      // console.log("yesterdayDate", yesterdayDate);

      const Recordlist = await pb.collection("sensor").getFullList({
        $autoCancel: false,
        sort: "time",
      });

      const currentResult = Recordlist.filter((record) => {
        const time = formatDateTime(record.time);
        const BeginTime = `${currentDate} 00:00:00`;
        const EndTime = `${currentDate} 23:59:59`;
        return time >= BeginTime && time <= EndTime;
      });

      const yesterdayResult = Recordlist.filter((record) => {
        const time = formatDateTime(record.time);
        const BeginTime = `${yesterdayDate} 00:00:00`;
        const EndTime = `${yesterdayDate} 23:59:59`;
        return time >= BeginTime && time <= EndTime;
      });

      let yesterdayGroupedRecords: { [key: string]: Record[] } = {};

      if (yesterdayResult.length > 0) {
        yesterdayGroupedRecords = yesterdayResult.reduce(
          (acc: { [key: string]: Record[] }, cur) => {
            const timeOfDay = cur.time.slice(11, 13);
            if (!acc[timeOfDay]) {
              acc[timeOfDay] = [];
            }
            acc[timeOfDay].push(cur);
            return acc;
          },
          {},
        );
      }
      // console.log("yesterdayGroupedRecords", yesterdayGroupedRecords);

      let currentGroupedRecords: { [key: string]: Record[] } = {};

      if (currentResult.length > 0) {
        currentGroupedRecords = currentResult.reduce(
          (acc: { [key: string]: Record[] }, cur) => {
            const timeOfDay = cur.time.slice(11, 13);
            if (!acc[timeOfDay]) {
              acc[timeOfDay] = [];
            }
            acc[timeOfDay].push(cur);
            return acc;
          },
          {},
        );
      }

      const allowedHours = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23,
      ];
      const yesterdayFilteredRecords: RecordMap = Object.keys(
        yesterdayGroupedRecords,
      )
        .filter((key) => {
          const hour = Number(key);
          console.log(key);
          return allowedHours.includes(hour);
        })
        .reduce((acc: RecordMap, key) => {
          acc[key] = yesterdayGroupedRecords[key];
          return acc;
        }, {});

      const currentFilteredRecords: RecordMap = Object.keys(
        currentGroupedRecords,
      )
        .filter((key) => {
          const hour = Number(key);
          return allowedHours.includes(hour);
        })
        .reduce((acc: RecordMap, key) => {
          acc[key] = currentGroupedRecords[key];
          return acc;
        }, {});

      const getHoursDataYesterday = Object.entries(
        yesterdayFilteredRecords,
      ).map(([key, records]) => {
        console.log(records);
        const temps = records.map((record) => record.temp_value);
        const humis = records.map((record) => record.humi_value);
        const dataTemp = Number(temps[0]);
        const dataHumi = Number(humis[0]);
        const time = `${ReverseDateMonth(yesterdayDate)} ${key}:00:00`;

        return { time, dataTemp, dataHumi };
      });
      const getHoursDataCurrent = Object.entries(currentFilteredRecords).map(
        ([key, records]) => {
          const temps = records.map((record) => record.temp_value);
          const humis = records.map((record) => record.humi_value);
          const dataTemp = Number(temps[0]);
          const dataHumi = Number(humis[0]);
          const time = `${ReverseDateMonth(yesterdayDate)} ${key}:00:00`;

          return { time, dataTemp, dataHumi };
        },
      );

      // ----------------------------ONE HOUR------------------------------ //
      const cur_time = new Date().getTime();
      const onehourResult = Recordlist.filter((record) => {
        const time = formatDateTime(record.time);
        const BeginTime = `${currentDate} 00:00:00`;
        const EndTime = `${currentDate} ${cur_time}`;
        return time >= BeginTime && time <= EndTime;
      });
      let onehourGroupedRecords: { [key: string]: Record[] } = {};
      if (onehourResult.length > 0) {
        onehourGroupedRecords = onehourResult.reduce(
          (acc: { [key: string]: Record[] }, cur) => {
            const timeOfDay = cur.time.slice(14, 16);
            if (!acc[timeOfDay]) {
              acc[timeOfDay] = [];
            }
            acc[timeOfDay].push(cur);
            return acc;
          },
          {},
        );
      }
      const allowedMinute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
      const onehourFilteredRecords: RecordMap = Object.keys(
        onehourGroupedRecords,
      )
        .filter((key) => {
          const minute = Number(key);
          // console.log(key)
          return allowedMinute.includes(minute);
        })
        .reduce((acc: RecordMap, key) => {
          acc[key] = onehourGroupedRecords[key];
          return acc;
        }, {});
      const getDataonehour = Object.entries(onehourFilteredRecords).map(
        ([key, records]) => {
          const temps = records.map((record) => record.temp_value);
          const humis = records.map((record) => record.humi_value);
          const dataTemp = Number(temps[0]);
          const dataHumi = Number(humis[0]);
          const time = `${ReverseDateMonth(
            currentDate,
          )} ${new Date().getHours()}:${key}:00`;
          return { time, dataTemp, dataHumi };
        },
      );
      // console.log(getDataonehour)
      // console.log(getHoursDataYesterday)

      // ----------------------------LAST WEEK----------------------------- //
      const end_LastWeek = new Date(
        today.setDate(today.getDate() - today.getDay()),
      ); // Get the date of last Sunday
      const start_LastWeek = new Date(
        end_LastWeek.getTime() - 6 * 24 * 60 * 60 * 1000,
      ); // Get the date of last Monday
      const startFormatted_Last = start_LastWeek
        .toLocaleDateString()
        .slice(0, 10);
      const endFormatted_Last = end_LastWeek.toLocaleDateString().slice(0, 10);

      const start_CurrentWeek = new Date(
        today.setDate(today.getDate() - (today.getDay() - 1)),
      );
      const endofcurrentWeek = new Date(
        today.setDate(today.getDate() + (7 - today.getDay())),
      );
      const startFormatted_Current = start_CurrentWeek
        .toLocaleDateString()
        .slice(0, 10);
      const endFormatted_Current = endofcurrentWeek
        .toLocaleDateString()
        .slice(0, 10);

      // console.log("startFormatted_Current", startFormatted_Current);
      // console.log("endFormatted_Current", endFormatted_Current);
      // console.log("startFormatted_Last", startFormatted_Last);
      // console.log("endFormatted_Last", endFormatted_Last);

      const currentWeekResult = Recordlist.filter((record) => {
        const time = formatDateTime(record.time);
        const timeWeek = reverseDate(time);
        const BeginTime = new Date(
          `${ReverseDateMonth(startFormatted_Current)} 00:00:00`,
        );
        const EndTime = new Date(
          `${ReverseDateMonth(endFormatted_Current)} 23:59:59`,
        );

        return timeWeek >= BeginTime && timeWeek <= EndTime;
      });

      const lastWeekResult = Recordlist.filter((record) => {
        const time = formatDateTime(record.time);
        const timeWeek = reverseDate(time);
        const BeginTime = reverseDate(`${startFormatted_Last} 00:00:00`);
        const EndTime = reverseDate(`${endFormatted_Last} 23:59:59`);
        return timeWeek >= BeginTime && timeWeek <= EndTime;
      });

      const lastGroupedRecords: { [key: string]: Record[] } =
        lastWeekResult.reduce((acc: { [key: string]: Record[] }, cur) => {
          const date = new Date(cur.time).toLocaleDateString().slice(0, 10);
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(cur);
          return acc;
        }, {});

      const weekGroupedRecords: { [key: string]: Record[] } =
        currentWeekResult.reduce((acc: { [key: string]: Record[] }, cur) => {
          const date = new Date(cur.time).toLocaleDateString().slice(0, 10);
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(cur);
          return acc;
        }, {});

      const averages_Last = Object.entries(lastGroupedRecords).map(
        ([date, records]) => {
          const temps = records.map((record) => record.temp_value);
          const humis = records.map((record) => record.humi_value);
          const avgTemp = Math.round(
            temps.reduce((sum, temp) => sum + Number(temp), 0) / temps.length,
          );
          const avgHumi = Math.round(
            humis.reduce((sum, humi) => sum + Number(humi), 0) / humis.length,
          );
          return { date, avgTemp, avgHumi };
        },
      );

      const averages_Current = Object.entries(weekGroupedRecords).map(
        ([date, records]) => {
          const temps = records.map((record) => record.temp_value);
          const humis = records.map((record) => record.humi_value);
          const avgTemp = Math.round(
            temps.reduce((sum, temp) => sum + Number(temp), 0) / temps.length,
          );
          const avgHumi = Math.round(
            humis.reduce((sum, humi) => sum + Number(humi), 0) / humis.length,
          );
          return { date, avgTemp, avgHumi };
        },
      );

      set({
        onehourList: getDataonehour,
        yesterdayList: getHoursDataYesterday,
        currentList: getHoursDataCurrent,
        // lastWeekList: averages_Last,
        // currentWeekList: averages_Current,
      });
    } catch (error) {
      console.error(error);
    }
  },
}));
