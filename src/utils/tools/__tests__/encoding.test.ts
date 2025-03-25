import { processBase64, processUrlEncode, processHtmlEncode } from '../encoding';

describe('Encoding utilities', () => {
  describe('processBase64', () => {
    it('should encode plain text to Base64', () => {
      expect(processBase64('Hello, world!')).toBe('SGVsbG8sIHdvcmxkIQ==');
    });
    
    it('should decode Base64 to plain text', () => {
      expect(processBase64('SGVsbG8sIHdvcmxkIQ==')).toBe('Hello, world!');
    });
    
    it('should handle UTF-8 characters correctly', () => {
      const text = '你好，世界！';
      const encoded = processBase64(text);
      expect(processBase64(encoded)).toBe(text);
    });
  });
  
  // 更多测试...
}); 