export function startOfDay(date = new Date()) {
    const value = new Date(date);
  
    value.setHours(0, 0, 0, 0);
  
    return value;
  }
  
  export function endOfDay(date = new Date()) {
    const value = new Date(date);
  
    value.setHours(23, 59, 59, 999);
  
    return value;
  }
  
  export function isToday(date: Date) {
    return (
      date >= startOfDay() &&
      date <= endOfDay()
    );
  }
  
  export function isOverdue(date: Date) {
    return date.getTime() < Date.now();
  }
  
  export function isUpcoming(date: Date) {
    return date.getTime() > endOfDay().getTime();
  }
  
  export function minutesBetween(
    start: Date,
    end: Date,
  ) {
    return Math.round(
      (end.getTime() - start.getTime()) /
        (1000 * 60),
    );
  }
  
  export function hoursBetween(
    start: Date,
    end: Date,
  ) {
    return Number(
      (
        (end.getTime() - start.getTime()) /
        (1000 * 60 * 60)
      ).toFixed(2),
    );
  }