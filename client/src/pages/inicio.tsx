import { useLocation } from "wouter";
import imagenInicio from "@assets/01-CASO-1_1763175998395.png";

export default function Inicio() {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    setLocation("/bienvenida");
  };

  return (
    <div
      className="relative h-screen w-screen overflow-hidden cursor-pointer"
      onClick={handleClick}
      data-testid="screen-inicio"
    >
      <img
        src={imagenInicio}
        alt="EtMday BCI - Bienvenida"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center opacity-0">
          <p className="text-white text-lg">Toca para iniciar</p>
        </div>
      </div>
    </div>
  );
}
