import * as dotenv from "dotenv";
import sheetsApi from "../drivers/sheetsApi";
import { ApiResponse, DeviceResponse } from "../types/dataResponse";

dotenv.config();

const main = () => {
  get_devices();
};

const get_devices = async () => {
  const data = await sheetsApi.get<ApiResponse<DeviceResponse>>(
    `/${process.env.SHEET_ID}&page=1&perPage=579&aba=1866250139`
  );

  console.log(data.data.items[0]);
};

main();
