/**
 * 表單驗證工具函數
 */

// 驗證規則類型
export interface ValidationRule {
  required?: boolean
  message?: string
  trigger?: string | string[]
  validator?: (rule: any, value: any, callback: any) => void
}

/**
 * 檢查是否為空值
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined || value === '') return true
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * 檢查字串長度
 */
export const checkLength = (value: string, min: number, max: number): boolean => {
  if (!value) return false
  return value.length >= min && value.length <= max
}

/**
 * 驗證電子郵件格式
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 驗證密碼強度
 * 至少8個字符，包含大小寫字母和數字
 */
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

/**
 * 驗證使用者名稱
 * 3-20個字符，只允許字母、數字和底線
 */
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/
  return usernameRegex.test(username)
}

/**
 * 驗證手機號碼（台灣格式）
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^09\d{8}$/
  return phoneRegex.test(phone)
}

/**
 * 驗證 URL 格式
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 驗證數字範圍
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

/**
 * 驗證圖片檔案類型
 */
export const isValidImageType = (file: File, allowedTypes?: string[]): boolean => {
  const defaultTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
  const types = allowedTypes || defaultTypes
  return types.includes(file.type)
}

/**
 * 驗證檔案大小
 */
export const isValidFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  return file.size <= maxSizeInBytes
}

/**
 * 驗證圖片尺寸
 */
export const validateImageDimensions = (
  file: File,
  options: {
    maxWidth?: number
    maxHeight?: number
    minWidth?: number
    minHeight?: number
  }
): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      const { width, height } = img
      URL.revokeObjectURL(url)
      
      const { maxWidth, maxHeight, minWidth, minHeight } = options
      
      if (maxWidth && width > maxWidth) {
        resolve(false)
        return
      }
      if (maxHeight && height > maxHeight) {
        resolve(false)
        return
      }
      if (minWidth && width < minWidth) {
        resolve(false)
        return
      }
      if (minHeight && height < minHeight) {
        resolve(false)
        return
      }
      
      resolve(true)
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(false)
    }
    
    img.src = url
  })
}

/**
 * 格式化檔案大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Element Plus 驗證規則生成器
 */
