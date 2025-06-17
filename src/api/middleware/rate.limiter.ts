import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 minutos por 60 segundos por 1000 milisegundos
  limit: 100, 
  standardHeaders: "draft-7", //draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable `X-RateLimit-*` headers.
});