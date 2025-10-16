export interface TimePeriod {
  start: Date;
  end: Date;
  title: string;
}

const monthNames: string[] = [
  'januari',
  'februari',
  'mars',
  'april',
  'maj',
  'juni',
  'juli',
  'augusti',
  'september',
  'oktober',
  'november',
  'december',
];

export const getTimePeriods = () => {
  const array: TimePeriod[] = [];
  array.push(getThisYear());
  getAllPreviousMonths().forEach(m => array.push(m));
  array.push(getThisWeek());
  array.push(getToday());
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

const getAllPreviousMonths = () => {
  const array: TimePeriod[] = [];
  const today = new Date();
  const n = today.getMonth();

  for (let i = 0; i <= n; i++) {
    const start = new Date(today.getFullYear(), i, 1);
    const end = new Date(today.getFullYear(), i + 1, 1);
    const name = monthNames[start.getMonth()];
    array.push({
      start: start,
      end: end,
      title: name[0].toUpperCase() + name.substring(1),
    });
  }
  return array;
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

const getToday = (): TimePeriod => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return {
    start: today,
    end: tomorrow,
    title: 'Idag',
  };
};
