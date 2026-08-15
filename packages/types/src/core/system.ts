/**
 * 磁盘状态
 * @param mountpoint  string  挂载点
 * @param device  string  设备
 * @param fstype  string  文件系统类型
 * @param total  number  总空间
 * @param used  number  已用空间
 * @param free  number  空闲空间
 * @param percent  number  使用百分比
 */
export interface DiskStatus {
  mountPoint: string;
  device: string;
  fStype: string;
  total: number;
  used: number;
  free: number;
  percent: number;
}
/**
 * 系统信息
 * @param cpu_percent  number  cpu使用率
 * @param memory_total  number  内存总大小
 * @param memory_used  number  内存使用大小
 * @param swap_total  number  交换总大小
 * @param swap_used  number  交换使用大小
 * @param disks  DiskStatus[]  磁盘状态列表
 */
export interface SystemInfo {
  cpuPercent: number;
  memoryTotal: number;
  memoryUsed: number;
  swapTotal: number;
  swapUsed: number;
  disks: DiskStatus[];
}

/**
 * 日志文件信息
 */
export interface LogFileInfo {
  name: string;
  size: number;
  lastModified: string;
}

/**
 * 单条日志条目
 */
export interface LogEntry {
  lineNumber: number;
  timestamp: string;
  thread: string;
  level: string;
  logger: string;
  message: string;
}
