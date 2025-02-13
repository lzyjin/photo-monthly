interface CalendarDateProps {
  date: number;
  isThisMonth: boolean;
}

export default function CalendarDate({date, isThisMonth}: CalendarDateProps) {
  const today = new Date();
  const todayDate = today.getDate();


  return (
    <div className="h-28 border-b border-foreground">
      {
        date !== 0 ?
        <div>
          {
            isThisMonth && date === todayDate ?
            <div className="relative w-full">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bottom-0 size-5 rounded-full bg-foreground" />
              <span className="text-white relative">{date}</span>
            </div> :
            <span>{date}</span>
          }
        </div> :
        <div></div>
      }
    </div>
  );
}

// <div className="relative overflow-hidden">
//   <Image src="https://picsum.photos/200/400" alt="dd" fill className="object-cover"/>
//   <span className="relative">6</span>
// </div>