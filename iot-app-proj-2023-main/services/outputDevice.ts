import axios from "axios";
import {
  ADAFRUIT_IO_URL,
  ADAFRUIT_IO_USERNAME,
  ADAFRUIT_IO_FAN_FEED,
  ADAFRUIT_IO_PUMP_FEED,
  ADAFRUIT_IO_AUTO_BUTTON_FEED,
  ADAFRUIT_IO_API_KEY,
} from "@env";

const baseURL = ADAFRUIT_IO_URL;
const username = ADAFRUIT_IO_USERNAME;
const outputDeviceKey = {
  fan: ADAFRUIT_IO_FAN_FEED,
  pump: ADAFRUIT_IO_PUMP_FEED,
  autoButton: ADAFRUIT_IO_AUTO_BUTTON_FEED,
};

export type OutputDeviceType = keyof typeof outputDeviceKey;

/*
interface ICreateDataAIOResponse {
  id: string;
  value: string;
  feed_id: number;
  feed_key: string;
  created_at: string;
  location: object;
  lat: number;
  lon: number;
  ele: number;
  created_epoch: number;
  expiration: string;
}
*/

const instance = axios.create({
  baseURL: baseURL,
  method: "post",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "X-AIO-Key": ADAFRUIT_IO_API_KEY,
  },
});

export async function createDataAIO(
  deviceName: OutputDeviceType,
  value: number,
): Promise<boolean> {
  const response = await instance
    .post(`/${username}/feeds/${outputDeviceKey[deviceName]}/data`, {
      value: value,
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
  return Boolean(response);
}
