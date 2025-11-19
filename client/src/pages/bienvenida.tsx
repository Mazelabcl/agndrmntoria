import { useLocation } from "wouter";
import imagenBienvenida from "@assets/02-CASO-1_1763175998396.png";

export default function Bienvenida() {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    setLocation("/registro");
  };

  return (
    <div
      className="relative h-screen w-screen overflow-hidden cursor-pointer"
      onClick={handleClick}
      data-testid="screen-bienvenida"
    >
      <img
        src={imagenBienvenida}
        alt="Bienvenidos a EtMday"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
