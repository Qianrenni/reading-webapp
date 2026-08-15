import {
  SystemInfo,
  LogFileInfo,
  PageResult,
  LogEntry,
  ConfigView,
} from '@guga-reading/types';
import { get, put } from '../utils';
export const useApiSystem = {
  prefix: '/system',
  getSystemInfo: async function () {
    return await get<SystemInfo>(`${this.prefix}/info`);
  },

  /** 获取全部动态配置领域及其当前生效值 */
  getConfigs: async function () {
    return await get<ConfigView[]>(`${this.prefix}/config`);
  },

  /**
   * 更新某领域动态配置（部分字段合并，写 Redis + 失效本地缓存，热更新无需重启）
   * @param domain 配置领域（如 RATE_LIMIT）
   * @param values 要更新的键值对
   */
  updateConfig: async function (
    domain: string,
    values: Record<string, string>,
  ) {
    return await put<ConfigView>(`${this.prefix}/config/${domain}`, values);
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
