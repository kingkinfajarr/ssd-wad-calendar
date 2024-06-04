import create from "zustand";

type Event = {
  name: string;
  time: string;
  invitees: string[];
  color: string;
};

type Store = {
  days: number[];
  events: { [key: number]: Event[] };
  addEvent: (
    day: number,
    name: string,
    time: string,
    invitees: string[]
  ) => void;
  editEvent: (
    day: number,
    eventIndex: number,
    name: string,
    time: string,
    invitees: string[]
  ) => void;
  deleteEvent: (day: number, eventIndex: number) => void;
};

const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const getInitialEvents = () => {
  const storedEvents = localStorage.getItem("events");
  return storedEvents ? JSON.parse(storedEvents) : {};
};

export const useStore = create<Store>((set) => ({
  days: [],
  events: getInitialEvents(),
  addEvent: (day, name, time, invitees) =>
    set((state) => {
      const event = { name, time, invitees, color: generateRandomColor() };
      const dayEvents = state.events[day] || [];
      if (dayEvents.length < 3) {
        const newEvents = { ...state.events, [day]: [...dayEvents, event] };
        localStorage.setItem("events", JSON.stringify(newEvents));
        return { events: newEvents };
      }
      return state;
    }),
  editEvent: (day, eventIndex, name, time, invitees) =>
    set((state) => {
      const updatedEvent = {
        ...state.events[day][eventIndex],
        name,
        time,
        invitees,
      };
      const updatedEvents = [...state.events[day]];
      updatedEvents[eventIndex] = updatedEvent;
      const newEvents = { ...state.events, [day]: updatedEvents };
      localStorage.setItem("events", JSON.stringify(newEvents));
      return { events: newEvents };
    }),
  deleteEvent: (day, eventIndex) =>
    set((state) => {
      const updatedEvents = state.events[day].filter(
        (_, index) => index !== eventIndex
      );
      const newEvents = { ...state.events, [day]: updatedEvents };
      localStorage.setItem("events", JSON.stringify(newEvents));
      return { events: newEvents };
    }),
}));
