// 文本工具

// 文本差异比较
export function diffTexts(text1: string, text2: string): string {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  
  let result = '';
  let i = 0, j = 0;
  
  while (i < lines1.length || j < lines2.length) {
    if (i >= lines1.length) {
      // 第一个文本已结束，第二个文本还有行
      result += `<div class="diff-add">+ ${escapeHtml(lines2[j])}</div>\n`;
      j++;
    } else if (j >= lines2.length) {
      // 第二个文本已结束，第一个文本还有行
      result += `<div class="diff-remove">- ${escapeHtml(lines1[i])}</div>\n`;
      i++;
    } else if (lines1[i] === lines2[j]) {
      // 行相同
      result += `<div class="diff-equal"> ${escapeHtml(lines1[i])}</div>\n`;
      i++;
      j++;
    } else {
      // 行不同
      result += `<div class="diff-remove">- ${escapeHtml(lines1[i])}</div>\n`;
      result += `<div class="diff-add">+ ${escapeHtml(lines2[j])}</div>\n`;
      i++;
      j++;
    }
  }
  
  return result;
}

// 文本大小写转换
export function convertTextCase(text: string, caseType: string): string {
  switch (caseType) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text.replace(/\b\w/g, char => char.toUpperCase());
    case 'sentence':
      return text.replace(/(^\s*\w|[.!?]\s*\w)/g, char => char.toUpperCase());
    case 'camel':
      return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      ).replace(/\s+/g, '');
    case 'pascal':
      return text.replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase())
        .replace(/\s+/g, '');
    case 'snake':
      return text.toLowerCase().replace(/\s+/g, '_');
    case 'kebab':
      return text.toLowerCase().replace(/\s+/g, '-');
    default:
      return text;
  }
}

// HTML 转义
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
} 