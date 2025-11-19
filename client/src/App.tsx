import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Inicio from "@/pages/inicio";
import Bienvenida from "@/pages/bienvenida";
import Registro from "@/pages/registro";
import SeleccionServicio from "@/pages/seleccion-servicio";
import SeleccionCategoria from "@/pages/seleccion-categoria";
import Confirmacion from "@/pages/confirmacion";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Inicio} />
      <Route path="/bienvenida" component={Bienvenida} />
      <Route path="/registro" component={Registro} />
      <Route path="/seleccion-servicio" component={SeleccionServicio} />
      <Route path="/seleccion-categoria" component={SeleccionCategoria} />
      <Route path="/confirmacion" component={Confirmacion} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
