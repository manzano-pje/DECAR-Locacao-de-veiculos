import { Button } from "@/components/ui/button";
import { Wallet, Check, Settings, User } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  isWalletConnected: boolean;
  userMode: 'user' | 'admin';
  onWalletConnect: () => void;
  onModeChange: (mode: 'user' | 'admin') => void;
}

export function Header({ isWalletConnected, userMode, onWalletConnect, onModeChange }: HeaderProps) {
  return (
    <header className="w-full bg-card border-b border-border shadow-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/360e21ea-5c7a-4d8b-8523-6864e3435b28.png" 
              alt="DECAR Locação de Veículos" 
              className="h-16 w-auto"
            />
          </div>

          {/* Center - Wallet Status Message */}
          <div className="flex-1 text-center">
            <p className="text-muted-foreground text-sm">
              {isWalletConnected 
                ? "Carteira conectada - Pronto para transações" 
                : "Conecte sua carteira para efetuar suas transações"
              }
            </p>
          </div>

          {/* Right - Controls */}
          <div className="flex items-center space-x-4">
            {/* User/Admin Mode Toggle */}
            <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
              <Button
                variant={userMode === 'user' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onModeChange('user')}
                className="rounded-md"
              >
                <User className="h-4 w-4" />
                Usuário
              </Button>
              <Button
                variant={userMode === 'admin' ? 'admin' : 'ghost'}
                size="sm"
                onClick={() => onModeChange('admin')}
                className="rounded-md"
              >
                <Settings className="h-4 w-4" />
                Administrador
              </Button>
            </div>

            {/* Wallet Connect Button */}
            <Button
              variant={isWalletConnected ? 'wallet-connected' : 'wallet'}
              size="lg"
              onClick={onWalletConnect}
              className="min-w-[180px]"
            >
              {isWalletConnected ? (
                <>
                  <Check className="h-5 w-5" />
                  Carteira Conectada
                </>
              ) : (
                <>
                  <Wallet className="h-5 w-5" />
                  Conectar Carteira
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}