import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { Car, Package, DollarSign, TrendingUp, Plus, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/ui/stats-card';
import { VehicleCard } from '@/components/vehicle/VehicleCard';
import { VehicleForm } from '@/components/vehicle/VehicleForm';
import { useVehicleStore } from '@/store/vehicleStore';
import { toast } from 'sonner';

export default function Admin() {
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  
  const {
    vehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getUserVehicles,
  } = useVehicleStore();

  const userVehicles = address ? getUserVehicles(address) : [];
  const rentedCount = vehicles.filter(v => !v.isAvailable).length;
  const availableCount = vehicles.filter(v => v.isAvailable).length;
  const totalRevenue = vehicles
    .filter(v => !v.isAvailable)
    .reduce((sum, v) => sum + v.dailyRate, 0);
  const totalReceivable = userVehicles
    .filter(v => !v.isAvailable)
    .reduce((sum, v) => sum + v.dailyRate, 0);
  const totalGeneral = totalRevenue + totalReceivable;

  const handleSubmit = (data: any) => {
    if (editingVehicle) {
      updateVehicle(editingVehicle.id, data);
      toast.success('Veículo atualizado com sucesso!');
    } else {
      addVehicle({ ...data, owner: address! });
      toast.success('Veículo cadastrado com sucesso!');
    }
    setEditingVehicle(null);
  };

  const handleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteVehicle(id);
    toast.success('Veículo excluído com sucesso!');
  };

  if (!isConnected) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <Wallet className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">Conecte sua carteira</h2>
          <p className="mt-2 text-muted-foreground">
            Você precisa conectar sua carteira para acessar o painel administrativo
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold font-display gradient-text">
          {t('dashboard.title')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Gerencie seus veículos e acompanhe suas métricas
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title={t('dashboard.vehicles_rented')}
          value={rentedCount}
          icon={Car}
          delay={0.1}
        />
        <StatsCard
          title={t('dashboard.vehicles_available')}
          value={availableCount}
          icon={Package}
          delay={0.2}
        />
        <StatsCard
          title={t('dashboard.total_revenue')}
          value={`${totalRevenue.toFixed(3)} ETH`}
          icon={DollarSign}
          delay={0.3}
        />
        <StatsCard
          title={t('dashboard.receivable')}
          value={`${totalReceivable.toFixed(3)} ETH`}
          icon={TrendingUp}
          delay={0.4}
        />
        <StatsCard
          title={t('dashboard.total_general')}
          value={`${totalGeneral.toFixed(3)} ETH`}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          delay={0.5}
        />
      </div>

      {/* Add Vehicle Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-8 flex justify-center"
      >
        <Button
          size="lg"
          onClick={() => {
            setEditingVehicle(null);
            setIsFormOpen(true);
          }}
          className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
        >
          <Plus className="mr-2 h-5 w-5" />
          {t('vehicle.add_new')}
        </Button>
      </motion.div>

      {/* Vehicles Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {userVehicles.map((vehicle, index) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onEdit={() => handleEdit(vehicle)}
            onDelete={() => handleDelete(vehicle.id)}
            isOwner
            delay={0.7 + index * 0.1}
          />
        ))}
      </div>

      {/* Vehicle Form Dialog */}
      <VehicleForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        vehicle={editingVehicle}
        onSubmit={handleSubmit}
      />
    </div>
  );
}