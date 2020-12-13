import { Injectable } from '@nestjs/common';
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';


@Injectable()
export class AppService {
  proxyRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return axios(config);
  }
}
