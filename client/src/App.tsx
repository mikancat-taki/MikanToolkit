import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SqlFormatter from "@/pages/sql-formatter";
import CodeFormatter from "@/pages/code-formatter";
import ColorPicker from "@/pages/color-picker";
import ScreenCapture from "@/pages/screen-capture";
import TemperatureConverter from "@/pages/temperature-converter";
import Calculator from "@/pages/calculator";
import FileCompare from "@/pages/file-compare";
import PhotoMetadata from "@/pages/photo-metadata";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sql-formatter" component={SqlFormatter} />
      <Route path="/code-formatter" component={CodeFormatter} />
      <Route path="/color-picker" component={ColorPicker} />
      <Route path="/screen-capture" component={ScreenCapture} />
      <Route path="/temperature-converter" component={TemperatureConverter} />
      <Route path="/calculator" component={Calculator} />
      <Route path="/file-compare" component={FileCompare} />
      <Route path="/photo-metadata" component={PhotoMetadata} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="flex h-screen bg-mikan-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto p-4 md:p-6">
              <Router />
            </main>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
