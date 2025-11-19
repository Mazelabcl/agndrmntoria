import { useEffect, useState } from "react";

interface ScaleWrapperProps {
  children: React.ReactNode;
}

const BASE_WIDTH = 1080;
const BASE_HEIGHT = 1920;

export function ScaleWrapper({ children }: ScaleWrapperProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      const scaleX = window.innerWidth / BASE_WIDTH;
      const scaleY = window.innerHeight / BASE_HEIGHT;
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${BASE_WIDTH}px`,
          height: `${BASE_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
}
