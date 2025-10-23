export const getDaysSinceCompletion = (
  lastCompletionDate?: Date,
  taskCreatedDate?: Date
): number | null => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!lastCompletionDate) {
    // If never completed, calculate days since task creation
    if (!taskCreatedDate) return null;

    const createdDate = new Date(taskCreatedDate);
    createdDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : null;
  }

  const completionDate = new Date(lastCompletionDate);
  completionDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - completionDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};
