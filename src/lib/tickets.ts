import { nanoid } from "nanoid";

export function generateTicketCode() {
  return `CEM-${nanoid(10).toUpperCase()}`;
}