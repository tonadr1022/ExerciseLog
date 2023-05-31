// adapted from Chat GPT
export const getRatingColor = (value) => {
  const red = Math.floor(((10 - value) * 230) / 9);
  const green = Math.floor(((value - 1) * 200) / 9);
  return `rgb(${red}, ${green}, 0)`;
};
