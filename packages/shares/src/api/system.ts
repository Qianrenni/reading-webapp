import {
  SystemInfo,
  LogFileInfo,
  PageResult,
  LogEntry,
} from '@guga-reading/types';
import { get } from '../utils';
export const useApiSystem = {
  prefix: '/system',
  getSystemInfo: async function () {
    return await get<SystemInfo>(`${this.prefix}/info`);
  },

  /**
   * 获取日志文件列表
   */
  getLogFiles: async function () {
    return await get<LogFileInfo[]>(`${this.prefix}/logs`);
  },

  /**
   * 分页读取日志内容
   * @param file   日志文件名
   * @param level  过滤级别(可选)
   * @param page   页码(默认1)
   * @param size   每页条数(默认100)
   * @param regex  正则搜索表达式(可选)
   */
  readLog: async function (
    file: string,
    level?: string,
    page: number = 1,
    size: number = 100,
    regex?: string,
  ) {
    const params = new URLSearchParams({
      file,
      page: String(page),
      size: String(size),
    });
    if (level) params.set('level', level);
    if (regex) params.set('regex', regex);
    return await get<PageResult<LogEntry>>(
      `${this.prefix}/logs/read?${params.toString()}`,
    );
  },
};
