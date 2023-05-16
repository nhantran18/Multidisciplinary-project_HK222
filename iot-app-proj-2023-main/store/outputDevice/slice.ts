import { create } from "zustand";
import { createDataAIO } from "../../services/outputDevice";
import { getFeedData } from "../../services/deviceData";
import type { OutputDeviceType } from "../../services/outputDevice";

interface IOutputDeviceStore {
  fanValue: boolean;
  pumpValue: boolean;
  autoButtonValue: boolean;
  fetchData: () => Promise<void>;
  controlDevice: (deviceName: OutputDeviceType) => Promise<Boolean>;
}

const outputDeviceMap: {
  [key in OutputDeviceType]: keyof IOutputDeviceStore;
} = {
  fan: "fanValue",
  pump: "pumpValue",
  autoButton: "autoButtonValue",
};

export const useOuputDeviceDataStore = create<IOutputDeviceStore>(
  (set, get) => ({
    fanValue: false,
    pumpValue: false,
    autoButtonValue: false,
    fetchData: async () => {
      const data = await Promise.all([
        getFeedData("fan"),
        getFeedData("pump"),
        getFeedData("autoButton"),
      ]);
      const isErrorAppeared = data.some((item) => item.error);
      if (isErrorAppeared) {
        return;
      }
      set({
        fanValue: Number(data[0].res.value) === 1,
        pumpValue: Number(data[1].res.value) === 1,
        autoButtonValue: Number(data[2].res.value) === 1,
      });
    },
    controlDevice: async (deviceName: OutputDeviceType) => {
      const value = !get()[outputDeviceMap[deviceName]];
      const result = await createDataAIO(deviceName, value ? 1 : 0);
      return result;
    },
  }),
);
