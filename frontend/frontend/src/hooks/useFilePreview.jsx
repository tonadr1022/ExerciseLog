import React, { useEffect, useState } from "react";

const useFilePreview = (file) => {
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    if (file && file[0]) {
      const url = URL.createObjectURL(file[0]);

      setImgSrc(url);
    }
  }, [file]);
  return { imgSrc: imgSrc, setImgSrc: setImgSrc };
};

export default useFilePreview;
