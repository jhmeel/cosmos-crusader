/* eslint-disable @typescript-eslint/no-explicit-any */
import { notification } from "antd";
import { ArgsProps } from "antd/lib/notification";


const defaultOptions: Partial<ArgsProps> = {
  duration: 5,
  placement: "bottomRight",
};


export function success(message: string, description?: string): void {
  notification.success({
    ...defaultOptions,
    message,
    description,
  });
}

export function info(message: string, description?: string): void {
  notification.info({
    ...defaultOptions,
    message,
    description,
  });
}

export function warning(message: string, description?: string): void {
  notification.warning({
    ...defaultOptions,
    message,
    description,
  });
}

export function error(message: string, error: any): void {
  notification.error({
    ...defaultOptions,
    message,
    description: error?.message,
  });
}
