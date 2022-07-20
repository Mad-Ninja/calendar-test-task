export interface ICalendarDay {
    date: Date;
    isPastDate: boolean;
    isToday: boolean;
    isLastDayOfPreviousMonth: boolean;
    events?:any;
}