export { };

// declare module '@vue/runtime-core' {
//   interface GlobalFunctions {
//     generateCsrfToken: () => { name: string, value: string }
//     generateRandomString: (length: number) => string
//   }
// }


declare module 'vue' {
  interface GlobalFunctions {
    generateCsrfToken: () => { name: string, value: string }
    generateRandomString: (length: number) => string
  }
}