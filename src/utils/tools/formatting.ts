// JSON 格式化
export function processJsonFormat(input: string, indentSize: number = 2): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, indentSize);
  } catch (error) {
    console.error('JSON格式化错误:', error);
    throw new Error('JSON解析失败，请检查输入格式');
  }
}

// HTML 格式化
export function processHtmlFormat(input: string): string {
  try {
    // 简单的HTML格式化
    let formatted = '';
    let indent = 0;
    const lines = input.split(/>\s*</);
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      if (i === 0) {
        formatted += line;
        continue;
      }
      
      // 检查是否是闭合标签
      if (line.match(/^\/\w/)) {
        indent--;
      }
      
      formatted += '>\n' + '  '.repeat(Math.max(0, indent)) + '<' + line;
      
      // 检查是否是自闭合标签
      const selfClosing = line.match(/\/>$/);
      
      // 检查是否是开放标签
      if (!selfClosing && !line.match(/^\//) && !line.match(/^(img|br|hr|input|link|meta)/i)) {
        indent++;
      }
    }
    
    return formatted;
  } catch (error) {
    console.error('HTML格式化错误:', error);
    throw new Error('HTML格式化失败，请检查输入');
  }
}

// XML 格式化
export function processXmlFormat(input: string): string {
  try {
    // 使用DOMParser解析XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(input, 'text/xml');
    
    // 检查解析错误
    const parseError = xmlDoc.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      throw new Error('XML解析失败');
    }
    
    // 格式化XML的函数
    const formatXml = (xml: Node, indent = ''): string => {
      let formatted = '';
      const nodeType = xml.nodeType;
      
      if (nodeType === 1) { // 元素节点
        const nodeName = xml.nodeName;
        const hasChildren = xml.hasChildNodes();
        const hasAttributes = (xml as Element).hasAttributes();
        
        formatted += indent + '<' + nodeName;
        
        // 处理属性
        if (hasAttributes) {
          const attrs = (xml as Element).attributes;
          for (let i = 0; i < attrs.length; i++) {
            formatted += ' ' + attrs[i].name + '="' + attrs[i].value + '"';
          }
        }
        
        if (!hasChildren) {
          formatted += '/>\n';
        } else {
          formatted += '>\n';
          
          // 处理子节点
          const childNodes = xml.childNodes;
          let textOnly = childNodes.length === 1 && childNodes[0].nodeType === 3;
          
          if (textOnly) {
            formatted += indent + '  ' + childNodes[0].nodeValue + '\n';
          } else {
            for (let i = 0; i < childNodes.length; i++) {
              formatted += formatXml(childNodes[i], indent + '  ');
            }
          }
          
          formatted += indent + '</' + nodeName + '>\n';
        }
      } else if (nodeType === 3) { // 文本节点
        const nodeValue = xml.nodeValue?.trim();
        if (nodeValue) {
          formatted += indent + nodeValue + '\n';
        }
      } else if (nodeType === 9) { // 文档节点
        formatted += formatXml(xml.firstChild as Node, indent);
      }
      
      return formatted;
    };
    
    return formatXml(xmlDoc);
  } catch (error) {
    console.error('XML格式化错误:', error);
    throw new Error('XML解析失败，请检查输入格式');
  }
}

// CSS 格式化
export function processCssFormat(input: string): string {
  try {
    // 简单的CSS格式化
    // 1. 移除多余的空格和注释
    let css = input.replace(/\/\*[\s\S]*?\*\//g, '').trim();
    
    // 2. 在每个 { 前添加空格
    css = css.replace(/\s*{\s*/g, ' {\n  ');
    
    // 3. 在每个 ; 后添加换行
    css = css.replace(/;\s*/g, ';\n  ');
    
    // 4. 在每个 } 前添加换行，并在后面也添加换行
    css = css.replace(/\s*}\s*/g, '\n}\n\n');
    
    // 5. 处理最后一个多余的换行
    css = css.trim();
    
    return css;
  } catch (error) {
    console.error('CSS格式化错误:', error);
    throw new Error('CSS格式化失败，请检查输入');
  }
} 