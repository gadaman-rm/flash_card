import storage from "../../manager/store/Storage";
import apiPostRequest from "../utils/Utils";

const apiUrl = storage.localServiceAddress;

export interface downloadResponse {
  message?: string;
}

class DownloadApi {
  public async download(url: string): Promise<string | null> {
    const response = await apiPostRequest(`${apiUrl}/download`, { url });
    return response.data.message;
  }
}

const downloadApi = new DownloadApi();
export default downloadApi;
