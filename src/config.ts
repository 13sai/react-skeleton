export const apiAddress = "http://localhost:8888/";

export const proxyApi = "/api";

export const urlPrefix = process.env.NODE_ENV === "dev" ? proxyApi : "";
