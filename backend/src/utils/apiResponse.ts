export function success(data: any, meta?: any) {
  return {
    data,
    error: null,
    meta: meta || null
  };
}

export function fail(message: string) {
  return {
    data: null,
    error: message,
    meta: null
  };
}