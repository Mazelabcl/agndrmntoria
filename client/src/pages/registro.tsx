import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { validateChileanRUT, validateChileanPhone, formatChileanRUT } from "@/lib/validators";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";

const registroFormSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  rut: z.string().refine(validateChileanRUT, {
    message: "El RUT no es válido. Formato: 12345678-9",
  }),
  rutEmpresa: z.string().optional().refine((val) => !val || validateChileanRUT(val), {
    message: "El RUT de empresa no es válido",
  }),
  telefono: z.string().refine(validateChileanPhone, {
    message: "Teléfono inválido. Debe ser +569XXXXXXXX",
  }),
  email: z.string().email("El email debe ser válido"),
  nivelVentas: z.enum([
    "0 - 2.400 UF",
    "2.400 - 5.000 UF",
    "5.000 - 25.000 UF",
    "25.000 - 100.000 UF"
  ], {
    errorMap: () => ({ message: "Debes seleccionar un nivel de ventas" })
  }),
});

type RegistroFormValues = z.infer<typeof registroFormSchema>;

export default function Registro() {
  const [, setLocation] = useLocation();
  const [noTieneRutEmpresa, setNoTieneRutEmpresa] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [keyboardMode, setKeyboardMode] = useState<"text" | "numeric" | "email">("text");
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const form = useForm<RegistroFormValues>({
    resolver: zodResolver(registroFormSchema),
    defaultValues: {
      nombre: "",
      rut: "",
      rutEmpresa: "",
      telefono: "",
      email: "",
      nivelVentas: undefined,
    },
  });

  const onSubmit = (data: RegistroFormValues) => {
    const formData = {
      ...data,
      rutEmpresa: noTieneRutEmpresa ? "" : data.rutEmpresa,
    };
    
    localStorage.setItem("registrationData", JSON.stringify(formData));
    setLocation("/seleccion-servicio");
  };

  const handleNoRutEmpresa = () => {
    setNoTieneRutEmpresa(true);
    form.setValue("rutEmpresa", "");
    form.clearErrors("rutEmpresa");
  };

  const handleTengoRutEmpresa = () => {
    setNoTieneRutEmpresa(false);
  };

  useEffect(() => {
    if (noTieneRutEmpresa && activeField === "rutEmpresa") {
      closeKeyboard();
    }
  }, [noTieneRutEmpresa, activeField]);

  const handleRutBlur = (field: any) => {
    if (field.value && validateChileanRUT(field.value)) {
      const formatted = formatChileanRUT(field.value);
      field.onChange(formatted);
    }
  };

  const handleRutEmpresaBlur = (field: any) => {
    if (field.value && validateChileanRUT(field.value)) {
      const formatted = formatChileanRUT(field.value);
      field.onChange(formatted);
    }
  };

  const handleRutPaste = (e: React.ClipboardEvent<HTMLInputElement>, fieldName: "rut" | "rutEmpresa") => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const cleanValue = pastedText.replace(/[^0-9kK]/g, '');
    if (cleanValue.length >= 2) {
      form.setValue(fieldName, formatChileanRUT(cleanValue));
    } else {
      form.setValue(fieldName, cleanValue);
    }
  };

  const handleRutInput = (e: React.FormEvent<HTMLInputElement>, fieldName: "rut" | "rutEmpresa") => {
    const value = e.currentTarget.value;
    const cleanValue = value.replace(/[^0-9kK]/g, '');
    if (cleanValue.length >= 2) {
      form.setValue(fieldName, formatChileanRUT(cleanValue));
    } else {
      form.setValue(fieldName, cleanValue);
    }
  };

  const createRefCallback = (fieldName: string, rhfRef: (instance: HTMLInputElement | null) => void) => {
    return (el: HTMLInputElement | null) => {
      rhfRef(el);
      if (el) {
        inputRefs.current[fieldName] = el;
      }
    };
  };

  const openKeyboard = (fieldName: string, mode: "text" | "numeric" | "email") => {
    setActiveField(fieldName);
    setKeyboardMode(mode);
    setKeyboardOpen(true);
    requestAnimationFrame(() => {
      const input = inputRefs.current[fieldName];
      if (input) {
        input.focus();
      }
    });
  };

  const closeKeyboard = () => {
    setKeyboardOpen(false);
    setActiveField(null);
  };

  const handleKeyPress = (key: string) => {
    if (!activeField) return;
    const currentValue = form.getValues(activeField as any) || "";
    
    if (activeField === "rut" || activeField === "rutEmpresa") {
      const cleanCurrent = currentValue.replace(/[.-]/g, '');
      const cleanValue = cleanCurrent + key;
      if (cleanValue.length >= 2) {
        form.setValue(activeField as any, formatChileanRUT(cleanValue));
      } else {
        form.setValue(activeField as any, cleanValue);
      }
    } else {
      const newValue = currentValue + key;
      form.setValue(activeField as any, newValue);
    }
  };

  const handleBackspace = () => {
    if (!activeField) return;
    const currentValue = form.getValues(activeField as any) || "";
    
    if (activeField === "rut" || activeField === "rutEmpresa") {
      const cleanValue = currentValue.replace(/[.-]/g, '');
      const newCleanValue = cleanValue.slice(0, -1);
      if (newCleanValue.length >= 2) {
        form.setValue(activeField as any, formatChileanRUT(newCleanValue));
      } else {
        form.setValue(activeField as any, newCleanValue);
      }
    } else {
      form.setValue(activeField as any, currentValue.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (!activeField) return;
    form.setValue(activeField as any, "");
  };

  return (
    <div className="relative h-screen w-screen overflow-y-auto bg-white" data-testid="screen-registro">
      <div className="max-w-2xl mx-auto py-12 px-6">
        <h1 
          className="text-center font-bold text-[hsl(var(--bci-blue))] mb-8"
          style={{ fontSize: "calc(32 / 1920 * 100vh)" }}
        >
          Registro de Información
        </h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Input Nombre */}
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ fontSize: "calc(20 / 1920 * 100vh)" }}>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      ref={createRefCallback("nombre", field.ref)}
                      placeholder="Ingresa tu nombre"
                      readOnly
                      onFocus={() => openKeyboard("nombre", "text")}
                      style={{ height: "clamp(48px, calc(56 / 1920 * 100vh), 72px)", fontSize: "clamp(16px, calc(18 / 1920 * 100vh), 24px)" }}
                      className="bg-[hsl(var(--bci-red))] border-0 text-white placeholder:text-white/70 px-4 rounded-lg font-medium cursor-pointer"
                      data-testid="input-nombre"
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />

            {/* Input RUT */}
            <FormField
              control={form.control}
              name="rut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ fontSize: "calc(20 / 1920 * 100vh)" }}>RUT</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      ref={createRefCallback("rut", field.ref)}
                      placeholder="12.345.678-9"
                      readOnly
                      onFocus={() => openKeyboard("rut", "numeric")}
                      onBlur={() => handleRutBlur(field)}
                      onPaste={(e) => handleRutPaste(e, "rut")}
                      onInput={(e) => handleRutInput(e, "rut")}
                      style={{ height: "clamp(48px, calc(56 / 1920 * 100vh), 72px)", fontSize: "clamp(16px, calc(18 / 1920 * 100vh), 24px)" }}
                      className="bg-[hsl(var(--bci-green))] border-0 text-white placeholder:text-white/70 px-4 rounded-lg font-medium cursor-pointer"
                      data-testid="input-rut"
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />

            {/* Input RUT Empresa */}
            <FormField
              control={form.control}
              name="rutEmpresa"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel style={{ fontSize: "calc(20 / 1920 * 100vh)" }}>RUT Empresa (opcional)</FormLabel>
                    {!noTieneRutEmpresa ? (
                      <button
                        type="button"
                        onClick={handleNoRutEmpresa}
                        style={{ 
                          fontSize: "clamp(14px, calc(16 / 1920 * 100vh), 20px)",
                          minHeight: "clamp(48px, calc(52 / 1920 * 100vh), 60px)",
                          paddingLeft: "clamp(16px, calc(20 / 1080 * 100vw), 24px)",
                          paddingRight: "clamp(16px, calc(20 / 1080 * 100vw), 24px)",
                          paddingTop: "clamp(12px, calc(14 / 1920 * 100vh), 16px)",
                          paddingBottom: "clamp(12px, calc(14 / 1920 * 100vh), 16px)"
                        }}
                        className="text-[hsl(var(--bci-orange))] underline hover-elevate rounded"
                        data-testid="toggle-no-rut-empresa"
                      >
                        No tengo
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleTengoRutEmpresa}
                        style={{ 
                          fontSize: "clamp(14px, calc(16 / 1920 * 100vh), 20px)",
                          minHeight: "clamp(48px, calc(52 / 1920 * 100vh), 60px)",
                          paddingLeft: "clamp(16px, calc(20 / 1080 * 100vw), 24px)",
                          paddingRight: "clamp(16px, calc(20 / 1080 * 100vw), 24px)",
                          paddingTop: "clamp(12px, calc(14 / 1920 * 100vh), 16px)",
                          paddingBottom: "clamp(12px, calc(14 / 1920 * 100vh), 16px)"
                        }}
                        className="text-[hsl(var(--bci-orange))] underline hover-elevate rounded"
                        data-testid="toggle-rut-empresa"
                      >
                        Tengo RUT
                      </button>
                    )}
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        ref={createRefCallback("rutEmpresa", field.ref)}
                        placeholder="12.345.678-9"
                        disabled={noTieneRutEmpresa}
                        readOnly={!noTieneRutEmpresa}
                        onFocus={() => !noTieneRutEmpresa && openKeyboard("rutEmpresa", "numeric")}
                        onBlur={() => handleRutEmpresaBlur(field)}
                        onPaste={(e) => handleRutPaste(e, "rutEmpresa")}
                        onInput={(e) => handleRutInput(e, "rutEmpresa")}
                        style={{ height: "clamp(48px, calc(56 / 1920 * 100vh), 72px)", fontSize: "clamp(16px, calc(18 / 1920 * 100vh), 24px)" }}
                        className="bg-[hsl(var(--bci-orange))] border-0 text-white placeholder:text-white/70 px-4 rounded-lg font-medium disabled:opacity-40 cursor-pointer"
                        data-testid="input-rut-empresa"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <div style={{ width: "clamp(32px, calc(36 / 1920 * 100vh), 44px)", height: "clamp(32px, calc(36 / 1920 * 100vh), 44px)" }} className="bg-white rounded flex items-center justify-center">
                          <Checkbox
                            checked={!noTieneRutEmpresa}
                            onCheckedChange={(checked) => {
                              if (!checked) {
                                handleNoRutEmpresa();
                              } else {
                                handleTengoRutEmpresa();
                              }
                            }}
                            style={{ 
                              width: "clamp(28px, calc(32 / 1920 * 100vh), 40px)",
                              height: "clamp(28px, calc(32 / 1920 * 100vh), 40px)",
                              minWidth: "clamp(28px, calc(32 / 1920 * 100vh), 40px)",
                              minHeight: "clamp(28px, calc(32 / 1920 * 100vh), 40px)"
                            }}
                            className="border-orange-500 data-[state=checked]:bg-orange-500"
                            data-testid="checkbox-rut-empresa"
                          />
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />

            {/* Input Teléfono */}
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ fontSize: "calc(20 / 1920 * 100vh)" }}>Teléfono</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      ref={createRefCallback("telefono", field.ref)}
                      placeholder="+569XXXXXXXX"
                      type="tel"
                      readOnly
                      onFocus={() => openKeyboard("telefono", "numeric")}
                      style={{ height: "clamp(48px, calc(56 / 1920 * 100vh), 72px)", fontSize: "clamp(16px, calc(18 / 1920 * 100vh), 24px)" }}
                      className="bg-[hsl(var(--bci-blue))] border-0 text-white placeholder:text-white/70 px-4 rounded-lg font-medium cursor-pointer"
                      data-testid="input-telefono"
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />

            {/* Input Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ fontSize: "calc(20 / 1920 * 100vh)" }}>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      ref={createRefCallback("email", field.ref)}
                      placeholder="ejemplo@correo.com"
                      type="email"
                      readOnly
                      onFocus={() => openKeyboard("email", "email")}
                      style={{ height: "clamp(48px, calc(56 / 1920 * 100vh), 72px)", fontSize: "clamp(16px, calc(18 / 1920 * 100vh), 24px)" }}
                      className="bg-[hsl(var(--bci-black))] border-0 text-white placeholder:text-white/70 px-4 rounded-lg font-medium cursor-pointer"
                      data-testid="input-email"
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />

            {/* Radio Group - Nivel de Ventas */}
            <FormField
              control={form.control}
              name="nivelVentas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ fontSize: "calc(20 / 1920 * 100vh)" }}>Nivel de Ventas (UF)</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="space-y-3"
                    >
                      {[
                        "0 - 2.400 UF",
                        "2.400 - 5.000 UF",
                        "5.000 - 25.000 UF",
                        "25.000 - 100.000 UF"
                      ].map((nivel) => (
                        <div key={nivel} className="flex items-center space-x-3" onClick={() => field.onChange(nivel)}>
                          <RadioGroupItem 
                            value={nivel} 
                            id={nivel}
                            style={{ width: "clamp(20px, calc(24 / 1920 * 100vh), 28px)", height: "clamp(20px, calc(24 / 1920 * 100vh), 28px)" }}
                            data-testid={`radio-nivel-${nivel.replace(/\s/g, '-')}`}
                          />
                          <Label 
                            htmlFor={nivel}
                            style={{ fontSize: "calc(18 / 1920 * 100vh)" }}
                            className="cursor-pointer font-medium"
                          >
                            {nivel}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />

            {/* Botón Submit */}
            <div className="pt-4">
              <Button
                type="submit"
                style={{ height: "clamp(56px, calc(72 / 1920 * 100vh), 88px)", fontSize: "clamp(18px, calc(24 / 1920 * 100vh), 30px)" }}
                className="w-full bg-[hsl(var(--bci-blue))] hover:bg-[hsl(var(--bci-blue))] text-white font-semibold rounded-xl active-elevate-2"
                data-testid="button-enviar-registro"
              >
                Enviar
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Teclado Virtual */}
      {keyboardOpen && (
        <VirtualKeyboard
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onClear={handleClear}
          onClose={closeKeyboard}
          mode={keyboardMode}
        />
      )}
    </div>
  );
}
