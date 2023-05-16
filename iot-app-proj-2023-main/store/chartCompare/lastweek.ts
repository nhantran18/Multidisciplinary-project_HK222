import { Record } from "pocketbase";
import { create } from "zustand";
import pb from "../../services/pocketbase/instance";

type Week = {
  date: string;
  avgTemp: number;
  avgHumi: number;
};

interface WeekData {
  lastWeekList: Week[];
  currentWeekList: Week[];
  fetchWeekData: () => Promise<void>;
}

export const useWeekDataStore = create<WeekData>((set, get) => ({
  lastWeekList: [],
  currentWeekList: [],
  fetchWeekData: async () => {
    try {
      const today = new Date();
      const end_LastWeek = new Date(
        today.setDate(today.getDate() - today.getDay() + 1),
      ); // Get the date of last Sunday
      const start_LastWeek = new Date(
        end_LastWeek.getTime() - 6 * 24 * 60 * 60 * 1000,
      ); // Get the date of last Monday
      const startFormatted_Last = start_LastWeek.toISOString().slice(0, 10);
      const endFormatted_Last = end_LastWeek.toISOString().slice(0, 10);

      const start_CurrentWeek = new Date(
        today.setDate(today.getDate() - (today.getDay() - 1)),
      );
      const endofcurrentWeek = new Date(
        today.setDate(today.getDate() + (7 - today.getDay())),
      );
      const startFormatted_Current = start_CurrentWeek
        .toISOString()
        .slice(0, 10);
      const endFormatted_Current = endofcurrentWeek.toISOString().slice(0, 10);

      const lastResult = await pb.collection("sensor").getFullList({
        filter: `time >= "${startFormatted_Last} 00:00:00" && time <= "${endFormatted_Last} 23:59:59"`,
      });

      const currentResult = await pb.collection("sensor").getFullList({
        filter: `time >= "${startFormatted_Current} 00:00:00" && time <= "${endFormatted_Current} 23:59:59"`,
      });

      const lastGroupedRecords: { [key: string]: Record[] } = lastResult.reduce(
        (acc: { [key: string]: Record[] }, cur) => {
          const date = new Date(cur.time).toISOString().slice(0, 10);
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(cur);
          return acc;
        },
        {},
      );

      const currentGroupedRecords: { [key: string]: Record[] } =
        currentResult.reduce((acc: { [key: string]: Record[] }, cur) => {
          const date = new Date(cur.time).toISOString().slice(0, 10);
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

      const averages_Current = Object.entries(currentGroupedRecords).map(
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
      set({ lastWeekList: averages_Last, currentWeekList: averages_Current });
    } catch (error) {
      console.error(error);
    }
  },
}));
