import { AxiosRequestConfig, AxiosResponse } from 'axios';
export declare class AppService {
    proxyRequest(config: AxiosRequestConfig): Promise<AxiosResponse>;
}
