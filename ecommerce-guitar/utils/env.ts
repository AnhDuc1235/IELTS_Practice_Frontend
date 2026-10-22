export const SERVER_API =
  (process.env.NEXT_PUBLIC_SERVER_API ?? "http://localhost:3001").replace(/\/$/, "");
