import { format } from 'sql-formatter';

export interface FormatOptions {
  language: 'sql' | 'mysql' | 'postgresql' | 'sqlite' | 'javascript' | 'typescript' | 'json' | 'html' | 'css';
  indent: number;
  uppercase?: boolean;
  linesBetweenQueries?: number;
}

export function formatSQL(sql: string, options: FormatOptions): string {
  try {
    const formatted = format(sql, {
      language: options.language === 'sql' ? 'sql' : options.language,
      tabWidth: options.indent,
      keywordCase: options.uppercase ? 'upper' : 'lower',
      linesBetweenQueries: options.linesBetweenQueries || 1,
    });
    return formatted;
  } catch (error) {
    throw new Error(`SQL formatting error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function formatJSON(json: string, indent: number = 2): string {
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed, null, indent);
  } catch (error) {
    throw new Error(`JSON formatting error: ${error instanceof Error ? error.message : 'Invalid JSON'}`);
  }
}

export function formatJavaScript(code: string, options: FormatOptions): string {
  // Simple JavaScript formatting - in production, you'd use a proper formatter like Prettier
  try {
    let formatted = code;
    const indent = ' '.repeat(options.indent);
    
    // Basic indentation for common patterns
    formatted = formatted.replace(/\{/g, '{\n');
    formatted = formatted.replace(/\}/g, '\n}');
    formatted = formatted.replace(/;/g, ';\n');
    
    // Remove extra newlines
    formatted = formatted.replace(/\n\s*\n/g, '\n');
    
    // Add indentation
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const result = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.includes('}')) indentLevel--;
      const indented = indent.repeat(Math.max(0, indentLevel)) + trimmed;
      if (trimmed.includes('{')) indentLevel++;
      return indented;
    }).join('\n');
    
    return result;
  } catch (error) {
    throw new Error(`JavaScript formatting error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function formatCSS(css: string, indent: number = 2): string {
  try {
    const indentStr = ' '.repeat(indent);
    let formatted = css;
    
    // Add newlines and indentation
    formatted = formatted.replace(/\{/g, ' {\n');
    formatted = formatted.replace(/\}/g, '\n}\n');
    formatted = formatted.replace(/;/g, ';\n');
    
    // Remove extra whitespace
    formatted = formatted.replace(/\s+/g, ' ');
    formatted = formatted.replace(/\n\s*\n/g, '\n');
    
    // Add proper indentation
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const result = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.includes('}')) indentLevel--;
      const indented = indentStr.repeat(Math.max(0, indentLevel)) + trimmed;
      if (trimmed.includes('{')) indentLevel++;
      return indented;
    }).join('\n');
    
    return result;
  } catch (error) {
    throw new Error(`CSS formatting error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function formatHTML(html: string, indent: number = 2): string {
  try {
    const indentStr = ' '.repeat(indent);
    let formatted = html;
    
    // Add newlines after closing tags
    formatted = formatted.replace(/>/g, '>\n');
    formatted = formatted.replace(/</g, '\n<');
    
    // Remove extra newlines
    formatted = formatted.replace(/\n\s*\n/g, '\n');
    
    // Add proper indentation
    const lines = formatted.split('\n').filter(line => line.trim());
    let indentLevel = 0;
    const result = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('</')) indentLevel--;
      const indented = indentStr.repeat(Math.max(0, indentLevel)) + trimmed;
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
        indentLevel++;
      }
      return indented;
    }).join('\n');
    
    return result;
  } catch (error) {
    throw new Error(`HTML formatting error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
