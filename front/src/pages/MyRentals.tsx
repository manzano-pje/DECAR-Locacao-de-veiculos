import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { Car, Wallet } from 'lucide-react';
import { VehicleCard } from '@/components/vehicle/VehicleCard';
import { useVehicleStore } from '@/store/vehicleStore';
import { toast } from 'sonner';

export default function MyRentals() {
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();
  const { getUserRentals, returnVehicle } = useVehicleStore();

  const userRentals = address ? getUserRentals(address) : [];

  const handleReturn = (vehicleId: string) => {
    returnVehicle(vehicleId);
    toast.success('Veículo devolvido com sucesso!');
  };

  if (!isConnected) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <Wallet className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">Conecte sua carteira</h2>
          <p className="mt-2 text-muted-foreground">
            Você precisa conectar sua carteira para ver seus aluguéis
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
          {t('rental.my_vehicles')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Gerencie seus veículos alugados
        </p>
      </motion.div>

      {userRentals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex min-h-[400px] items-center justify-center"
        >
          <div className="text-center">
            <Car className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">
              Nenhum veículo alugado
            </h2>
            <p className="mt-2 text-muted-foreground">
              Você ainda não alugou nenhum veículo
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {userRentals.map((vehicle, index) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onReturn={() => handleReturn(vehicle.id)}
              delay={index * 0.1}
            />
          ))}
        </div>
      )}
    </div>
  );
}