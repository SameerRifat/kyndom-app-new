import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const SliderArrow = (props: {
  type?: string;
  className?: string;
  isNotModal?: boolean;
  style?: object;
  onClick?: () => void;
}) => {
  const { type, onClick, isNotModal=false } = props;
  const isNext = type === "next";
  return (
    <div
      onClick={onClick}
      className={`absolute ${isNext ? "right-0" : "left-0"} ${isNotModal ? 'top-[50%] ' : 'top-[39%]'} z-10 -translate-y-1/2 transform cursor-pointer`}
    >
      {isNext ? <ChevronRight size={40} color="#fff"/> : <ChevronLeft size={40} color="#fff"/>}
    </div>
  );
};

export default SliderArrow;
