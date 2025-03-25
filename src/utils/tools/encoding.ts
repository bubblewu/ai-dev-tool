// Base64 编码/解码
export function processBase64(input: string): string {
  try {
    // 检测是编码还是解码
    if (/^[A-Za-z0-9+/=]+$/.test(input.trim())) {
      // 看起来是Base64，尝试解码
      try {
        // 先尝试标准的 atob
        return atob(input);
      } catch (_) {
        // 如果失败，尝试解码 UTF-8 字符
        return decodeURIComponent(escape(atob(input)));
      }
    } else {
      // 编码 - 使用 UTF-8 安全的方法
      return btoa(unescape(encodeURIComponent(input)));
    }
  } catch (error) {
    console.error('Base64处理错误:', error);
    throw new Error('处理出错，请检查输入');
  }
}

// URL 编码/解码
export function processUrlEncode(input: string): string {
  try {
    // 尝试解码（如果输入是已编码的）
    const decoded = decodeURIComponent(input);
    // 如果解码后与输入相同，则可能是未编码的，进行编码
    if (decoded === input) {
      return encodeURIComponent(input);
    }
    return decoded;
  } catch (error) {
    // 如果解码失败，执行编码
    return encodeURIComponent(input);
  }
}

// HTML 编码/解码
export function processHtmlEncode(input: string): string {
  // 创建一个临时元素
  const textarea = document.createElement('textarea');
  textarea.innerHTML = input;
  const decoded = textarea.value;
  
  // 如果解码后与输入相同，则可能是未编码的，进行编码
  if (decoded === input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }
  return decoded;
} 