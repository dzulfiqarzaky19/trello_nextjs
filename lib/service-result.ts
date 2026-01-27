export type HttpErrorStatus = 400 | 401 | 403 | 404 | 500;

export interface ServiceSuccess<T> {
  ok: true;
  data: T;
}

export interface ServiceError {
  ok: false;
  error: string;
  status: HttpErrorStatus;
}

export type ServiceResult<T> = ServiceSuccess<T> | ServiceError;
