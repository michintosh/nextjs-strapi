import React from "react";
import HighlightedText from "./HighlightedText";

interface HeadingProps {
  data: {
    id: string;
    heading: string;
    description: string;
  };
}

const Heading = ({ data }: HeadingProps) => {
  return (
    <section className="dark:bg-black dark:text-gray-100">
      <div className="container flex flex-col justify-center p-6 mx-auto sm:py-12 lg:py-24 lg:flex-row lg:justify-between">
        <div className="flex flex-col justify-center p-6 text-center rounded-lg lg:max-w-md xl:max-w-lg lg:text-left">
          <HighlightedText
            text={data.heading}
            tag="h1"
            className="text-5xl font-bold leading-none sm:text-6xl mb-8"
            color="dark:text-violet-400"
          />

          <HighlightedText
            text={data.description}
            tag="p"
            className="tmt-6 mb-8 text-lg sm:mb-12"
            color="dark:text-violet-400"
          />
         
        </div>
        
      </div>
    </section>
  );
};

export default Heading;
