import type { App } from 'vue';

// 定義並註冊全域函數
export function globalFunctionsPlugin(app: App) {
  // 生成 CSRF token
  const generateCsrfToken = (): { name: string, value: string } => {
    const csrfName: string = 'csrf_name_' + generateRandomString(10);
    const csrfValue: string = 'csrf_value_' + generateRandomString(50);

    document.cookie = `${csrfName}=${csrfValue}; path=/`;

    return {
      name: csrfName,
      value: csrfValue
    }
  }

  // 生成指定長度的隨機字符串
  const generateRandomString = (length: number): string => {
    let result = '';
    while (result.length < length) {
      result += Math.random().toString(36).substring(2);
    }
    return result.substring(0, length);
  }

  // 提供包含多個函數的物件
  app.provide('globalFunctions', {
    generateCsrfToken,
    generateRandomString
  });
}
