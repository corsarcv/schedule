export class DateUtils {
    constructor(holidays) {
        this.holidays = holidays;
      }

    getCurrentMonday (d) {
        var today = d ? new Date(d): new Date();
        var day = today.getDay() || 7; // Get current day number, converting Sun. to 7
        if (day !== 1) 
          today.setHours(-24 * (day - 1));
        return today;
      }
    getNextMonday = (d) => {
        var today = d ? new Date(d) : new Date();
        var day = today.getDay() || 7; // Get current day number, converting Sun. to 7
        today.setHours(24 * (8 - day));
        return today;
    } 

    getFormattedDate = (d) => {
        return d.toLocaleString('default', { weekday: 'short' }) + ", " + d.getDate();
    }

    getSchoolDay = (d, dayOne) => {
        if ([0,6].includes(d.getDay()) || this.isHoliday(d))
            return null;
        const daysDiff = this.dateDiffInDays(new Date(dayOne), d);
        return daysDiff >= 0 ? daysDiff % 6 + 1 : 6 - Math.abs(daysDiff) % 6 + 1;
    }

    getFormattedSchoolDate = (d, dayOne) => {
        const schoolDayIndex = this.getSchoolDay(d, dayOne);
        return schoolDayIndex? "Day " + schoolDayIndex: null;
    }
    getPeriodForDate = (dt, index, currentUser) => {
        if (this.isWeekendOrHoliday(dt))
            return null;
        const schoolDayIndex = this.getSchoolDay(dt, currentUser.dayOne);
        const keyName = 'day' + schoolDayIndex;        
        const todaySchedule = currentUser.schedule[keyName];
        return todaySchedule[index];
    }

    getDatesList = (startDate, endDate) => {
        var days = [];
        var currentDate = new Date(startDate.getTime());
        do {
            const cloneDate =  new Date(currentDate.getTime() );
            days.push(cloneDate);
            currentDate.setDate(currentDate.getDate() + 1);
        } while (currentDate <= endDate);
        return days;
    }

    getFormattedPeriod = (startDate, endDate) =>{
        const startMonth = startDate.toLocaleString('default', { month: 'short' });
        const endMonth = endDate.toLocaleString('default', { month: 'short' });
        return `${startDate.getDate()} ${startMonth} - ${endDate.getDate()} ${endMonth}`
    }
    
    isHoliday = (d) => {
        return this.holidays.includes(d.toLocaleDateString());
    }

    isWeekend = (d) => {
        return [0, 6].includes(d.getDay())
    }

    isWeekendOrHoliday = (d) => {
        return this.isWeekend(d) || this.isHoliday(d);
    }

    dateDiffInDays = (a, b) => {
        a.setHours(0,0,0,0); 
        b.setHours(0,0,0,0); 
        const isPast = a > b;
        const increment = isPast ? -1 : 1;
        let count = 0;
        let currentDate = new Date(a);
        while ((isPast && currentDate > b) || (!isPast && currentDate < b) || (count > 10)) {
            currentDate.setDate(currentDate.getDate() + increment);
            if (!this.isWeekendOrHoliday(currentDate))
                count += increment;
        } 
        return count;
      } 
}