export const createValidationRules = {
  /**
   * 必填欄位規則
   */
  required: (message: string = '此欄位為必填項目'): ValidationRule => ({
    required: true,
    message,
    trigger: 'blur'
  }),

  /**
   * 電子郵件驗證規則
   */
  email: (message: string = '請輸入有效的電子郵件地址'): ValidationRule => ({
    validator: (rule: any, value: any, callback: any) => {
      if (!value) {
        callback()
        return
      }
      if (!isValidEmail(value)) {
        callback(new Error(message))
        return
      }
      callback()
    },
    trigger: 'blur'
  }),

  /**
   * 密碼驗證規則
   */
  password: (message: string = '密碼至少8個字符，包含大小寫字母和數字'): ValidationRule => ({
    validator: (rule: any, value: any, callback: any) => {
      if (!value) {
        callback()
        return
      }
      // 使用 isValidPassword 來同時檢查長度和字符要求
      if (!isValidPassword(value)) {
        callback(new Error(message))
        return
      }
      callback()
    },
    trigger: 'blur'
  }),

  /**
   * 使用者名稱驗證規則
   */
  username: (message: string = '使用者名稱為3-20個字符，只允許字母、數字和底線'): ValidationRule => ({
    validator: (rule: any, value: any, callback: any) => {
      if (!value) {
        callback()
        return
      }
      if (!isValidUsername(value)) {
        callback(new Error(message))
        return
      }
      callback()
    },
    trigger: 'blur'
  }),

  /**
   * 字串長度驗證規則
   */
  length: (min: number, max: number, message?: string): ValidationRule => ({
    validator: (rule: any, value: any, callback: any) => {
      if (!value) {
        callback()
        return
      }
      if (!checkLength(value, min, max)) {
        callback(new Error(message || `長度必須在${min}-${max}個字符之間`))
        return
      }
      callback()
    },
    trigger: 'blur'
  }),

  /**
   * 手機號碼驗證規則
   */
  phone: (message: string = '請輸入有效的手機號碼'): ValidationRule => ({
    validator: (rule: any, value: any, callback: any) => {
      if (!value) {
        callback()
        return
      }
      if (!isValidPhone(value)) {
        callback(new Error(message))
        return
      }
      callback()
    },
    trigger: 'blur'
  }),

  /**
   * URL 驗證規則
   */
  url: (message: string = '請輸入有效的 URL'): ValidationRule => ({
    validator: (rule: any, value: any, callback: any) => {
      if (!value) {
        callback()
        return
      }
      if (!isValidUrl(value)) {
        callback(new Error(message))
        return
      }
      callback()
    },
    trigger: 'blur'
  }),

  /**
   * 確認密碼驗證規則
   */
  confirmPassword: (passwordRef: () => string, message: string = '兩次輸入的密碼不一致'): ValidationRule => ({
    validator: (rule: any, value: any, callback: any) => {
      if (!value) {
        callback()
        return
      }
      if (value !== passwordRef()) {
        callback(new Error(message))
        return
      }
      callback()
    },
    trigger: 'blur'
  }),

  /**
   * 自定義驗證規則
   */
  custom: (
    validator: (value: any) => boolean,
    message: string,
    trigger: string | string[] = 'blur'
  ): ValidationRule => ({
    validator: (rule: any, value: any, callback: any) => {
      if (!value) {
        callback()
        return
      }
      if (!validator(value)) {
        callback(new Error(message))
        return
      }
      callback()
    },
    trigger
  }),

  /**
   * 圖片檔案驗證規則
   */
  imageFile: (
    options: {
      required?: boolean
      maxSizeInMB?: number
      allowedTypes?: string[]
      maxWidth?: number
      maxHeight?: number
      minWidth?: number
      minHeight?: number
    } = {},
    messages?: {
      required?: string
      invalidType?: string
      oversized?: string
      dimensionError?: string
    }
  ): ValidationRule => ({
    validator: async (rule: any, value: any, callback: any) => {
      const {
        required = false,
        maxSizeInMB = 5,
        allowedTypes,
        maxWidth,
        maxHeight,
        minWidth,
        minHeight
      } = options

      const {
        required: requiredMsg = '請選擇圖片檔案',
        invalidType: invalidTypeMsg = '請選擇有效的圖片檔案',
        oversized: oversizedMsg = `檔案大小不能超過 ${maxSizeInMB}MB`,
        dimensionError: dimensionErrorMsg = '圖片尺寸不符合要求'
      } = messages || {}

      // 檢查是否為必填
      if (required && !value) {
        callback(new Error(requiredMsg))
        return
      }

      // 如果不是必填且沒有值，則通過驗證
      if (!required && !value) {
        callback()
        return
      }

      // 檢查是否為 File 物件
      if (!(value instanceof File)) {
        callback(new Error(invalidTypeMsg))
        return
      }

      // 檢查檔案類型
      if (!isValidImageType(value, allowedTypes)) {
        callback(new Error(invalidTypeMsg))
        return
      }

      // 檢查檔案大小
      if (!isValidFileSize(value, maxSizeInMB)) {
        callback(new Error(oversizedMsg))
        return
      }

      // 檢查圖片尺寸（如果有設定）
      if (maxWidth || maxHeight || minWidth || minHeight) {
        try {
          const isDimensionValid = await validateImageDimensions(value, {
            maxWidth,
            maxHeight,
            minWidth,
            minHeight
          })
          
          if (!isDimensionValid) {
            callback(new Error(dimensionErrorMsg))
            return
          }
        } catch (error) {
          callback(new Error('圖片載入失敗'))
          return
        }
      }

      callback()
    },
    trigger: 'change'
  }),
}

/**
 * 表單驗證輔助函數
 */
export const formValidators = {
  /**
   * 驗證整個表單
   */
  validateForm: async (formRef: any): Promise<boolean> => {
    if (!formRef) return false
    try {
      await formRef.validate()
      return true
    } catch {
      return false
    }
  },

  /**
   * 清除表單驗證
   */
  clearValidation: (formRef: any): void => {
    if (formRef) {
      formRef.clearValidate()
    }
  },

  /**
   * 重設表單
   */
  resetForm: (formRef: any): void => {
    if (formRef) {
      formRef.resetFields()
    }
  },

  /**
   * 驗證特定欄位
   */
  validateField: async (formRef: any, field: string): Promise<boolean> => {
    if (!formRef) return false
    try {
      await formRef.validateField(field)
      return true
    } catch {
      return false
    }
  }
}