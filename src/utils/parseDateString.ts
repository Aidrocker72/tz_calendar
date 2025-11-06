export const parseDateString = (dateString?: string): Date => {
  if(!dateString) return new Date();

  const [year, month, day] = dateString.split('-').map(Number);

  if(Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return new Date();

  return new Date(year, month - 1, day);
};