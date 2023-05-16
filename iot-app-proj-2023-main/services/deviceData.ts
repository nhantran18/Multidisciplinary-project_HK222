import axios from "axios";
import {
  ADAFRUIT_IO_URL,
  ADAFRUIT_IO_USERNAME,
  ADAFRUIT_IO_TEMP_FEED,
  ADAFRUIT_IO_HUMID_FEED,
  ADAFRUIT_IO_IR_FEED,
  ADAFRUIT_IO_FAN_FEED,
  ADAFRUIT_IO_PUMP_FEED,
  ADAFRUIT_IO_AUTO_BUTTON_FEED,
} from "@env";

const baseURL = ADAFRUIT_IO_URL;
const username = ADAFRUIT_IO_USERNAME;
const feedKey = {
  tempSensor: ADAFRUIT_IO_TEMP_FEED,
  humidSensor: ADAFRUIT_IO_HUMID_FEED,
  irSensor: ADAFRUIT_IO_IR_FEED,
  fan: ADAFRUIT_IO_FAN_FEED,
  pump: ADAFRUIT_IO_PUMP_FEED,
  autoButton: ADAFRUIT_IO_AUTO_BUTTON_FEED,
};

interface IFeedData {
  value: string;
  created_at: string;
}

interface IFeedDataResponse {
  res: IFeedData;
  error: boolean;
}

const instance = axios.create({
  baseURL: baseURL,
  method: "get",
  timeout: 2000,
  params: {
    limit: 1,
    include: "value,created_at",
  },
  headers: {
    Accept: "application/json",
  },
});

export async function getFeedData(
  deviceName: keyof typeof feedKey,
): Promise<IFeedDataResponse> {
  const response = await instance
    .get(`/${username}/feeds/${feedKey[deviceName]}/data`)
    .catch((err) => {
      console.log(err);
      return null;
    });
  return {
    res: response?.data[0] ?? {},
    error: response === null,
  };
}
