export const formatPace = (pace) => {
  const minutes = Math.trunc(pace);
  const seconds = Math.round((pace % 1) * 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export const formatDuration = (duration) => {
  if (duration) {
    const [hours, minutes, seconds] = duration.split(":");
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    return `${totalMinutes < 10 ? "0" : ""}${totalMinutes}:${seconds}`;
  } else {
    return "00:00";
  }
};

export const unformatPace = (pace) => {
  const paceParts = pace.split(":").map((part) => Number(part));
  return Math.round((paceParts[0] + paceParts[1] / 60) * 10000) / 10000;
};
