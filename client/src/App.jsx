import "./App.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppRouter from "./router/index.jsx";

function App() {
  return (
    <TooltipProvider>
      <AppRouter />
    </TooltipProvider>
  );
}

export default App;
