import { motion } from 'framer-motion';
import { Car, Shield, Zap, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

export default function Home() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-background" />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-float absolute -left-20 top-20 h-64 w-64 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
        <div className="animate-float absolute -right-20 bottom-20 h-64 w-64 rounded-full bg-gradient-secondary opacity-20 blur-3xl" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold font-display sm:text-7xl">
            <span className="gradient-text">RentChain</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground">
            A plataforma descentralizada para aluguel de veículos peer-to-peer.
            Segura, transparente e alimentada por blockchain.
          </p>
          
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-gradient-primary text-primary-foreground hover:opacity-90"
              onClick={() => navigate('/rent')}
            >
              Explorar Veículos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            {isConnected && (
              <Button
                size="lg"
                variant="outline"
                className="border-primary/50 hover:bg-primary/10"
                onClick={() => navigate('/admin')}
              >
                Alugar Meu Veículo
              </Button>
            )}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          <FeatureCard
            icon={Shield}
            title="100% Seguro"
            description="Smart contracts auditados garantem transações seguras"
            delay={0.3}
          />
          <FeatureCard
            icon={Zap}
            title="Instantâneo"
            description="Confirmação imediata sem burocracia"
            delay={0.4}
          />
          <FeatureCard
            icon={Globe}
            title="Global"
            description="Alugue veículos em qualquer lugar do mundo"
            delay={0.5}
          />
          <FeatureCard
            icon={Car}
            title="Variedade"
            description="Ampla seleção de veículos para todas as necessidades"
            delay={0.6}
          />
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 grid gap-8 sm:grid-cols-3"
        >
          <StatCard number="1000+" label="Veículos Disponíveis" />
          <StatCard number="50K+" label="Usuários Ativos" />
          <StatCard number="100%" label="Satisfação" />
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: any;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:shadow-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-4xl font-bold gradient-text">{number}</p>
      <p className="mt-2 text-muted-foreground">{label}</p>
    </div>
  );
}