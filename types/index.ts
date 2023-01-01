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
  title: string
  location: string
  budget: string
  tutorType: string
  numberOfStudents: string
  desc: string
  createdAt: string
  requirements: string[]
  schedule: string[]
}