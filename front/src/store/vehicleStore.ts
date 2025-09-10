import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Vehicle {
  id: string;
  name: string;
  photoUrl: string;
  year: number;
  mileage: number;
  description: string;
  dailyRate: number; // in ETH
  isAvailable: boolean;
  owner: string; // wallet address
  renter?: string; // wallet address of current renter
  rentedUntil?: Date;
}

interface VehicleStore {
  vehicles: Vehicle[];
  userRentals: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  rentVehicle: (id: string, renter: string, days: number) => void;
  returnVehicle: (id: string) => void;
  getUserVehicles: (address: string) => Vehicle[];
  getUserRentals: (address: string) => Vehicle[];
  getAvailableVehicles: () => Vehicle[];
}

export const useVehicleStore = create<VehicleStore>()(
  persist(
    (set, get) => ({
      vehicles: [
        {
          id: '1',
          name: 'Tesla Model 3',
          photoUrl: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800',
          year: 2023,
          mileage: 5000,
          description: 'Carro elétrico de alta performance com piloto automático',
          dailyRate: 0.05,
          isAvailable: true,
          owner: '0x0000000000000000000000000000000000000001',
        },
        {
          id: '2',
          name: 'BMW X5',
          photoUrl: 'https://images.unsplash.com/photo-1555215858-9dc5a8edcdba?w=800',
          year: 2022,
          mileage: 15000,
          description: 'SUV de luxo com muito espaço e conforto',
          dailyRate: 0.08,
          isAvailable: true,
          owner: '0x0000000000000000000000000000000000000002',
        },
        {
          id: '3',
          name: 'Mercedes-Benz C300',
          photoUrl: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800',
          year: 2023,
          mileage: 8000,
          description: 'Sedã executivo com tecnologia de ponta',
          dailyRate: 0.06,
          isAvailable: false,
          owner: '0x0000000000000000000000000000000000000003',
          renter: '0x0000000000000000000000000000000000000004',
          rentedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      ],
      userRentals: [],

      addVehicle: (vehicle) =>
        set((state) => ({
          vehicles: [
            ...state.vehicles,
            {
              ...vehicle,
              id: Date.now().toString(),
            },
          ],
        })),

      updateVehicle: (id, vehicle) =>
        set((state) => ({
          vehicles: state.vehicles.map((v) =>
            v.id === id ? { ...v, ...vehicle } : v
          ),
        })),

      deleteVehicle: (id) =>
        set((state) => ({
          vehicles: state.vehicles.filter((v) => v.id !== id),
        })),

      rentVehicle: (id, renter, days) =>
        set((state) => ({
          vehicles: state.vehicles.map((v) =>
            v.id === id
              ? {
                  ...v,
                  isAvailable: false,
                  renter,
                  rentedUntil: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
                }
              : v
          ),
          userRentals: [
            ...state.userRentals,
            state.vehicles.find((v) => v.id === id)!,
          ],
        })),

      returnVehicle: (id) =>
        set((state) => ({
          vehicles: state.vehicles.map((v) =>
            v.id === id
              ? {
                  ...v,
                  isAvailable: true,
                  renter: undefined,
                  rentedUntil: undefined,
                }
              : v
          ),
          userRentals: state.userRentals.filter((v) => v.id !== id),
        })),

      getUserVehicles: (address) => {
        const state = get();
        return state.vehicles.filter(
          (v) => v.owner.toLowerCase() === address.toLowerCase()
        );
      },

      getUserRentals: (address) => {
        const state = get();
        return state.vehicles.filter(
          (v) => v.renter?.toLowerCase() === address.toLowerCase()
        );
      },

      getAvailableVehicles: () => {
        const state = get();
        return state.vehicles.filter((v) => v.isAvailable);
      },
    }),
    {
      name: 'vehicle-storage',
    }
  )
);