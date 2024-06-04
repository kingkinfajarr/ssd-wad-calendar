import { useEffect, useState } from "react";
import { useStore } from "./hooks/store";
import EventDialog from "./components/EventDialog";
import ConfirmationDialog from "./components/ConfirmationDialog";

function App() {
  const { events, addEvent, editEvent, deleteEvent } = useStore();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false); // State for confirmation dialog
  const [deleteDay, setDeleteDay] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const currentMonth = 5;
  const currentYear = 2024;

  useEffect(() => {
    generateDays(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const generateDays = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    return daysArray;
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleAddEvent = (day: number) => {
    setSelectedDay(day);
    setEditIndex(null);
    setIsDialogOpen(true);
  };

  const handleEditEvent = (day: number, index: number) => {
    setSelectedDay(day);
    setEditIndex(index);
    setIsDialogOpen(true);
  };

  const handleSaveEvent = (name: string, time: string, invitees: string[]) => {
    if (selectedDay === null) return;
    if (editIndex === null) {
      addEvent(selectedDay, name, time, invitees);
    } else {
      editEvent(selectedDay, editIndex, name, time, invitees);
    }
  };

  const handleDeleteEvent = (day: number, index: number) => {
    setDeleteDay(day);
    setDeleteIndex(index);
    setIsConfirmDialogOpen(true);
  };

  const confirmDeleteEvent = () => {
    if (deleteDay !== null && deleteIndex !== null) {
      deleteEvent(deleteDay, deleteIndex);
      setIsConfirmDialogOpen(false);
    }
  };

  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInMonth = generateDays(currentYear, currentMonth);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold">
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
          })}{" "}
          {currentYear}
        </h2>
      </div>
      <div className="flex w-full">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div key={index} className="flex-1 text-center">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 w-full">
        {Array(firstDayOfMonth)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="w-full h-32 border"></div>
          ))}
        {daysInMonth.map((day) => (
          <div
            key={day}
            className="w-full min-h-32 border flex flex-col items-center p-2 cursor-pointer"
            onClick={() => handleAddEvent(day)}
          >
            <span>{day}</span>
            <div className="mt-2 w-full">
              {events[day]?.map((event, index) => (
                <div
                  key={index}
                  className="bg-blue-500 text-white p-2 mb-1 rounded flex flex-col "
                >
                  <p>{event.name}</p>
                  <p>{event.invitees.join(", ")}</p>
                  <p>{event.time}</p>
                  <button
                    className="bg-yellow-500 text-xs px-2 py-1 m-1 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEvent(day, index);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-xs px-2 py-1 m-1 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(day, index);
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <EventDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveEvent}
        initialName={
          editIndex !== null ? events[selectedDay!][editIndex].name : ""
        }
        initialTime={
          editIndex !== null ? events[selectedDay!][editIndex].time : ""
        }
        initialInvitees={
          editIndex !== null ? events[selectedDay!][editIndex].invitees : []
        }
      />
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmDeleteEvent}
        message="Are you sure you want to delete this event?"
      />
    </div>
  );
}

export default App;
