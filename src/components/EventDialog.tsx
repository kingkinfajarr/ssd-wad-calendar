import React, { useState, useEffect } from "react";

type EventDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, time: string, invitees: string[]) => void;
  initialName?: string;
  initialTime?: string;
  initialInvitees?: string[];
};

const EventDialog: React.FC<EventDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialName = "",
  initialTime = "",
  initialInvitees = [],
}) => {
  const [name, setName] = useState(initialName);
  const [time, setTime] = useState(initialTime);
  const [invitees, setInvitees] = useState(initialInvitees.join(","));
  const [inviteesError, setInviteesError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setTime(initialTime);
      setInvitees(initialInvitees.join(","));
    }
  }, [isOpen, initialName, initialTime, initialInvitees]);

  const validateEmails = (emails: string) => {
    const emailArray = emails.split(",");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (let email of emailArray) {
      email = email.trim();
      if (!emailRegex.test(email)) {
        return false;
      }
    }
    return true;
  };

  const handleSave = () => {
    if (validateEmails(invitees)) {
      onSave(
        name,
        time,
        invitees.split(",").map((email) => email.trim())
      );
      onClose();
    } else {
      setInviteesError("One or more invitees have invalid email addresses.");
    }
  };

  const handleInviteesChange = (value: string) => {
    setInvitees(value);
    if (inviteesError) {
      setInviteesError("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex items-center justify-center ">
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col min-w-[400px]">
        <h3 className="text-lg font-medium mb-4 text-center">
          {initialName ? "Edit Event" : "Add Event"}
        </h3>
        <input
          type="text"
          placeholder="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        <input
          type="time"
          placeholder="Event Time (HH:MM AM/PM)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        <input
          type="text"
          placeholder="Invitees (comma separated emails)"
          value={invitees}
          onChange={(e) => handleInviteesChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-1"
        />
        {inviteesError && (
          <p className="text-red-500 text-xs text-left">{inviteesError}</p>
        )}
        <div className="flex items-center justify-center mt-3">
          <button
            onClick={onClose}
            className="p-2 border border-gray-300 rounded-md w-full"
          >
            Cancel
          </button>
          <div className="w-4"></div>
          <button
            onClick={handleSave}
            className="p-2 bg-blue-500 text-white rounded-md w-full"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDialog;
