import { Button } from "@/components/ui/button";
import { useState } from "react";

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onClose: () => void;
  mode: "text" | "numeric" | "email";
}

export function VirtualKeyboard({ onKeyPress, onBackspace, onClear, onClose, mode }: VirtualKeyboardProps) {
  const [isUpperCase, setIsUpperCase] = useState(true);

  const keysLayout = {
    text: [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
      ["Z", "X", "C", "V", "B", "N", "M", "-", " "],
    ],
    numeric: [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
      ["0", "-", "k"],
    ],
    email: [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
      ["Z", "X", "C", "V", "B", "N", "M", "@", "."],
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ],
  };

  const keys = keysLayout[mode];

  const handleKeyPressWithCase = (key: string) => {
    if (mode === "numeric" || key === " " || key === "-" || key === "@" || key === ".") {
      onKeyPress(key);
    } else {
      onKeyPress(isUpperCase ? key.toUpperCase() : key.toLowerCase());
    }
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[hsl(var(--bci-blue))] shadow-2xl z-50 overflow-y-auto"
      style={{ 
        padding: "clamp(6px, calc(8 / 1920 * 100vh), 10px)",
        maxHeight: "35vh",
      }}
      data-testid="virtual-keyboard"
    >
      <div className="w-full px-1">
        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <h3 
            className="font-bold text-[hsl(var(--bci-blue))]"
            style={{ fontSize: "clamp(12px, calc(14 / 1920 * 100vh), 16px)" }}
          >
            Teclado
          </h3>
          <Button
            onClick={onClose}
            variant="ghost"
            className="hover-elevate"
            style={{
              minWidth: "clamp(60px, calc(70 / 1080 * 100vw), 80px)",
              minHeight: "clamp(40px, calc(44 / 1920 * 100vh), 48px)",
              fontSize: "clamp(11px, calc(12 / 1920 * 100vh), 14px)",
              padding: "0.25rem 0.5rem",
            }}
            data-testid="button-keyboard-close"
          >
            ✕ Cerrar
          </Button>
        </div>

        {/* Keys */}
        <div className="flex flex-col gap-1">
          {keys.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1">
              {row.map((key) => {
                const displayKey = (mode !== "numeric" && key !== " " && key !== "-" && key !== "@" && key !== ".") 
                  ? (isUpperCase ? key.toUpperCase() : key.toLowerCase())
                  : key;
                
                return (
                  <Button
                    key={key}
                    onClick={() => handleKeyPressWithCase(key)}
                    variant="outline"
                    className="hover-elevate active-elevate-2 font-semibold"
                    style={{
                      width: key === " " ? "clamp(130px, calc(160 / 1080 * 100vw), 180px)" : "clamp(48px, calc(65 / 1080 * 100vw), 78px)",
                      height: "clamp(48px, calc(50 / 1920 * 100vh), 54px)",
                      fontSize: "clamp(13px, calc(15 / 1920 * 100vh), 17px)",
                      padding: "0.25rem",
                    }}
                    data-testid={`key-${key === " " ? "space" : key.toLowerCase()}`}
                  >
                    {key === " " ? "Espacio" : displayKey}
                  </Button>
                );
              })}
            </div>
          ))}

          {/* Action buttons */}
          <div className="flex justify-center gap-1 mt-1">
            {(mode === "text" || mode === "email") && (
              <Button
                onClick={() => setIsUpperCase(!isUpperCase)}
                variant="outline"
                className="hover-elevate active-elevate-2 font-semibold"
                style={{
                  width: "clamp(65px, calc(90 / 1080 * 100vw), 110px)",
                  height: "clamp(48px, calc(50 / 1920 * 100vh), 54px)",
                  fontSize: "clamp(11px, calc(13 / 1920 * 100vh), 15px)",
                  padding: "0.25rem",
                }}
                data-testid="button-keyboard-case-toggle"
              >
                {isUpperCase ? "↓ abc" : "↑ ABC"}
              </Button>
            )}
            <Button
              onClick={onBackspace}
              variant="destructive"
              className="hover-elevate active-elevate-2 font-semibold"
              style={{
                width: "clamp(65px, calc(90 / 1080 * 100vw), 110px)",
                height: "clamp(48px, calc(50 / 1920 * 100vh), 54px)",
                fontSize: "clamp(11px, calc(13 / 1920 * 100vh), 15px)",
                padding: "0.25rem",
              }}
              data-testid="button-keyboard-backspace"
            >
              ← Borrar
            </Button>
            <Button
              onClick={onClear}
              variant="outline"
              className="hover-elevate active-elevate-2 font-semibold"
              style={{
                width: "clamp(65px, calc(90 / 1080 * 100vw), 110px)",
                height: "clamp(48px, calc(50 / 1920 * 100vh), 54px)",
                fontSize: "clamp(11px, calc(13 / 1920 * 100vh), 15px)",
                padding: "0.25rem",
              }}
              data-testid="button-keyboard-clear"
            >
              Limpiar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
