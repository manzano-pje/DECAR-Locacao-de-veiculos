import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Fuel, Navigation, Eye, Zap, Edit } from "lucide-react";
import { useState } from "react";

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  year: number;
  price: number; // Price in ETH
  description: string;
  kilometers: number;
  image: string;
  isRented: boolean;
  renterAddress?: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  userMode: 'user' | 'admin';
  onRent?: (vehicleId: string) => void;
  onEdit?: (vehicleId: string) => void;
}

export function VehicleCard({ vehicle, userMode, onRent, onEdit }: VehicleCardProps) {
  const [showDetails, setShowDetails] = useState(userMode === 'admin');

  return (
    <Card className={`
      overflow-hidden transition-all duration-300 hover:shadow-elevated
      ${vehicle.isRented ? 'opacity-60 bg-muted/50' : 'hover:scale-105 shadow-card'}
      ${!vehicle.isRented ? 'border-primary/20' : 'border-muted'}
    `}>
      {/* Vehicle Image */}
      <div className="relative overflow-hidden">
        <img 
          src={vehicle.image} 
          alt={vehicle.name}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
        />
        <Badge 
          variant={vehicle.isRented ? "secondary" : "default"}
          className={`absolute top-4 right-4 ${
            vehicle.isRented 
              ? 'bg-vehicle-rented text-white' 
              : 'bg-vehicle-available text-white'
          }`}
        >
          {vehicle.isRented ? 'Alugado' : 'Disponível'}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">{vehicle.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{vehicle.brand}</span>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{vehicle.year}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {vehicle.price} ETH
          </span>
          <span className="text-sm text-muted-foreground">por dia</span>
        </div>

        {/* Details - always show in admin mode */}
        {(showDetails || userMode === 'admin') && (
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50">
            <div className="flex items-center space-x-2">
              <Navigation className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{vehicle.kilometers.toLocaleString()} km rodados</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {vehicle.description}
            </p>
            {vehicle.isRented && vehicle.renterAddress && userMode === 'admin' && (
              <div className="pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  Alugado por: <span className="font-mono">{vehicle.renterAddress.slice(0, 6)}...{vehicle.renterAddress.slice(-4)}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="space-y-3">
        {userMode === 'user' && (
          <Button
            variant="ghost"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full"
          >
            <Eye className="h-4 w-4" />
            {showDetails ? 'Ocultar Detalhes' : 'Ver Mais Detalhes'}
          </Button>
        )}
        
        {!vehicle.isRented && userMode === 'user' && onRent && (
          <Button
            variant="vehicle-rent"
            onClick={() => onRent(vehicle.id)}
            className="w-full"
          >
            <Zap className="h-4 w-4" />
            Alugar Veículo
          </Button>
        )}

        {userMode === 'admin' && onEdit && (
          <Button
            variant="admin"
            onClick={() => onEdit(vehicle.id)}
            className="w-full"
          >
            <Edit className="h-4 w-4" />
            Editar Veículo
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}