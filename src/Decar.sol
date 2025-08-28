// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

/**
 @title Decar
 @author Paulo Manzano
 @notice Plataforma descentralizada para locação de veículos
 */

contract Decar{

    ////////// DATA STRUCTURE //////////

    // Veículo 
    struct Vehicle{
        vehicleRegistration
        uint256 id;               // id veículo
        string name;              // Nome do veículo
        string brand;             // Marca do veículo
        string model;             // Modelo do veículo
        string details;           // Detalhes do Veículo
        uint16 year;              // Ano do veículo
        uint256 value;            // Valor do veículo
        uint256 mileage;          // Km do veículo
        uint256 registeredAtDate; // Data de cadastro
        bool isRented;            // disponibilidade
    }

    // Locação
    struct Rental{
        vehicleRegistration
        uint256 rentalId;        // id do veículo
        address tenant;          // endereço do locador
        uint256 startDate;       // data de início
        uint256 rentalDays;      // quantidade de dias locado
        uint256 rentalValue;     // Valor da locação
    }

    ////////// STATE VARIABLES //////////

    uint256 constant MINIMUM_VALUE = 0.01 ether; // valor mínimo

    uint256 public vehiclesCounter = 0;          // contador de veículos da locadora
    uint256 public locatedVehicles;              // Veículos locados
    uint256 public unoccupiedVehicles;           // Veículos disponíveis
    uint256 public valueTotalToReceive;          // Valor total a receber
    uint256 public totalReceived;                // Valor total recebido
    uint256 public totalAmount;                  // Total Geral
    address public plataformOwner;               // Endereço do proprietário

    ////////// MAPPINGS //////////

    mapping(uint256 => Vehicle) public vehicles;        // Mapeamento dos veículos por id
    mapping(uint256 => Rental) public rentals;          // Mapeamento das locações por id
    mapping(address => uint256[]) public userRental;    // Locações do usuário
    mapping(address => uint256[]) public ownerVehicle;  // Veículos do proprietário
    

    ////////// EVENTS //////////
    event vehicleRegistered (uint256 indexed id, string name, string brand, string model,
                             string details, uint16 year, uint256 value, uint256 mileage);
    event vehicleUpdate (uint256 indexed id, string name, string brand, string model, string details, 
                        uint16 year, uint256 value, uint256 mileage, uint256 registeredAtDate, bool isRented); 
    event vehicleRented (uint256 indexed id, uint256 indexed rentalId, address indexed tenant);
    event rentalCompleted (uint256 indexed id, uint256 indexed rentalId, address indexed tenant);
   
    ////////// MODIFIERS //////////    

    modifier vehicleExist(uint256 _id){
        require(_id > 0 && _id <= vehiclesCounter,
        "Veiculo não existe");
        _;
    }

    modifier vehicleIsRented(uint256 _id){
        require(vehicles[_id].isRented == false, "Veiculo nao disponivel");
        _;
    }

    modifier onlyPlataformOwner(){
        require(msg.sender == plataformOwner, "Area restrita. Conecte como administrador");
        _;
    }

    modifier dataValidation(string memory _name, string memory _brand, string memory _model, 
                            string memory _details, uint16 _year, uint256 _value, uint256 _mileage){
            uint256 limitYear = 1970 + (block.timestamp / 1 years) + 1;
            require(bytes(_name).length > 0, "O nome do veículo não pode ser vazio.");
            require(bytes(_name).length <= 30, "O nome do veículo maior que 30 caracteres.");
            require(bytes(_brand).length > 0, "O tipo do veículo não pode ser vazio.");
            require(bytes(_brand).length <= 30, "O tipo do veículo maior que 30 caracteres.");
            require(bytes(_model).length > 0, "O modelo do veículo não pode ser vazio.");
            require(bytes(_model).length <50, "O modelo do veículo não pode ser maior que 50 caracteres.");
            require(bytes(_details).length > 0, "Os detalhes do veículo não podem estar em branco.");
            require(bytes(_details).length < 100, "Os detalhes do veículo não podem ser maior que 100 caracteres.");
            require(_year < limitYear, "O ano do veículo não pode ser maior que ", limitYear.toString());
            require(_year > 1950, "O ano do veículo não pode ser menor que 1950.");
            require(_value > MINIMUM_VALUE, "O valor do veículo deve ser maior que 0.01 ethers.");
            require(_value < 100 ether, "O valor não pode ser maior que 100 ether.");
            require(_mileage >= 0, "A quilometragem do veículo não pode ser menor que 0.");
            _;
    }

    ////////// CONSTRUTORES //////////

    constructor(){
        vehicleRegistration
        plataformOwner = msg.sender;

    }

    ////////// FUNÇÕES //////////

    function vehicleRegistration (
        string memory _name,     
        string memory _brand,    
        string memory _model,    
        string memory _details,  
        uint16 _year,            
        uint256 _value,         
        uint256 _mileage        
        ) external 
        onlyPlataformOwner() 
        dataValidation(_name, _brand, _model, _details, _year, _value, _mileage)
        returns(uint256)
        {          
            vehiclesCounter ++;
            unoccupiedVehicles++;

            vehicles[vehiclesCounter] = Vehicle({
                id: vehiclesCounter,
                name:  _name,     
                brand: _brand,    
                model: _model,    
                details: _details,  
                year: _year,            
                value: _value,         
                mileage: _mileage
            });

            vehicles[vehiclesCounter].registeredAtDate = block.timestamp; // Data de cadastro
            vehicles[vehiclesCounter].isRented = false;
            
            ownerVehicle[msg.sender].push(vehiclesCounter);

            emit vehicleRegistered (vehiclesCounter, _name, _brand, _model, _details, _year, _value, _mileage);
            return vehiclesCounter;
        }

    function vehicleUpdate(
        uint256 _id, 
        string memory _name,     
        string memory _brand,    
        string memory _model,    
        string memory _details,  
        uint16 _year,            
        uint256 _value,         
        uint256 _mileage
        ) external 
          onlyPlataformOwner() 
          dataValidation(_name, _brand, _model, _details, _year, _value, _mileage)
          vehicleExist(_id) 
          returns(uint256)
          {
            require(vehicles[_id].isRented == false, "O veículo está alugado. Você não pode fazer uma alteração com o veículo alugado.");
                vehicles[_id] = Vehicle({
                id: _id,
                name:  _name,     
                brand: _brand,    
                model: _model,    
                details: _details,  
                year: _year,            
                value: _value,         
                mileage: _mileage
                registeredAtDate: vehicles[_id].registeredAtDate,
                isRented: false
            });
            
            emit vehicleUpdate (_id, _name, _brand, _model, _details, _year, _value, _mileage, 
                                vehicles[_id].registeredAtDate, vehicles[_id].isRented); 
            return _id;                                
    }
}