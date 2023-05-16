import { create } from "zustand";
import { setThreshold } from "../../services/setThreshold";
import type { InputThresholdType } from "../../services/setThreshold";

interface IOThresholdDataStore {
  tempThresholdValue: number;
  humidThresholdValue: number;
  pushThresholdValue: (
    thresholdName: InputThresholdType,
    value: number,
  ) => Promise<boolean>;
}

const outputDeviceMap: {
  [key in InputThresholdType]: keyof IOThresholdDataStore;
} = {
  tempThreshold: "tempThresholdValue",
  humidThreshold: "humidThresholdValue",
};

export const useThresholdDataStore = create<IOThresholdDataStore>(
  (set, get) => ({
    tempThresholdValue: 0,
    humidThresholdValue: 0,
    pushThresholdValue: async (thresholdName, value) => {
      const result = await setThreshold(thresholdName, value);
      return result;
    },
  }),
);
