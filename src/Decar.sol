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
        uint256 rentalId;        // id do veículo
        address tenant;          // endereço do locador
        uint256 startDate;       // data de início
        uint256 rentalDays;      // quantidade de dias locado
        uint256 rentalValue;     // Valor da locação
    }

    ////////// STATE VARIABLES //////////

    uint256 constant MINIMUM_VALUE = 0.4 ether; // valor mínimo
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

    ////////// CONSTRUTORES //////////

    constructor(){
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
        ) external onlyPlataformOwner() returns(uint256){
            require(_value > MINIMUM_VALUE, "O valor do veiculo deve ser maior que 0.4 ethers.");
            vehiclesCounter ++;

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




}