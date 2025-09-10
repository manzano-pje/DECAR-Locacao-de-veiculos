import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  'pt-BR': {
    translation: {
      // Navigation
      'nav.home': 'Início',
      'nav.admin': 'Administrativo',
      'nav.rent': 'Alugar',
      'nav.my_rentals': 'Meus Aluguéis',
      
      // Auth
      'auth.connect_wallet': 'Conectar Carteira',
      'auth.disconnect': 'Desconectar',
      'auth.connected': 'Conectado',
      'auth.not_connected': 'Não conectado',
      
      // Dashboard
      'dashboard.title': 'Painel Administrativo',
      'dashboard.vehicles_rented': 'Veículos Alugados',
      'dashboard.vehicles_available': 'Veículos Disponíveis',
      'dashboard.total_revenue': 'Total em Caixa',
      'dashboard.receivable': 'Total a Receber',
      'dashboard.total_general': 'Total Geral',
      
      // Vehicle Management
      'vehicle.add_new': 'Cadastrar Novo Veículo',
      'vehicle.update': 'Atualizar',
      'vehicle.delete': 'Excluir',
      'vehicle.save': 'Salvar',
      'vehicle.cancel': 'Cancelar',
      'vehicle.name': 'Nome do veículo',
      'vehicle.photo_url': 'Link da URL do veículo',
      'vehicle.year': 'Ano do veículo',
      'vehicle.mileage': 'KM do veículo',
      'vehicle.description': 'Descrição do veículo',
      'vehicle.daily_rate': 'Valor da diária em ETH',
      'vehicle.available': 'Disponível',
      'vehicle.rented': 'Alugado',
      'vehicle.return': 'Devolver',
      
      // Rental
      'rental.title': 'Explorar Veículos',
      'rental.filter_price': 'Filtrar por preço',
      'rental.filter_availability': 'Disponibilidade',
      'rental.search': 'Buscar veículos...',
      'rental.rent_now': 'Alugar Agora',
      'rental.confirm': 'Confirmar Aluguel',
      'rental.nights': 'noites',
      'rental.total_cost': 'Custo Total',
      'rental.my_vehicles': 'Meus Veículos Alugados',
      
      // Common
      'common.loading': 'Carregando...',
      'common.error': 'Erro',
      'common.success': 'Sucesso',
      'common.confirm': 'Confirmar',
      'common.cancel': 'Cancelar',
      'common.close': 'Fechar',
      'common.eth': 'ETH',
      'common.per_day': '/dia',
    }
  },
  'en-US': {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.admin': 'Admin',
      'nav.rent': 'Rent',
      'nav.my_rentals': 'My Rentals',
      
      // Auth
      'auth.connect_wallet': 'Connect Wallet',
      'auth.disconnect': 'Disconnect',
      'auth.connected': 'Connected',
      'auth.not_connected': 'Not connected',
      
      // Dashboard
      'dashboard.title': 'Admin Dashboard',
      'dashboard.vehicles_rented': 'Vehicles Rented',
      'dashboard.vehicles_available': 'Vehicles Available',
      'dashboard.total_revenue': 'Total Revenue',
      'dashboard.receivable': 'Total Receivable',
      'dashboard.total_general': 'Total General',
      
      // Vehicle Management
      'vehicle.add_new': 'Add New Vehicle',
      'vehicle.update': 'Update',
      'vehicle.delete': 'Delete',
      'vehicle.save': 'Save',
      'vehicle.cancel': 'Cancel',
      'vehicle.name': 'Vehicle name',
      'vehicle.photo_url': 'Vehicle photo URL',
      'vehicle.year': 'Vehicle year',
      'vehicle.mileage': 'Vehicle mileage',
      'vehicle.description': 'Vehicle description',
      'vehicle.daily_rate': 'Daily rate in ETH',
      'vehicle.available': 'Available',
      'vehicle.rented': 'Rented',
      'vehicle.return': 'Return',
      
      // Rental
      'rental.title': 'Explore Vehicles',
      'rental.filter_price': 'Filter by price',
      'rental.filter_availability': 'Availability',
      'rental.search': 'Search vehicles...',
      'rental.rent_now': 'Rent Now',
      'rental.confirm': 'Confirm Rental',
      'rental.nights': 'nights',
      'rental.total_cost': 'Total Cost',
      'rental.my_vehicles': 'My Rented Vehicles',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.confirm': 'Confirm',
      'common.cancel': 'Cancel',
      'common.close': 'Close',
      'common.eth': 'ETH',
      'common.per_day': '/day',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt-BR',
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;