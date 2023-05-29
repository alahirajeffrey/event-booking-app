import { Decimal } from "@prisma/client/runtime";

type EventType = {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  seatPrice: Decimal;
  organizerId: string;
  createdAt: Date;
  updatedAt: Date;
};

export default EventType;
