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
        string memory title;    // Nome do veículo
        string memory brand;    // Marca do veículo
        string memory model;    // Modelo do veículo
        string memory details;  // Detalhes do Veículo
        uint8 year;             // Ano do veículo
        uint8 value;            // Valor do veículo
        uint256 mileage;        // Km do veículo
        bool uniccupied;        // Disponibilidade do veículo
    }

    // Locação
    struct Rental{
        uint256 vehicleId;       // id do veículo
        address tenant;          // endereço do locador
        uint256 startDate;       // data de início
        uint256 rentalDays;      // quantidade de dias locado
        uint256 RentalValue;     // Valor da locação
        bool isActive;           // disponibilidade
    }

    ////////// STATE VARIABLES //////////

    uint256 constant MINIMUM_VALUE;     // valor mínimo
    uint256 public totalVehicles;       // contador de veículos da locadora
    uint256 public locatedVehicles;     // Veículos locados
    uint256 public uniccupiedVehicles;  // Veículos disponíveis
    uint256 public valueTotalToRecive;  // Valor total a receber
    uint256 public totalReceived;       // Valor total recebido
    uint256 public totalAmount          // Total Geral

    ////////// MAPPINGS //////////

    mapping(uint256 => Vehicle) public vehicles;    // Mapeamento dos veículos por id
    mapping(uint256 => Rental) public rentals       // Mapeamento das locações por id
    mapping(address => uint256[]) public userRental // Locações do usuário
    
    
}