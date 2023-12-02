import { Component } from "react"; 
import css from './Schedule.module.css'

export class Schedule extends Component{
    
    getMonday = (d) => {
        var today = d ? new Date(d): new Date();
        var day = today.getDay() || 7; // Get current day number, converting Sun. to 7
        if (day !== 1) 
          today.setHours(-24 * (day - 1));
        return today;
      }
    getNextMonday = (d) => {
        var today = d ? new Date(d) : new Date();
        var day = today.getDay() || 7; // Get current day number, converting Sun. to 7
        today.setHours(24 * (8-day));
        return today;
    } 

    getFormattedDate = (d) => {
        return this.dayOfTheWeek(d) + ", " + d.getDate();
    }

    getSchoolDay = (d, currentUser=null) => {
        if ([0,6].includes(d.getDay()))
            return null;
        if (!currentUser)
            currentUser = this.findSelectedUser();
        const daysDiff = this.dateDiffInDays(new Date(currentUser.day_one), d);
        return daysDiff >= 0 ? daysDiff % 6 + 1 : 6 - Math.abs(daysDiff) % 6 + 1;
    }

    getFormattedSchoolDate = (d) => {
        const schoolDayIndex = this.getSchoolDay(d);
        return schoolDayIndex? "Day " + schoolDayIndex: null;
    }
    getPeriodForDate = (dt, index) => {
        if (dt.getDay() == 6 || dt.getDay() == 0)
            return null;
        const currentUser = this.findSelectedUser();
        const schoolDayIndex = this.getSchoolDay(dt, currentUser);
        const keyName = 'day' + schoolDayIndex;        
        const todaySchedule = currentUser.schedule[keyName];
        return todaySchedule[index];
    }

    dayOfTheWeek = (d) => {
        switch (d.getDay()){
            case 0:
                return 'Sun'
            case 1:
                return 'Mon'
            case 2:
                return 'Tue'
            case 3:
                return 'Wed'
            case 4:
                return 'Thu'
            case 5:
                return 'Fri'
            case 6:
                return 'Sat'
            default:
                return null;
        }
    }
     
    findSelectedUser(){
        if (!this.props.selectedUser )
            return null;
        var foundUser = null;
        this.props.users.forEach(user => {
            if (user.id == this.props.selectedUser){
                foundUser = user;
                return
            }
        })
        return foundUser;
    }

    getDatesList = () => {
        var days = [];
        var currentDate = new Date(this.state.startDate.getTime());
        do {
            const cloneDate =  new Date(currentDate.getTime() );
            days.push(cloneDate);
            currentDate.setDate(currentDate.getDate() + 1);
        } while (currentDate <= this.state.endDate);
        return days;
    }

    getFormattedPeriod = () =>{
        const s = this.state.startDate;
        const e = this.state.endDate
        const startMonth = s.toLocaleString('default', { month: 'short' });
        const endMonth = e.toLocaleString('default', { month: 'short' });
        return `${s.getDate()} ${startMonth} - ${e.getDate()} ${endMonth}`
    }
    
    dateDiffInDays = (a, b) => {
        a.setHours(0,0,0,0); 
        b.setHours(0,0,0,0); 
        console.log("Input:", a, b, a>b, a<b, a==b, a===b)
        
        if (a.toString() == b.toString()){
            return 0;
        }
        const isPast = a>b;

        const increment = isPast ? -1 : 1;
        let count = 0;
        let currentDate = new Date(a);
        do {
            currentDate.setDate(currentDate.getDate() + increment);
            if (![6, 0].includes(currentDate.getDay()))
                count += increment;
        } while ((isPast && currentDate > b) || (!isPast && currentDate < b) || (count > 10))
        return count;
      }

    state = {
        startDate: this.getMonday(),
        endDate: this.getNextMonday(),
        periodsCount: 9 // Can be dynamic
    }

    render () {
        const selectedUser = this.findSelectedUser();
        return <div className={css.calendar}>
        <header>
            <div className={[css.secondary, css.secondary_header].join(" ")} >Class {selectedUser.class}</div>
            <div className={css.calendar_title}>
              <div className={[css.icon, css.secondary, css.chevron_left].join(" ")}>‹</div>
              <h1><strong>{this.getFormattedPeriod()}</strong></h1>
              <div className={[css.icon, css.secondary, css.chevron_left].join(" ")}>›</div>
            </div> 
            <div className={css.secondary_header}></div>
        </header>
        
        <div className={css.outer}>
      
        
        <table>
        <thead>
          <tr>
            <th className={css.headcol}></th>
            {this.getDatesList().map(dt =>(
                <th key={this.getFormattedDate(dt)} className={
                    [this.getFormattedDate(dt) == this.getFormattedDate(new Date())? css.today : "",
                    (dt.getDay() == 0 || dt.getDay() == 6) ? css.secondary : ""].join(" ")}>
                    {this.getFormattedDate(dt)}
                </th>
            ))}
          </tr>
          <tr>
            <th className={css.headcol}></th>
            {this.getDatesList().map(dt =>(
                <th key={this.getFormattedDate(dt) + "_day"} className={
                    [this.getFormattedDate(dt) == this.getFormattedDate(new Date())? css.today : "",
                    (dt.getDay() == 0 || dt.getDay() == 6) ? css.secondary : ""].join(" ")}>
                    {this.getFormattedSchoolDate(dt)}
                </th>
            ))}
          </tr>
        </thead>
        </table>
      
      <div className={css.wrap}> 
        <table className={css.offset}>
        <tbody>
          {Array.from(Array(this.state.periodsCount), (_, i)=>{
            return (
                <tr key={`row_${i}`}>
                    <td className={css.headcol}>{i>0 ? i: "HR" }</td>
                    {this.getDatesList().map(dt =>(
                        <td key={`${i}${dt.toString()}`} className={[
                            [0,6].includes(dt.getDay())? css.past: null,
                            css.event, css.chevron_left
                            ].join(' ')}>
                                <ScheduleCellComponent 
                                    period={this.getPeriodForDate(dt, i)} />   
                        </td>
                    ))}
              </tr>)
          })}
        </tbody>
      </table>
      </div>
      </div>
      </div>
      
    }
}

const ScheduleCellComponent = (props) => {
    if (!props.period)
        return null
    const subj = props.period['subject'] ? props.period['subject'].split(' ')[0].toLowerCase() : null;
    return (
    <ul className={[css.cell, css[subj]].join(" ")}>
        <li>{props.period['subject']}</li>
        <li>{props.period['teacher']}</li>
        <li>{props.period['class']}</li>
    </ul>)
}