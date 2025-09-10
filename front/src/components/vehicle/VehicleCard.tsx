import { motion } from 'framer-motion';
import { Car, Calendar, Gauge, MapPin, Edit, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Vehicle } from '@/store/vehicleStore';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit?: () => void;
  onDelete?: () => void;
  onRent?: () => void;
  onReturn?: () => void;
  isOwner?: boolean;
  delay?: number;
}

export function VehicleCard({
  vehicle,
  onEdit,
  onDelete,
  onRent,
  onReturn,
  isOwner,
  delay = 0,
}: VehicleCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-xl">
        <div className="relative h-48 overflow-hidden">
          <img
            src={vehicle.photoUrl}
            alt={vehicle.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <Badge
            className={cn(
              'absolute right-2 top-2',
              vehicle.isAvailable
                ? 'bg-success text-success-foreground'
                : 'bg-destructive text-destructive-foreground'
            )}
          >
            {vehicle.isAvailable ? t('vehicle.available') : t('vehicle.rented')}
          </Badge>
        </div>

        <CardContent className="p-4">
          <h3 className="text-lg font-bold font-display">{vehicle.name}</h3>
          
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{vehicle.year}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gauge className="h-4 w-4" />
              <span>{vehicle.mileage.toLocaleString()} km</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-2">{vehicle.description}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold gradient-text">
                {vehicle.dailyRate} ETH
              </p>
              <p className="text-xs text-muted-foreground">{t('common.per_day')}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          {isOwner ? (
            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="flex-1"
              >
                <Edit className="mr-2 h-4 w-4" />
                {t('vehicle.update')}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onDelete}
                className="flex-1"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('vehicle.delete')}
              </Button>
            </div>
          ) : vehicle.renter ? (
            <Button
              onClick={onReturn}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {t('vehicle.return')}
            </Button>
          ) : (
            <Button
              onClick={onRent}
              disabled={!vehicle.isAvailable}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              <Car className="mr-2 h-4 w-4" />
              {t('rental.rent_now')}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}