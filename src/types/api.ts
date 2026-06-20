import { Event } from "./event";

export interface EventsResponse {
  success: boolean;
  count: number;
  events: Event[];
}