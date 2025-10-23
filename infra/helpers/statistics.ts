export interface TimePeriod {
  start: Date;
  end: Date;
  title: string;
}

export const isWithinPeriod = (date: Date, period: TimePeriod): boolean =>
  date >= period.start && date <= period.end;

export const getTimePeriods = () => {
  const array: TimePeriod[] = [];
  array.push(getThisWeek());
  array.push(getLastWeek());
  array.push(getThisMonth());
  array.push(getLastMonth());
  array.push(getThisYear());
  return array;
};

const getThisYear = (): TimePeriod => {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 1);
  const end = new Date(today.getFullYear() + 1, 0, 1);

  return {
    start: start,
    end: end,
    title: 'Detta året',
  };
};

const getThisMonth = (): TimePeriod => {
  const today = new Date();
  const n = today.getMonth();

  const start = new Date(today.getFullYear(), n, 1);
  const end = new Date(today.getFullYear(), n + 1, 1);
  return {
    start: start,
    end: end,
    title: 'Denna Månaden',
  };
};

const getLastMonth = (): TimePeriod => {
  const today = new Date();
  const n = today.getMonth();

  const start = new Date(today.getFullYear(), n - 1, 1);
  const end = new Date(today.getFullYear(), n, 1);
  return {
    start: start,
    end: end,
    title: 'Förra Månaden',
  };
};

const getThisWeek = (): TimePeriod => {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  weekEnd.setHours(0, 0, 0, 0);

  return {
    start: weekStart,
    end: weekEnd,
    title: 'Denna Veckan',
  };
};

const getLastWeek = (): TimePeriod => {
  const period = getThisWeek();
  period.start.setDate(period.start.getDate() - 7);
  period.end.setDate(period.end.getDate() - 7);
  period.title = 'Förra Veckan';
  return period;
};

export const getToday = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59);
  return {
    start: start,
    end: end,
    title: 'Idag',
  }
}
