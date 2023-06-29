// Referência: Error Handling in Express | https://www.youtube.com/watch?v=DyqVqaf1KnA

export class ApiError {
  constructor (public code: number, public message?: string) {}

  static badRequest (msg?: string): ApiError {
    return new ApiError(422, msg ?? 'Bad request')
  }

  static notFound (msg?: string): ApiError {
    return new ApiError(404, msg ?? 'Not found')
  }

  static internal (msg?: string): ApiError {
    return new ApiError(500, msg ?? 'Something went wrong')
  }
}

export interface ErrorSchema {
  code: number
  message: string
}
