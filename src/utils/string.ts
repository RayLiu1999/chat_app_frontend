// 生成指定長度的隨機字符串
const generateRandomString = (length: number): string => {
  let result = '';
  while (result.length < length) {
    result += Math.random().toString(36).substring(2);
  }
  return result.substring(0, length);
}

export { generateRandomString }
