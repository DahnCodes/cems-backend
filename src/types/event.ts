export interface Organizer {
  _id: string;
  fullName: string;
  email: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  eventDate: string;
  capacity: number;
  registeredCount: number;
  coverImage: string;
  status: "draft" | "published";
  organizerId: Organizer;
  createdAt: string;
  updatedAt: string;
}