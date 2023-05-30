import { useState, useCallback } from "react";
const useToggle = () => {
  const [value, setValue] = useState(false);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle];
};

export default useToggle;
