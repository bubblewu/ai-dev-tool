// JWT 解码/编码工具

// 解码 JWT
export function decodeJwt(token: string): { header: any, payload: any, signature: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('JWT 格式不正确');
    }
    
    const header = JSON.parse(atob(parts[0]));
    
    // 处理 payload 部分，确保正确解码 base64url
    let payload;
    try {
      payload = JSON.parse(atob(parts[1]));
    } catch (e) {
      // 处理 base64url 编码（替换 -_ 为 +/）
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      payload = JSON.parse(atob(base64));
    }
    
    return {
      header,
      payload,
      signature: parts[2]
    };
  } catch (error) {
    console.error('JWT 解码错误:', error);
    throw new Error('JWT 解析失败，请检查输入格式');
  }
}

// 生成 JWT（仅用于演示，实际应用中应使用更安全的方法）
export function generateJwt(payload: any, secret: string): string {
  try {
    // 创建 header
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    
    // 编码 header 和 payload
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    
    // 创建签名（注意：这是一个简化版，实际应用中应使用加密库）
    const data = encodedHeader + '.' + encodedPayload;
    const signature = btoa(
      Array.from(
        new TextEncoder().encode(data + secret)
      ).reduce((hash, byte) => (hash << 5) - hash + byte, 0).toString(16)
    );
    
    // 组合 JWT
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  } catch (error) {
    console.error('JWT 生成错误:', error);
    throw new Error('JWT 生成失败');
  }
} 