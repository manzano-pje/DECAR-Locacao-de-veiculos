import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Square, DollarSign, TrendingUp, Wallet } from "lucide-react";

interface MetricsData {
  rentedVehicles: number;
  availableVehicles: number;
  totalCash: number;
  totalReceivable: number;
  totalGeneral: number;
}

interface AdminMetricsProps {
  metrics: MetricsData;
}

export function AdminMetrics({ metrics }: AdminMetricsProps) {
  const metricsCards = [
    {
      title: "Veículos Alugados",
      value: metrics.rentedVehicles,
      icon: Car,
      gradient: "bg-gradient-to-br from-secondary to-secondary-light",
      textColor: "text-secondary-foreground"
    },
    {
      title: "Veículos Disponíveis", 
      value: metrics.availableVehicles,
      icon: Square,
      gradient: "bg-gradient-to-br from-primary to-primary-light",
      textColor: "text-primary-foreground"
    },
    {
      title: "Total em Caixa",
      value: `${metrics.totalCash} ETH`,
      icon: Wallet,
      gradient: "bg-gradient-to-br from-success to-secondary",
      textColor: "text-white"
    },
    {
      title: "Total a Receber",
      value: `${metrics.totalReceivable} ETH`,
      icon: TrendingUp,
      gradient: "bg-gradient-to-br from-warning to-primary",
      textColor: "text-white"
    },
    {
      title: "Total Geral",
      value: `${metrics.totalGeneral} ETH`,
      icon: DollarSign,
      gradient: "bg-gradient-road",
      textColor: "text-white"
    }
  ];

  return (
    <section className="w-full mb-8">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Dashboard Administrativo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {metricsCards.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="overflow-hidden border-0 shadow-elevated hover:shadow-primary transition-all duration-300 hover:scale-105">
                <div className={`${metric.gradient} p-1`}>
                  <CardHeader className="bg-card m-1 rounded-lg">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {metric.title}
                      </CardTitle>
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className={`${metric.gradient} ${metric.textColor} p-4 pt-2`}>
                    <div className="text-3xl font-bold">
                      {metric.value}
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}