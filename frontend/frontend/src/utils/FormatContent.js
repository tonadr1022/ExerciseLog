export const formatPace = (pace) => {
  const minutes = Math.trunc(pace);
  const seconds = Math.round((pace % 1) * 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export const formatDuration = (duration) => {
  const [hours, minutes, seconds] = duration.split(":");
  const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
  return `${totalMinutes < 10 ? "0" : ""}${totalMinutes}:${seconds}`;
};
