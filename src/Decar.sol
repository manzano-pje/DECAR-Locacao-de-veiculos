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
        uint256 vehicleId;      // id veículo
        address vehicleOwner;   // Endereçço do proprietário da locadora
        string memory name;     // Nome do veículo
        string memory brand;    // Marca do veículo
        string memory model;    // Modelo do veículo
        string memory details;  // Detalhes do Veículo
        uint8 year;             // Ano do veículo
        uint256 value;          // Valor do veículo
        uint256 mileage;        // Km do veículo
        uint256 registeredDate; // Data de cadastro
        bool isRented;          // disponibilidade
    }

    // Locação
    struct Rental{
        uint256 rentalId;       // id do veículo
        address tenant;          // endereço do locador
        uint256 startDate;       // data de início
        uint256 rentalDays;      // quantidade de dias locado
        uint256 RentalValue;     // Valor da locação
    }

    ////////// STATE VARIABLES //////////

    uint256 constant MINIMUM_VALUE;     // valor mínimo
    uint256 public totalVehicles;       // contador de veículos da locadora
    uint256 public locatedVehicles;     // Veículos locados
    uint256 public uniccupiedVehicles;  // Veículos disponíveis
    uint256 public valueTotalToRecive;  // Valor total a receber
    uint256 public totalReceived;       // Valor total recebido
    uint256 public totalAmount;         // Total Geral
    address public vehicleOwner;        // Endereço do proprietário

    ////////// MAPPINGS //////////

    mapping(uint256 => Vehicle) public vehicles;     // Mapeamento dos veículos por id
    mapping(uint256 => Rental) public rentals;       // Mapeamento das locações por id
    mapping(address => uint256[]) public userRental; // Locações do usuário
    

    ////////// EVENTS //////////
    event vehicleRegistered (uint256 indexed vehicleId, string name, string brand, string model,
                             string details, uint8 year, uint256 value, uint256 mileage);
    event vehicleRented (uint256 indexed vehicleId, uint256 indexed rentalId, address indexed tenant);
    event rentalCompleted (uint256 indexed vehicleId, uint256 indexed rentalId, address indexed tenant);
   
    ////////// MODIFIERS //////////    
    modifier onlyOropertyOwner(uint256 _vehicleId){
        require(vehicles[msg.sender].vehicleOwner == msg.sender, "Somente o proprietario tem acesso. ");
    }

    modifier vehicleExist(uint256 _vehicleId){
        require(_vehicleId >=0 && _vehicleId <= totalVehicles,
        "Veiculo não existe");
    }

    modifier vehicleIsRented(uint256 _vehicleId){
        require(_vehicles.isRented == false, "Veiculo nao disponivel");
    }

    modifier onlyPlataformOwner(){
        require(msg.sender == plataformOwner, "Area restrita. Conecte como administrador");
    }

    ////////// CONSTRUTORES //////////

    constructor(){
        address plataformOwner = msg.sender;
    }

    ////////// FUNÇÕES //////////


}