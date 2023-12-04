import { Component } from "react"; 
import css from './Schedule.module.css'
import { DateUtils } from "date-utils";

export class Schedule extends Component{
    
    dateUtils = new DateUtils(this.props.holidays);

    state = {
        startDate: this.dateUtils.getCurrentMonday(),
        endDate: this.dateUtils.getNextMonday(),
        periodsCount: 9
    }
     
    findSelectedUser(){
        if (!this.props.selectedUser )
            return null;
        var foundUser = null;
        this.props.users.forEach(user => {
            if (user.id === this.props.selectedUser){
                foundUser = user;
                return
            }
        })
        return foundUser;
    }

    onPrev = () => {
        this.setState({
            endDate: new Date(this.state.startDate),
            startDate: this.dateUtils.getPrevMonday(this.state.startDate)
        });
    }

    onNext = () => {
        this.setState({
            startDate: new Date(this.state.endDate), 
            endDate: this.dateUtils.getNextMonday(this.state.endDate)
        });
    }
    render () {
        const selectedUser = this.findSelectedUser();
        return <div className={css.calendar}>
        <header>
            <div className={[css.secondary, css.secondary_header].join(" ")} >Class {selectedUser.class}</div>
            <div className={css.calendar_title}>
              <div className={
                [
                    css.icon, css.secondary, css.chevron_left, 
                    this.state.startDate.toDateString() === this.dateUtils.getCurrentMonday().toDateString() ? css.disabled : ""
                ].join(" ")} 
                onClick={this.onPrev}>‹</div>
              <h1 class={css.daterange}><strong>
                {this.dateUtils.getFormattedPeriod(this.state.startDate, this.state.endDate)}
              </strong></h1>
              <div className={[css.icon, css.secondary, css.chevron_left].join(" ")} onClick={this.onNext}>›</div>
            </div> 
            <div className={css.secondary_header}></div>
        </header>
        
        <div className={css.outer}>
      
        <table>
        <thead>
          <tr>
            <th className={css.headcol}></th>
            {this.dateUtils.getDatesList(this.state.startDate, this.state.endDate).map(dt =>(
                <th key={this.dateUtils.getFormattedDate(dt)} className={
                    [this.dateUtils.getFormattedDate(dt) === this.dateUtils.getFormattedDate(new Date())? css.today : "",
                    (this.dateUtils.isWeekendOrHoliday(dt)) ? css.secondary : ""].join(" ")}>
                    {this.dateUtils.getFormattedDate(dt)}
                </th>
            ))}
          </tr>
          <tr>
            <th className={css.headcol}></th>
            {this.dateUtils.getDatesList(this.state.startDate, this.state.endDate).map(dt =>(
                <th key={this.dateUtils.getFormattedDate(dt) + "_day"} className={
                    [this.dateUtils.getFormattedDate(dt) === this.dateUtils.getFormattedDate(new Date())? css.today : "",
                    (this.dateUtils.isWeekendOrHoliday(dt)) ? css.secondary : ""].join(" ")}>
                    {this.dateUtils.getFormattedSchoolDate(dt, selectedUser.dayOne)}
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
                    <td className={css.headcol}>
                        {i>0 
                            ? (<div><div>{i}</div><div>{this.props.bell[i]}</div></div>)
                            : (<div><div>HR</div><div>{this.props.bell["HR"]}</div></div>) }
                    </td>
                    {this.dateUtils.getDatesList(this.state.startDate, this.state.endDate).map(dt =>(
                        <td key={`${i}${dt.toString()}`} className={[
                                this.dateUtils.isWeekendOrHoliday(dt) ? css.past: null,
                                css.event, css.chevron_left
                            ].join(' ')}>
                                <ScheduleCellComponent 
                                    period={this.dateUtils.getPeriodForDate(dt, i, selectedUser)} />   
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