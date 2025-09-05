// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

/**
 @title Decar
 @author Paulo Manzano
 @notice Plataforma descentralizada para locacao de veiculos
 */

contract Decar{

    ////////// DATA STRUCTURE //////////

    // Veiculo 
    struct Vehicle{
        uint256 id;               // id veiculo
        string imageUrl;          // url da imagem
        string name;              // Nome do veiculo
        string brand;             // Marca do veiculo
        string model;             // Modelo do veiculo
        string details;           // Detalhes do Veiculo
        uint16 year;              // Ano do veiculo
        uint256 value;            // Valor do veiculo
        uint256 mileage;          // Km do veiculo
        uint256 registeredAtDate; // Data de cadastro
        bool isRented;            // Disponibilidade
        // string chassi             // Chassi do veiculo
        // string licensePlate       // Placa do veiculo
        // uint256 modelYear         // Ano do modelo
        // string  category          // Categora do veiculo
        // string color              // Cor do veiculo
        // string fuel               // Tipo de combustivel
    }

    // Locacao
    struct Rental{
        // vehicleRegistration
        uint256 rentalId;        // id do veiculo
        address tenant;          // endereço do locador
        uint256 startDate;       // data de inicio
        uint256 rentalDays;      // quantidade de dias locado
        uint256 rentalValue;     // Valor da locacao
        bool isActive            // Veículo está locado
    }

    
    ////////// ERRORS //////////
    

    ////////// STATE VARIABLES //////////

    uint256 constant MINIMUM_VALUE = 0.01 ether; // valor minimo

    uint256 public vehiclesCounter = 0;          // contador de veiculos da locadora
    uint256 public locatedVehicles;              // Veiculos locados
    uint256 public unoccupiedVehicles;           // Veiculos disponiveis
    uint256 public valueTotalToReceive;          // Valor total a receber
    uint256 public totalReceived;                // Valor total recebido
    uint256 public totalAmount;                  // Total Geral
    address public plataformOwner;               // Endereço do proprietario

    ////////// MAPPINGS //////////

    mapping(uint256 => Vehicle) public vehicles;        // Mapeamento dos veiculos por id
    mapping(uint256 => Rental) public rentals;          // Mapeamento das locaçoes por id
    mapping(address => uint256[]) public userRental;    // Locaçoes do usuario
    mapping(address => uint256[]) public ownerVehicle;  // Veiculos do proprietario
    

    ////////// EVENTS //////////
    event vehicleRegistered (uint256 indexed id, string name, string brand, string model,
                             string details, uint16 year, uint256 value, uint256 mileage);

    event vehicleUpdate (uint256 indexed id, string name, string brand, string model, string details, 
                        uint16 year, uint256 value, uint256 mileage, uint256 registeredAtDate, bool isRented); 
   
    event vehicleRented (uint256 indexed id, uint256 indexed rentalId, address indexed tenant);
   
    event rentalCompleted (uint256 indexed id, uint256 indexed rentalId, address indexed tenant);
    event logMessage (string message);
   

    ////////// MODIFIERS //////////    

    modifier vehicleExist(uint256 _id){
        require(_id > 0 && _id <= vehiclesCounter,
        "Veiculo nao existe");
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
            require(bytes(_name).length > 0, "O nome do veiculo nao pode ser vazio.");
            require(bytes(_name).length <= 30, "O nome do veiculo maior que 30 caracteres.");
            require(bytes(_brand).length > 0, "O tipo do veiculo nao pode ser vazio.");
            require(bytes(_brand).length <= 30, "O tipo do veiculo maior que 30 caracteres.");
            require(bytes(_model).length > 0, "O modelo do veiculo nao pode ser vazio.");
            require(bytes(_model).length <50, "O modelo do veiculo nao pode ser maior que 50 caracteres.");
            require(bytes(_details).length > 0, "Os detalhes do veiculo nao podem estar em branco.");
            require(bytes(_details).length < 100, "Os detalhes do veiculo nao podem ser maior que 100 caracteres.");
            require(_year < limitYear, "O ano do veiculo nao pode ser maior que ", limitYear.toString());
            require(_year > 1950, "O ano do veiculo nao pode ser menor que 1950.");
            require(_value > MINIMUM_VALUE, "O valor do veiculo deve ser maior que 0.01 ethers.");
            require(_value < 100 ether, "O valor nao pode ser maior que 100 ether.");
            require(_mileage >= 0, "A quilometragem do veiculo nao pode ser menor que 0.");
            _;
    }

    ////////// CONSTRUTORES //////////

    constructor(){
        vehicleRegistration;
        plataformOwner = msg.sender;
    }

    ////////// FUNÇoES //////////

    /**
    @notice Registra um veiculo na plataforma
    @param _name Nome do veiculo
    @param _brand Marca do veiculo
    @param _model Modelo do veiculo
    @param _details Detalhes do veiculo
    @param _year Ano do veiculo
    @param _value Valor do veiculo
    @param _mileage Quilometragem do veiculo
    **/

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

    /**
    * @notice Atualiza os dados do veículo
    * @param _id Id do veiculo
    * @param _name Nome do veiculo
    * @param _brand Marca do veiculo
    * @param _model Modelo do veiculo
    * @param _details Detalhes do veiculo
    * @param _year Ano do veiculo
    * @param _value Valor do veiculo
    * @param _mileage Quilometragem do veiculo
    **/
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
            require(vehicles[_id].isRented == false, "O veiculo esta alugado. Voce nao pode fazer uma alteracao com o veiculo alugado.");
                vehicles[_id] = Vehicle({
                id: _id,
                name:  _name,
                brand: _brand,
                model: _model,
                details: _details,
                year: _year,
                value: _value,
                mileage: _mileage,
                registeredAtDate: vehicles[_id].registeredAtDate,
                isRented: false
            });

            emit vehicleUpdate (_id, _name, _brand, _model, _details, _year, _value, _mileage,
                                vehicles[_id].registeredAtDate, vehicles[_id].isRented);
            return _id;
    }
    
    /**
    * @notice Locação do veículo
    * @param _id Id do veiculo
    * @param _days Dias de locação
    **/
    function vehicleRental(uint256 _id, uint256 _days) external  payable 
             onlyPlataformOwner() 
             vehicleExist(_id) 
             vehicleIsRented(_id) 
        {

        Vehicle storage vehicle = vehicles[_id];

        uint256 totalCost = _days * vehicle.value;

        require (msg.sender != plataformOwner, "O proprietario nao pode alugar o seu proprio carro.");
        require (_days >=1, "Quantidade de dias nao pode ser menor que 1 dia.");

        locatedVehicles ++;
        rentals[locatedVehicles] = Rental({
            rentalId:locatedVehicles,
            tenant:msg.sender,
            startDate: block.timestamp,
            rentalDays: _days,
            rentalValue:totalCost
        });

        isRented = true;
        valueTotalToReceive += totalCost;
        emit vehicleRented ( vehicle.id,  locatedVehicles, msg.sender);
    }

    function CompletedRental(uint256 _rentalId) external payable vehicleExist(_rentalId) returns (uint256){
        Rental storage rental = rentals[_rentalId];
        require(rental.isActive, "O veiculo nao esta locado");
        require(msg.sender == rental.tenant || 
                msg.sender == plataformOwner,
                "Somente o proprietario ou o locador podem finalizar a locacao.");      

        // Cálculo da locação
        uint256 totalCost = rental.rentalDays * rental.rentalValue;
        if (msg.value < totalCost){
            missingValue = totalCost - msg.value;
           emit ("Faltam R$" +  missingValue);
        }

        if (msg.value > totalCost){
            payable(msg.sender).transfer(msg.value - totalCost);
        }


        // Transferir valor da locação para proprietário
        (bool success, ) = payable(plataformOwner).call{value: totalCost}("");
        require(success, "Falha ao transferir fundos");

        rental.isActive = false;
        emit rentalCompleted( vehicles.id, rental.rentalId, rental.tenant);
        return _rentalId;
    }
}