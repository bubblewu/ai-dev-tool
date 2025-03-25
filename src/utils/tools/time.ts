// 时间工具

// 时间戳转换
export function convertTimestamp(timestamp: string | number, format: string = 'iso'): string {
  try {
    // 处理输入
    let ts: number;
    if (typeof timestamp === 'string') {
      // 如果是字符串，尝试解析为数字
      ts = parseInt(timestamp, 10);
      
      // 检查是否为有效数字
      if (isNaN(ts)) {
        throw new Error('无效的时间戳');
      }
      
      // 检查是否为毫秒级时间戳（13位）或秒级时间戳（10位）
      if (ts.toString().length <= 10) {
        ts *= 1000; // 转换为毫秒
      }
    } else {
      ts = timestamp;
      // 检查是否为秒级时间戳
      if (ts.toString().length <= 10) {
        ts *= 1000; // 转换为毫秒
      }
    }
    
    // 创建日期对象
    const date = new Date(ts);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      throw new Error('无效的日期');
    }
    
    // 根据格式返回结果
    switch (format) {
      case 'iso':
        return date.toISOString();
      case 'local':
        return date.toLocaleString();
      case 'date':
        return date.toLocaleDateString();
      case 'time':
        return date.toLocaleTimeString();
      case 'unix':
        return Math.floor(date.getTime() / 1000).toString();
      case 'milliseconds':
        return date.getTime().toString();
      default:
        return date.toISOString();
    }
  } catch (error) {
    console.error('时间戳转换错误:', error);
    throw new Error('时间戳转换失败，请检查输入格式');
  }
}

// 时区转换
export function convertTimezone(date: string, fromTimezone: string, toTimezone: string): string {
  try {
    // 解析输入日期
    const inputDate = new Date(date);
    
    // 检查日期是否有效
    if (isNaN(inputDate.getTime())) {
      throw new Error('无效的日期');
    }
    
    // 获取当前时区偏移（分钟）
    const localOffset = inputDate.getTimezoneOffset();
    
    // 解析时区字符串（格式如 "UTC+8"）
    const parseTimezone = (tz: string): number => {
      const match = tz.match(/UTC([+-])(\d+)(?::(\d+))?/);
      if (!match) {
        throw new Error(`无效的时区格式: ${tz}`);
      }
      
      const sign = match[1] === '+' ? 1 : -1;
      const hours = parseInt(match[2], 10);
      const minutes = match[3] ? parseInt(match[3], 10) : 0;
      
      return sign * (hours * 60 + minutes);
    };
    
    // 计算时区偏移（分钟）
    const fromOffset = parseTimezone(fromTimezone);
    const toOffset = parseTimezone(toTimezone);
    
    // 计算时差（分钟）
    const diff = toOffset - fromOffset;
    
    // 调整时间
    const newDate = new Date(inputDate.getTime() + diff * 60 * 1000);
    
    // 返回结果
    return newDate.toISOString();
  } catch (error) {
    console.error('时区转换错误:', error);
    throw new Error('时区转换失败，请检查输入格式');
  }
}

// Cron 表达式解析
export function parseCronExpression(expression: string): string {
  try {
    // 解析 cron 表达式
    const parts = expression.trim().split(/\s+/);
    
    // 检查部分数量
    if (parts.length < 5 || parts.length > 6) {
      throw new Error('无效的 cron 表达式格式');
    }
    
    // 解析各个部分
    const [minute, hour, dayOfMonth, month, dayOfWeek, year] = parts;
    
    // 简单的描述生成
    let description = '执行时间: ';
    
    // 分钟
    if (minute === '*') {
      description += '每分钟';
    } else if (minute.includes('/')) {
      const [, step] = minute.split('/');
      description += `每 ${step} 分钟`;
    } else {
      description += `在第 ${minute} 分钟`;
    }
    
    // 小时
    if (hour === '*') {
      description += ', 每小时';
    } else if (hour.includes('/')) {
      const [, step] = hour.split('/');
      description += `, 每 ${step} 小时`;
    } else {
      description += `, 在 ${hour} 点`;
    }
    
    // 日期
    if (dayOfMonth === '*') {
      description += ', 每天';
    } else if (dayOfMonth.includes('/')) {
      const [, step] = dayOfMonth.split('/');
      description += `, 每 ${step} 天`;
    } else {
      description += `, 在每月的第 ${dayOfMonth} 天`;
    }
    
    // 月份
    if (month === '*') {
      description += ', 每月';
    } else if (month.includes('/')) {
      const [, step] = month.split('/');
      description += `, 每 ${step} 个月`;
    } else {
      const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
      const monthIndices = month.split(',').map(m => parseInt(m, 10) - 1);
      const monthList = monthIndices.map(i => monthNames[i]).join(', ');
      description += `, 在 ${monthList}`;
    }
    
    // 星期
    if (dayOfWeek !== '*') {
      const dayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const dayIndices = dayOfWeek.split(',').map(d => parseInt(d, 10));
      const dayList = dayIndices.map(i => dayNames[i]).join(', ');
      description += `, 在 ${dayList}`;
    }
    
    // 年份
    if (year && year !== '*') {
      description += `, 在 ${year} 年`;
    }
    
    // 计算下一次执行时间
    const now = new Date();
    let nextDate = now;
    
    // 简单的下一次执行时间计算（仅用于演示）
    if (minute !== '*') {
      const minuteValue = parseInt(minute, 10);
      if (minuteValue > now.getMinutes()) {
        nextDate.setMinutes(minuteValue);
      } else {
        nextDate.setHours(now.getHours() + 1);
        nextDate.setMinutes(minuteValue);
      }
    }
    
    if (hour !== '*') {
      const hourValue = parseInt(hour, 10);
      if (hourValue > now.getHours() || (hourValue === now.getHours() && nextDate.getMinutes() > now.getMinutes())) {
        nextDate.setHours(hourValue);
      } else {
        nextDate.setDate(now.getDate() + 1);
        nextDate.setHours(hourValue);
      }
    }
    
    description += `\n\n下一次执行时间: ${nextDate.toLocaleString()}`;
    
    return description;
  } catch (error) {
    console.error('Cron 解析错误:', error);
    throw new Error('Cron 表达式解析失败，请检查输入格式');
  }
} 