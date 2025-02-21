"use client"

import Button from "../components/Button";
import { TiLocationArrow } from "react-icons/ti";

const MyComponent = () => {
  return (
    <div>
      {/* Button with navigation */}
      <Button
        href="/auth"
        id="sign-up"
        title="Join Us"
        leftIcon={<TiLocationArrow />}
        containerClass="bg-yellow-300 flex-center gap-1"
      />

      {/* Button with click handler */}
      <Button
        id="sign-up"
        title="Join Us"
        leftIcon={<TiLocationArrow />}
        containerClass="bg-yellow-300 flex-center gap-1"
        onClick={() => console.log("Button clicked!")}
      />
    </div>
  );
};

export default MyComponent;