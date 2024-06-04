import { useEffect, useState } from "react";
import { useStore } from "./hooks/store";
import EventDialog from "./components/EventDialog";
import ConfirmationDialog from "./components/ConfirmationDialog";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons

function App() {
  const { events, addEvent, editEvent, deleteEvent } = useStore();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isConfirmMaxEventOpen, setIsConfirmMaxEventOpen] = useState(false);
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
    if (events[day]?.length >= 3) {
      setIsConfirmMaxEventOpen(true);
      return;
    }

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
      <div className="my-5">
        <h2 className="text-2xl font-semibold">
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
          })}{" "}
          {currentYear}
        </h2>
      </div>
      <div className="flex w-full bg-black text-white py-2">
        {[
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].map((day, index) => (
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
            className="w-full min-h-32 border flex flex-col  p-2 cursor-pointer relative"
            onClick={() => handleAddEvent(day)}
          >
            <span>{day}</span>
            <div className="mt-2 w-full">
              {events[day]?.map((event, index) => (
                <div
                  key={index}
                  className={`text-white p-2 mb-1 rounded flex flex-col relative`}
                  style={{ backgroundColor: events[day][index].color }}
                >
                  <p className="text-xs font-semibold">{event.name}</p>
                  <p className="text-xs">{event.invitees.join(", ")}</p>
                  <p className="text-xs">{event.time}</p>
                  <div className="absolute top-0 right-0 flex bg-slate-50 bg-opacity-40 p-1 rounded-bl-md">
                    <FaEdit
                      className="text-yellow-500 cursor-pointer mr-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditEvent(day, index);
                      }}
                    />
                    <FaTrash
                      className="text-red-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(day, index);
                      }}
                    />
                  </div>
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
      <ConfirmationDialog
        isOpen={isConfirmMaxEventOpen}
        onClose={() => setIsConfirmMaxEventOpen(false)}
        message="Maximum 3 events per day!"
      />
    </div>
  );
}

export default App;
