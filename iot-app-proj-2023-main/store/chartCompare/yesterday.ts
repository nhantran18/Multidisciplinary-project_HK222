export const initialData = [
  { x: new Date("2023-01-01T00:00:00").getTime(), y: 27, z: 60 },
  { x: new Date("2023-01-01T03:00:00").getTime(), y: 25, z: 63 },
  { x: new Date("2023-01-01T06:00:00").getTime(), y: 23, z: 68 },
  { x: new Date("2023-01-01T09:00:00").getTime(), y: 26, z: 60 },
  { x: new Date("2023-01-01T12:00:00").getTime(), y: 25, z: 69 },
  // { x: new Date("2023-01-01T17:00:00").getTime(), y: 36 },
  // { x: new Date("2023-01-01T18:00:00").getTime(), y: 34 },
  // { x: new Date("2023-01-01T21:00:00").getTime(), y: 32 },
];

export const yesterdayTemperatureData = [
  {
    x: new Date("2023-01-01T00:00:00").getTime(),
    y: 29,
    z: initialData[0].y,
  },
  {
    x: new Date("2023-01-01T03:00:00").getTime(),
    y: 31,
    z: initialData[1].y,
  },
  {
    x: new Date("2023-01-01T06:00:00").getTime(),
    y: 30,
    z: initialData[2].y,
  },
  {
    x: new Date("2023-01-01T09:00:00").getTime(),
    y: 34,
    z: initialData[3].y,
  },
  {
    x: new Date("2023-01-01T12:00:00").getTime(),
    y: 36,
    z: initialData[4].y,
  },
  { x: new Date("2023-01-01T15:00:00").getTime(), y: 37 },
  { x: new Date("2023-01-01T18:00:00").getTime(), y: 33 },
  { x: new Date("2023-01-01T21:00:00").getTime(), y: 31 },
];

export const yesterdayHumidityData = [
  {
    x: new Date("2023-01-01T00:00:00").getTime(),
    y: 54,
    z: initialData[0].z,
  },
  {
    x: new Date("2023-01-01T03:00:00").getTime(),
    y: 53,
    z: initialData[1].z,
  },
  {
    x: new Date("2023-01-01T06:00:00").getTime(),
    y: 45,
    z: initialData[2].z,
  },
  {
    x: new Date("2023-01-01T09:00:00").getTime(),
    y: 56,
    z: initialData[3].z,
  },
  {
    x: new Date("2023-01-01T12:00:00").getTime(),
    y: 58,
    z: initialData[4].z,
  },
  { x: new Date("2023-01-01T15:00:00").getTime(), y: 65 },
  { x: new Date("2023-01-01T18:00:00").getTime(), y: 62 },
  { x: new Date("2023-01-01T21:00:00").getTime(), y: 58 },
];
