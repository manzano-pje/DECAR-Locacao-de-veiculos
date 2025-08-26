import { useState } from "react";
import { Header } from "@/components/Header";
import { AdminMetrics } from "@/components/AdminMetrics";
import { VehicleGrid } from "@/components/VehicleGrid";
import { AddVehicleForm } from "@/components/AddVehicleForm";
import { type Vehicle } from "@/components/VehicleCard";
import { useToast } from "@/hooks/use-toast";
import carSedan from "@/assets/car-sedan.jpg";
import carSuv from "@/assets/car-suv.jpg";
import carSports from "@/assets/car-sports.jpg";
import carElectric from "@/assets/car-electric.jpg";

const Index = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [userMode, setUserMode] = useState<'user' | 'admin'>('user');
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const { toast } = useToast();

  // Sample vehicle data
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "1",
      name: "BMW Série 5",
      brand: "BMW",
      year: 2023,
      price: 0.15,
      description: "Sedan executivo com tecnologia avançada, ideal para viagens de negócios. Interior em couro premium e sistema de som harman/kardon.",
      kilometers: 15000,
      image: carSedan,
      isRented: false
    },
    {
      id: "2", 
      name: "Audi Q7",
      brand: "Audi",
      year: 2023,
      price: 0.25,
      description: "SUV de luxo com 7 lugares, perfeito para família. Tração integral e sistema de navegação avançado.",
      kilometers: 8500,
      image: carSuv,
      isRented: true,
      renterAddress: "0x742d35Cc6634C0532925a3b8D"
    },
    {
      id: "3",
      name: "Porsche 911",
      brand: "Porsche", 
      year: 2024,
      price: 0.45,
      description: "Esportivo icônico com motor boxer turbo. Performance excepcional e design atemporal.",
      kilometers: 2500,
      image: carSports,
      isRented: false
    },
    {
      id: "4",
      name: "Tesla Model S",
      brand: "Tesla",
      year: 2023,
      price: 0.2,
      description: "Sedan elétrico de alta performance com piloto automático. Zero emissões e tecnologia de ponta.",
      kilometers: 12000,
      image: carElectric,
      isRented: false
    }
  ]);

  // Sample metrics data
  const metrics = {
    rentedVehicles: vehicles.filter(v => v.isRented).length,
    availableVehicles: vehicles.filter(v => !v.isRented).length,
    totalCash: 12.5,
    totalReceivable: 8.3,
    totalGeneral: 20.8
  };

  const handleWalletConnect = () => {
    setIsWalletConnected(!isWalletConnected);
    toast({
      title: isWalletConnected ? "Carteira Desconectada" : "Carteira Conectada",
      description: isWalletConnected 
        ? "Sua carteira foi desconectada com sucesso"
        : "Carteira conectada! Você pode agora efetuar transações",
    });
  };

  const handleRentVehicle = (vehicleId: string) => {
    if (!isWalletConnected) {
      toast({
        title: "Carteira não conectada",
        description: "Conecte sua carteira para alugar veículos",
        variant: "destructive"
      });
      return;
    }

    setVehicles(prev => 
      prev.map(vehicle => 
        vehicle.id === vehicleId 
          ? { ...vehicle, isRented: true, renterAddress: "0x1a2b3c4d5e6f7g8h9i0j" }
          : vehicle
      )
    );

    const vehicle = vehicles.find(v => v.id === vehicleId);
    toast({
      title: "Veículo Alugado!",
      description: `${vehicle?.name} foi alugado com sucesso por ${vehicle?.price} ETH`,
    });
  };

  const handleEditVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    toast({
      title: "Editar Veículo",
      description: `Funcionalidade de edição para ${vehicle?.name} será implementada`,
    });
  };

  const handleAddVehicle = (newVehicleData: Omit<Vehicle, 'id' | 'isRented'>) => {
    const newVehicle: Vehicle = {
      ...newVehicleData,
      id: (vehicles.length + 1).toString(),
      isRented: false
    };

    setVehicles(prev => [...prev, newVehicle]);
    toast({
      title: "Veículo Cadastrado!",
      description: `${newVehicle.name} foi adicionado à frota com sucesso`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isWalletConnected={isWalletConnected}
        userMode={userMode}
        onWalletConnect={handleWalletConnect}
        onModeChange={setUserMode}
      />

      <main className="py-8 space-y-8">
        {userMode === 'admin' && (
          <AdminMetrics metrics={metrics} />
        )}
        
        <VehicleGrid 
          vehicles={vehicles}
          userMode={userMode}
          onRent={handleRentVehicle}
          onEdit={handleEditVehicle}
          onAddVehicle={() => setShowAddVehicleForm(true)}
        />
      </main>

      <AddVehicleForm
        open={showAddVehicleForm}
        onOpenChange={setShowAddVehicleForm}
        onAddVehicle={handleAddVehicle}
      />
    </div>
  );
};

export default Index;
