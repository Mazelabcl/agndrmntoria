import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import imagenConfirmacion from "@assets/06-CASO-1-final_1763536888452.png";
import qrServiciosFinancieros from "@assets/1-Mentoria Servicios Financieros_1763352789871.png";
import qrMarketingVentas from "@assets/2-Mentoria Marketing y Ventas_1763352789872.png";
import qrGestionProductividad from "@assets/3-Mentoria Gestion y Productividad_1763352789872.png";
import qrInnovacionTalento from "@assets/4-Mentoria Innovacion y Talento_1763352789872.png";
import { apiRequest } from "@/lib/queryClient";
import type { InsertRegistration, Registration } from "@shared/schema";
import { Button } from "@/components/ui/button";

const QR_CODES: Record<string, string> = {
  "servicios financieros": qrServiciosFinancieros,
  "marketing y ventas": qrMarketingVentas,
  "gestión y productividad": qrGestionProductividad,
  "innovación y talento": qrInnovacionTalento,
};

function getQRCodeForCategory(categoria: string): string {
  if (!categoria) return qrServiciosFinancieros;
  const normalizedKey = categoria.trim().toLowerCase();
  return QR_CODES[normalizedKey] || qrServiciosFinancieros;
}

export default function Confirmacion() {
  const [, setLocation] = useLocation();
  const [categoria, setCategoria] = useState("");
  const [registrationPayload, setRegistrationPayload] = useState<InsertRegistration | null>(null);
  const [dataValidationError, setDataValidationError] = useState(false);
  const hasMutated = useRef(false);

  const createRegistrationMutation = useMutation({
    mutationFn: async (data: InsertRegistration) => {
      const res = await apiRequest("POST", "/api/registrations", data);
      return await res.json() as Registration;
    },
  });

  useEffect(() => {
    if (hasMutated.current) return;

    const registrationData = localStorage.getItem("registrationData");
    
    if (!registrationData) {
      setDataValidationError(true);
      return;
    }

    try {
      const parsedData = JSON.parse(registrationData);
      const validNiveles = ["0 - 2.400 UF", "2.400 - 5.000 UF", "5.000 - 25.000 UF", "25.000 - 100.000 UF"];
      
      if (!parsedData.nombre || !parsedData.email || !parsedData.rut || !parsedData.telefono ||
          !parsedData.nivelVentas || !validNiveles.includes(parsedData.nivelVentas) ||
          !parsedData.servicioMentorias || !parsedData.servicioJugarActivacion) {
        setDataValidationError(true);
        return;
      }

      setCategoria(parsedData.categoriaMentoria || "");

      const payload: InsertRegistration = {
        nombre: parsedData.nombre,
        rut: parsedData.rut,
        rutEmpresa: parsedData.rutEmpresa || undefined,
        telefono: parsedData.telefono,
        email: parsedData.email,
        nivelVentas: parsedData.nivelVentas,
        servicioMentorias: parsedData.servicioMentorias,
        servicioJugarActivacion: parsedData.servicioJugarActivacion,
        categoriaMentoria: parsedData.categoriaMentoria || undefined,
      };
      
      setRegistrationPayload(payload);
      hasMutated.current = true;
      createRegistrationMutation.mutate(payload);
    } catch (error) {
      console.error("Error parsing registration data:", error);
      setDataValidationError(true);
    }
  }, []);

  const handleContactStaff = () => {
    console.log("Datos de registro para atención de personal:", registrationPayload);
  };

  const handleReturnToStart = () => {
    localStorage.removeItem("registrationData");
    setLocation("/");
  };

  if (dataValidationError) {
    return (
      <div className="relative h-screen w-screen overflow-hidden bg-yellow-50" data-testid="screen-data-error">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8" style={{ padding: "clamp(1rem, 5vw, 3rem)" }}>
          
          <div className="bg-white rounded-2xl shadow-2xl" style={{ padding: "clamp(1rem, 3vw, 2rem)" }}>
            <img
              src={qrServiciosFinancieros}
              alt="QR Code por defecto"
              style={{ 
                width: "clamp(200px, 35vw, 320px)", 
                height: "clamp(200px, 35vw, 320px)",
                opacity: 0.3
              }}
              data-testid="qr-code-default"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl text-center" style={{ padding: "clamp(2rem, 5vw, 3rem)" }}>
            <div className="text-yellow-600 mb-6">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }} className="font-bold text-gray-900 mb-4" data-testid="text-data-error-title">
              Datos incompletos
            </h2>
            
            <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }} className="text-gray-700 mb-8" data-testid="text-data-error-message">
              No se detectaron todos los datos necesarios para completar el registro. Por favor, comienza nuevamente desde el inicio.
            </p>
            
            <Button
              onClick={handleReturnToStart}
              style={{ height: "clamp(3.5rem, 6vh, 4.5rem)", paddingLeft: "clamp(2rem, 8vw, 3rem)", paddingRight: "clamp(2rem, 8vw, 3rem)", fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)" }}
              className="bg-[hsl(var(--bci-blue))] hover:bg-[hsl(var(--bci-blue))] text-white font-semibold rounded-xl active-elevate-2"
              data-testid="button-return-start"
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (createRegistrationMutation.isError) {
    return (
      <div className="relative h-screen w-screen overflow-hidden bg-red-50" data-testid="screen-error">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8" style={{ padding: "clamp(1rem, 5vw, 3rem)" }}>
          
          <div className="bg-white rounded-2xl shadow-2xl" style={{ padding: "clamp(1rem, 3vw, 2rem)" }}>
            <img
              src={qrServiciosFinancieros}
              alt="QR Code por defecto"
              style={{ 
                width: "clamp(200px, 35vw, 320px)", 
                height: "clamp(200px, 35vw, 320px)",
                opacity: 0.3
              }}
              data-testid="qr-code-default-error"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl text-center" style={{ padding: "clamp(2rem, 5vw, 3rem)" }}>
            <div className="text-red-600 mb-6">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }} className="font-bold text-gray-900 mb-4" data-testid="text-error-title">
              Error al guardar el registro
            </h2>
            
            <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }} className="text-gray-700 mb-8" data-testid="text-error-message">
              No se pudo completar el registro en este momento. Por favor, solicita ayuda al personal de apoyo.
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={handleContactStaff}
                style={{ height: "clamp(3.5rem, 6vh, 4.5rem)", paddingLeft: "clamp(2rem, 8vw, 3rem)", paddingRight: "clamp(2rem, 8vw, 3rem)", fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)" }}
                className="bg-[hsl(var(--bci-blue))] hover:bg-[hsl(var(--bci-blue))] text-white font-semibold rounded-xl active-elevate-2"
                data-testid="button-contact-staff"
              >
                Contactar Personal
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 mt-6" data-testid="text-data-preserved">
              Tus datos están disponibles en la consola para que el personal te ayude a completar el registro.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden" data-testid="screen-confirmacion">
      <img
        src={imagenConfirmacion}
        alt="Confirmación"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Texto "Seleccionaste" */}
        <h1 
          style={{ fontSize: "clamp(1.75rem, calc(36 / 1920 * 100vh), 2.5rem)" }} 
          className="font-bold text-[hsl(var(--bci-blue))] mb-2"
          data-testid="text-seleccionaste"
        >
          Seleccionaste
        </h1>

        {/* Texto dinámico de categoría */}
        {categoria && (
          <h2 
            style={{ 
              fontSize: "clamp(1.5rem, calc(32 / 1920 * 100vh), 2.25rem)",
              marginBottom: "calc(30 / 1920 * 100vh)"
            }} 
            className="font-bold text-[hsl(var(--bci-orange))]" 
            data-testid="text-categoria-seleccionada"
          >
            {categoria}
          </h2>
        )}

        {/* QR Container - Responsive sizing */}
        <div 
          className="bg-white rounded-2xl shadow-2xl relative" 
          style={{ 
            padding: "clamp(1rem, calc(24 / 1920 * 100vh), 1.5rem)",
            marginBottom: "calc(24 / 1920 * 100vh)"
          }} 
          data-testid="qr-container"
        >
          <img
            src={getQRCodeForCategory(categoria)}
            alt={`QR Code para ${categoria || 'mentoría'}`}
            style={{ 
              width: "clamp(220px, calc(320 / 1080 * 100vw), 350px)", 
              height: "clamp(220px, calc(320 / 1080 * 100vw), 350px)" 
            }}
            data-testid="qr-code"
          />
          {createRegistrationMutation.isPending && (
            <div 
              className="absolute inset-0 bg-white/30 backdrop-blur-[1px] flex flex-col items-center justify-center gap-4 rounded-2xl"
              data-testid="qr-loading-overlay"
            >
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 bg-white rounded-full"></div>
              <p style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }} className="text-gray-900 font-extrabold drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)]">Guardando...</p>
            </div>
          )}
        </div>

        {/* Instrucciones y botón */}
        <div className="text-center">
          <p 
            style={{ fontSize: "clamp(1rem, calc(20 / 1920 * 100vh), 1.375rem)" }} 
            className="text-gray-700 font-medium mb-1" 
            data-testid="text-instruccion-qr"
          >
            Escanea el código QR y agenda con tu celular
          </p>
          
          {createRegistrationMutation.isSuccess && (
            <Button
              onClick={handleReturnToStart}
              style={{ 
                height: "clamp(56px, calc(68 / 1920 * 100vh), 78px)", 
                paddingLeft: "clamp(48px, calc(80 / 1080 * 100vw), 100px)", 
                paddingRight: "clamp(48px, calc(80 / 1080 * 100vw), 100px)", 
                fontSize: "clamp(1rem, calc(18 / 1920 * 100vh), 1.25rem)",
                marginTop: "calc(28 / 1920 * 100vh)"
              }}
              className="bg-[hsl(var(--bci-blue))] hover:bg-[hsl(var(--bci-blue))] text-white font-semibold rounded-xl active-elevate-2"
              data-testid="button-volver-inicio"
            >
              Volver al Inicio
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
