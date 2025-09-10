import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VehicleCard } from '@/components/vehicle/VehicleCard';
import { useVehicleStore, Vehicle } from '@/store/vehicleStore';
import { toast } from 'sonner';

export default function Rent() {
  const { t } = useTranslation();
  const { address } = useAccount();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [rentalDays, setRentalDays] = useState(1);
  
  const { vehicles, rentVehicle, returnVehicle } = useVehicleStore();

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = vehicle.dailyRate >= priceRange[0] && vehicle.dailyRate <= priceRange[1];
      const matchesAvailability = !showAvailableOnly || vehicle.isAvailable;
      const isNotOwner = address ? vehicle.owner.toLowerCase() !== address.toLowerCase() : true;
      
      return matchesSearch && matchesPrice && matchesAvailability && isNotOwner;
    });
  }, [vehicles, searchQuery, priceRange, showAvailableOnly, address]);

  const handleRent = (vehicle: Vehicle) => {
    if (!address) {
      toast.error('Conecte sua carteira para alugar um veículo');
      return;
    }
    setSelectedVehicle(vehicle);
  };

  const confirmRental = () => {
    if (selectedVehicle && address) {
      rentVehicle(selectedVehicle.id, address, rentalDays);
      toast.success(`Veículo ${selectedVehicle.name} alugado com sucesso!`);
      setSelectedVehicle(null);
      setRentalDays(1);
    }
  };

  const handleReturn = (vehicleId: string) => {
    returnVehicle(vehicleId);
    toast.success('Veículo devolvido com sucesso!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold font-display gradient-text">
          {t('rental.title')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Encontre o veículo perfeito para sua necessidade
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 flex flex-col gap-4 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('rental.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>
                Ajuste os filtros para encontrar o veículo ideal
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              <div>
                <Label>{t('rental.filter_price')}</Label>
                <div className="mt-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1}
                    step={0.01}
                    className="w-full"
                  />
                  <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                    <span>{priceRange[0].toFixed(3)} ETH</span>
                    <span>{priceRange[1].toFixed(3)} ETH</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="availability"
                  checked={showAvailableOnly}
                  onCheckedChange={setShowAvailableOnly}
                />
                <Label htmlFor="availability">
                  {t('rental.filter_availability')}
                </Label>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </motion.div>

      {/* Vehicles Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredVehicles.map((vehicle, index) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onRent={() => handleRent(vehicle)}
            onReturn={() => handleReturn(vehicle.id)}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Rental Confirmation Dialog */}
      <Dialog open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('rental.confirm')}</DialogTitle>
            <DialogDescription>
              Confirme os detalhes do aluguel do veículo
            </DialogDescription>
          </DialogHeader>
          
          {selectedVehicle && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">{selectedVehicle.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedVehicle.description}
                </p>
              </div>

              <div>
                <Label>Período de aluguel (dias)</Label>
                <Input
                  type="number"
                  value={rentalDays}
                  onChange={(e) => setRentalDays(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                  min={1}
                  max={30}
                  className="mt-2"
                />
              </div>

              <div className="rounded-lg bg-muted p-4">
                <div className="flex justify-between">
                  <span>Diária</span>
                  <span>{selectedVehicle.dailyRate} ETH</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span>Período</span>
                  <span>{rentalDays} {t('rental.nights')}</span>
                </div>
                <div className="mt-2 border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>{t('rental.total_cost')}</span>
                    <span className="gradient-text">
                      {(selectedVehicle.dailyRate * rentalDays).toFixed(3)} ETH
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedVehicle(null)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={confirmRental} className="bg-gradient-primary">
              {t('common.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}