/**
 * create event id for google calender from event id
 * @param eventId : string
 * @returns : event id for google calender
 */
export const createCalenderId = (eventId: string) => {
  return eventId.split("-")[0];
};
