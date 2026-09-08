// src/core/types/common.ts
export interface ApiResponse<T> {
  data: T
  status: string
}
