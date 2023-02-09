export type RegisterFormData = {
  name: string
  email: string
  password: string
  role: string
}

export interface JwtPayload {
  userId: string
}

export enum msgType {
  ERROR = "error",
  SUCCESS = "success",
  INFO = "info",
}

export enum ACCOUNT_TYPE {
  TUTTOR = "tuttor",
  EMPLOYER = "employer",
}

export interface JobType {
  _id: string
  user: string
  title: string
  location: string
  budgetMin: number
  budgetMax?: number
  tutorType: string
  numberOfStudents: string
  desc: string
  createdAt: string
  requirements: string[]
  proposals: string[]
  saves: string[]
  schedule: string[]
}
