import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Upload, X } from "lucide-react";
import { type Vehicle } from "./VehicleCard";

interface AddVehicleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddVehicle: (vehicle: Omit<Vehicle, 'id' | 'isRented'>) => void;
}

export function AddVehicleForm({ open, onOpenChange, onAddVehicle }: AddVehicleFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    year: new Date().getFullYear(),
    price: 0,
    description: "",
    kilometers: 0,
    image: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.brand || !formData.price) {
      return;
    }

    onAddVehicle({
      ...formData,
      year: Number(formData.year),
      price: Number(formData.price),
      kilometers: Number(formData.kilometers)
    });

    // Reset form
    setFormData({
      name: "",
      brand: "",
      year: new Date().getFullYear(),
      price: 0,
      description: "",
      kilometers: 0,
      image: ""
    });

    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Cadastrar Novo Veículo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Image */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-medium text-foreground">
              Foto do Veículo
            </Label>
            <div className="flex items-center space-x-4">
              <Input
                id="image"
                type="url"
                placeholder="URL da imagem do veículo"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </div>
            {formData.image && (
              <div className="mt-2">
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="w-24 h-16 object-cover rounded-md border border-border"
                />
              </div>
            )}
          </div>

          {/* Vehicle Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Nome do Veículo*
              </Label>
              <Input
                id="name"
                placeholder="Ex: BMW Série 5"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand" className="text-sm font-medium text-foreground">
                Marca*
              </Label>
              <Input
                id="brand"
                placeholder="Ex: BMW"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Year, Price, Kilometers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm font-medium text-foreground">
                Ano
              </Label>
              <Input
                id="year"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium text-foreground">
                Preço (ETH)*
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.15"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kilometers" className="text-sm font-medium text-foreground">
                Quilometragem
              </Label>
              <Input
                id="kilometers"
                type="number"
                min="0"
                placeholder="15000"
                value={formData.kilometers}
                onChange={(e) => handleInputChange('kilometers', parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Descrição
            </Label>
            <Textarea
              id="description"
              placeholder="Descreva as características e diferenciais do veículo..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={!formData.name || !formData.brand || !formData.price}
            >
              <Plus className="h-4 w-4" />
              Cadastrar Veículo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}