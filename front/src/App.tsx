import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { ThemeProvider } from 'next-themes';
import '@rainbow-me/rainbowkit/styles.css';
import { config } from './config/wagmi';
import './config/i18n';

// Pages
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Rent from "./pages/Rent";
import MyRentals from "./pages/MyRentals";
import NotFound from "./pages/NotFound";

// Layout
import { Layout } from "./components/layout/Layout";

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider
        theme={{
          lightMode: lightTheme({
            accentColor: '#8B5CF6',
            accentColorForeground: 'white',
            borderRadius: 'medium',
          }),
          darkMode: darkTheme({
            accentColor: '#8B5CF6',
            accentColorForeground: 'white',
            borderRadius: 'medium',
          }),
        }}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/rent" element={<Rent />} />
                  <Route path="/my-rentals" element={<MyRentals />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
