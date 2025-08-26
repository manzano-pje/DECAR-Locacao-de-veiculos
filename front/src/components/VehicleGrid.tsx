import { VehicleCard, type Vehicle } from "./VehicleCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface VehicleGridProps {
  vehicles: Vehicle[];
  userMode: 'user' | 'admin';
  onRent?: (vehicleId: string) => void;
  onEdit?: (vehicleId: string) => void;
  onAddVehicle?: () => void;
}

export function VehicleGrid({ vehicles, userMode, onRent, onEdit, onAddVehicle }: VehicleGridProps) {
  // Sort vehicles: available first, then rented
  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (a.isRented && !b.isRented) return 1;
    if (!a.isRented && b.isRented) return -1;
    return 0;
  });

  return (
    <section className="w-full">
      <div className="container mx-auto px-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {userMode === 'admin' ? 'Gestão de Veículos' : 'Veículos Disponíveis'}
              </h2>
              <p className="text-muted-foreground">
                {userMode === 'admin' 
                  ? 'Gerencie toda a frota de veículos'
                  : 'Selecione o veículo ideal para sua viagem'
                }
              </p>
            </div>
            
            {userMode === 'admin' && onAddVehicle && (
              <Button
                variant="admin"
                onClick={onAddVehicle}
                className="h-12 px-6"
              >
                <Plus className="h-5 w-5" />
                Cadastrar Novo Veículo
              </Button>
            )}
          </div>
        </div>
        
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
          userMode === 'admin' ? 'lg:grid-cols-4 xl:grid-cols-4' : 'lg:grid-cols-4'
        }`}>
          {sortedVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              userMode={userMode}
              onRent={onRent}
              onEdit={onEdit}
            />
          ))}
        </div>

        {vehicles.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-muted/30 rounded-lg p-8 inline-block">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Nenhum veículo encontrado
              </h3>
              <p className="text-sm text-muted-foreground">
                {userMode === 'admin' 
                  ? 'Adicione veículos à frota para começar'
                  : 'Em breve teremos veículos disponíveis'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}