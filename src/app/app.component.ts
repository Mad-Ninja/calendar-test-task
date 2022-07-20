import { Component, OnInit } from '@angular/core';

import { ICalendarDay} from './ICalendarDay';
import {
  FormControl,
  FormGroup,
  Validators,
  ValidationErrors,
} from '@angular/forms';






@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit{
  public calendar: ICalendarDay[] = [];

  public fieldDays: ICalendarDay[] = [];

  public monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];
  public displayMonth: string = '';
  public displayYear!: number;
  private monthIndex: number = 0;
  public lastDayOfPreviousMonth!:Date;

  isShowEventWindow:boolean = false;
  topPosition!:string;
  leftPosition!:string;
  showingDay!:ICalendarDay;



  datePick = new FormControl(new Date())
  
  eventModalForm: FormGroup = new FormGroup({
    eventTitle: new FormControl('', [
      Validators.required,
    ]),
    eventNames: new FormControl(''),
    eventDescription: new FormControl(''),
  });


  ngOnInit(): void {

    let data = JSON.parse(localStorage.getItem('daysWithEvents')!);
    if(data){
      this.fieldDays = data;
    }  
    console.log(this.fieldDays);
    this.generateCalendarDays(this.monthIndex);
    
  }

  private generateCalendarDays(monthIndex: number): void {
    // we reset our calendar
    this.calendar = [];

    // we set the date 
    let day: Date = new Date(new Date().setMonth(new Date().getMonth() + monthIndex));
    
    // set the dispaly month for UI
    this.displayMonth = this.monthNames[day.getMonth()];
    this.displayYear = day.getFullYear();

    //console.log(this.displayMonth)
    let startingDateOfCalendar = this.getStartDateForCalendar(day);

    let dateToAdd = startingDateOfCalendar;

    for (var i = 0; i < 42; i++) {

      let calendarDayObj:ICalendarDay = {
        date: new Date(dateToAdd),
        isPastDate:  dateToAdd.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0),
        isToday :  dateToAdd.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0),
        isLastDayOfPreviousMonth: this.lastDayOfPreviousMonth.getDate() + 1 == new Date(dateToAdd).getDate(),

      }
      
      if(this.fieldDays.length > 0){
        let obj = this.fieldDays.find((day) =>{
        return new Date(day.date).toISOString() == calendarDayObj.date.toISOString();
        console.log(obj);
      })
        if(obj){
          calendarDayObj.events = obj.events;
        }
       }
      this.calendar.push(calendarDayObj);
      dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
    }
   
   // console.log(new Date(this.fieldDays[0].date).getDate() == this.calendar[24].date.getDate())
    //console.log(this.calendar[24].date)
    
  }

  private getStartDateForCalendar(selectedDate: Date){
    // for the day we selected let's get the previous month last day
    this.lastDayOfPreviousMonth = new Date(selectedDate.setDate(0));
    
    // start by setting the starting date of the calendar same as the last day of previous month
    let startingDateOfCalendar: Date = this.lastDayOfPreviousMonth;

    // but since we actually want to find the last Monday of previous month
    // we will start going back in days intil we encounter our last Monday of previous month
    if (startingDateOfCalendar.getDay() != 1) {
      do {
        startingDateOfCalendar = new Date(startingDateOfCalendar.setDate(startingDateOfCalendar.getDate() - 1));
      } while (startingDateOfCalendar.getDay() != 1);
    }

    return startingDateOfCalendar;
  }

   public increaseMonth() {
    this.monthIndex++;
    this.generateCalendarDays(this.monthIndex);
  }

  public decreaseMonth() {
    this.monthIndex--
    this.generateCalendarDays(this.monthIndex);
  }

  public setCurrentMonth() {
    this.monthIndex = 0;
    this.generateCalendarDays(this.monthIndex);
  }


  showEventWindow(event:any,c:any,j:any,i:any){
    if(this.isShowEventWindow == false){
      this.isShowEventWindow = !this.isShowEventWindow;
    } 
    this.topPosition = (event.screenY-100) + 'px';
    this.leftPosition = event.screenX + 'px';
    this.showingDay = c;

    this.datePick = new FormControl(new Date(c.date))
    if(c.events){
      this.eventModalForm.patchValue({
        eventTitle: c.events.eventTitle,
        eventNames: c.events.eventNames,
        eventDescription: c.events.eventDescription,
      });
      this.datePick = new FormControl(new Date(c.events.eventDate))
    } else {
      this.eventModalForm.reset();
    }
    
    
  }

  closeEventWindow(){
    this.isShowEventWindow = false;
    this.eventModalForm.reset();
  }

  submitEventForm(){

    const { eventTitle, eventDate, eventNames, eventDescription } =
      this.eventModalForm.value;
      const event = {
        eventTitle,
        eventDate:this.datePick.value,
        eventNames,
        eventDescription
      }
      let index = this.calendar.indexOf(this.showingDay);
      this.calendar[index].events = event;
      //console.log( this.calendar[index])
      this.showingDay.events = event; 
      this.fieldDays.push(this.showingDay);
    
      localStorage.setItem('daysWithEvents', JSON.stringify(this.fieldDays));
      this.closeEventWindow();
  }

  deleteEvent(){
    if(this.showingDay.events){
     let index = this.calendar.indexOf(this.showingDay);
     delete this.calendar[index]['events'];
     this.closeEventWindow();
     let index2 = this.fieldDays.indexOf(this.showingDay);
     console.log(index2)
     this.fieldDays.splice(index2,1);
     console.log(this.fieldDays)
     localStorage.setItem('daysWithEvents', JSON.stringify(this.fieldDays));
     if(this.fieldDays.length==0){
      localStorage.removeItem('daysWithEvents');
     }
    }
    
  }
}
