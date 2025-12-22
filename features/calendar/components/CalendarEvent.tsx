interface ICalendarEventProps {
  title: string;
  time: string;
  color: string;
}

export const CalendarEvent = ({ title, time, color }: ICalendarEventProps) => {
  return (
    <div
      className={`text-[10px] p-1.5 rounded-r w-full mb-1 cursor-pointer hover:opacity-90 transition-opacity ${color}`}
    >
      <div className="font-bold truncate">{title}</div>
      <div className="truncate opacity-80">{time}</div>
    </div>
  );
};
