import { create } from "zustand";
import { getFeedData } from "../../services/deviceData";
import { convertToDateString } from "../../utils/date";
import { roundToDecimalPlaces } from "../../utils/number";

interface ISensorDataStore {
  temperatureValue: number;
  humidityValue: number;
  irValue: boolean;
  timestamp: string;
  fetchData: () => Promise<void>;
}

export const useSensorDataStore = create<ISensorDataStore>((set) => ({
  temperatureValue: 0,
  humidityValue: 0,
  irValue: false,
  timestamp: "",
  fetchData: async () => {
    const data = await Promise.all([
      getFeedData("tempSensor"),
      getFeedData("humidSensor"),
      getFeedData("irSensor"),
    ]);
    const isErrorAppeared = data.some((item) => item.error);
    if (isErrorAppeared) {
      return;
    }
    set({
      temperatureValue: roundToDecimalPlaces(Number(data[0].res.value), 1),
      humidityValue: roundToDecimalPlaces(Number(data[1].res.value), 1),
      irValue: data[2].res.value === "1",
      timestamp: convertToDateString(new Date(data[2].res.created_at)),
    });
  },
}));
