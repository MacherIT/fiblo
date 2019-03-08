pragma solidity ^0.4.22;

import './mortal.sol';
import './SafeMath.sol';
import './CNV.sol';
import './OraculoPrecio.sol';

contract ContratoSAS is mortal {
    using SafeMath for uint;

    CNV cnv;
    OraculoPrecio oraculo_precio;

    /* Events */
    event contributionFiled(address indexed from, uint indexed uid, uint amount);
    event receivedFunds(address _from, uint _amount);
    event beneficiarioSet(address beneficiario);
    event cantAccionesSet(uint cant_acciones);
    event Transfer(address indexed from, address indexed to, uint tokens);
    event symbolSet(string symbol);
    event urlSet(string url);
    event nombreSet(string nombre);
    event montoSet(uint monto);
    event montoMaxSet(uint monto_max);
    event fechaSet(uint fecha_fin);
    event descripcionSet(string descripcion);
    event cuitSet(uint cuit);
    /* event uidSet(uint uid); */

    struct Contribution {
        address _from;
        uint _uid;
        uint _amount;
    }

    uint public    m_total_supply; // ERC 20
    uint public    m_decimals; // ERC 20
    string public  m_symbol; // ERC 20
    uint public    contribution_counter;
    address public m_beneficiario;
    string public  m_url;
    string public  m_nombre; // ERC 20
    uint public    m_monto; // Monto en centavos
    uint public    m_monto_max; // Monto en centavos
    uint public    m_fecha_fin;
    string public  m_descripcion;
    uint public    m_cuit;
    bool public    m_project_valid;
    bool public    m_beneficiary_valid;
    bool public    m_closed_round;
    /* uint public    m_uid; */

    mapping(uint => Contribution) m_contributions;
    mapping(address => uint) balances;

    /* constructor() public {
      m_decimals = 18;
      contribution_counter = 0;
      m_project_valid = false;
      m_beneficiary_valid = false;
      m_closed_round = false;
    } */

    constructor(address cnv_addr, address oraculo_precio_addr, address beneficiario, uint cant_acciones, string symbol, uint monto, uint monto_max, uint fecha_fin) public {
      m_decimals = 18;
      contribution_counter = 0;
      m_project_valid = false;
      m_beneficiary_valid = false;
      m_closed_round = false;
      ///
      cnv = CNV(cnv_addr);
      oraculo_precio = OraculoPrecio(oraculo_precio_addr);
      ///
      m_beneficiario = beneficiario;
      emit beneficiarioSet(m_beneficiario);
      m_total_supply = cant_acciones * 10**uint(m_decimals);
      balances[owner] = m_total_supply; // Sets all the tokens in the owners balance
      emit cantAccionesSet(m_total_supply);
      m_symbol = symbol;
      emit symbolSet(symbol);
      m_monto = monto;
      emit montoSet(m_monto);
      m_monto_max = monto_max;
      emit montoMaxSet(m_monto_max);
      m_fecha_fin = fecha_fin;
      emit fechaSet(m_fecha_fin);
    }
    /* constructor(address beneficiario, string url, string nombre, uint monto, uint monto_max, string fecha, string descripcion, uint cuit) public {
      contribution_counter = 0;
      m_beneficiario = beneficiario;
      m_url = url;
      m_nombre = nombre;
      m_monto = monto;
      m_monto_max = monto_max;
      m_fecha_fin = fecha;
      m_descripcion = descripcion;
      m_cuit = cuit;
      m_project_valid = false;
      m_beneficiary_valid = false;
    } */

    function receiveFunds(uint uid) payable public {
      require(m_project_valid, "El proyecto debe ser validado por la CNV");
      require(m_beneficiary_valid, "El beneficiario del proyecto debe ser validado por la CNV");
      require(!m_closed_round, "La ronda debe estar abierta para poder contribuir.");
      require((address(this).balance + msg.value <= m_monto_max / oraculo_precio.getPrecio() * 10**uint(m_decimals)), "El monto del proyecto más el monto a tranferir supera el monto por supersuscripción.");
      /* Receive amount */
      if(msg.value > 0) {
          emit receivedFunds(msg.sender, msg.value);
      }
      /* File contribution*/
      contribution_counter++;
      m_contributions[contribution_counter] = Contribution(msg.sender, uid, msg.value);
      emit contributionFiled(msg.sender, uid, msg.value);
    }

    /*function getNombre() public returns (string) {
        return m_nombre;
    }*/

    /* Setea el totalSupply de la SAS/proyecto */
    function setSymbol(string symbol) onlyowner public {
        m_symbol = symbol;
        emit symbolSet(symbol);
    }

    /* Setea el totalSupply de la SAS/proyecto */
    function setCantAcciones(uint cant) onlyowner public {
        m_total_supply = cant * 10**uint(m_decimals);
        balances[owner] = m_total_supply; // Sets all the tokens in the owners balance
        emit cantAccionesSet(cant);
    }

    /* Setea el beneficiario de la SAS/proyecto */
    function setBeneficiario(address beneficiario) onlyowner public {
        m_beneficiario = beneficiario;
        emit beneficiarioSet(m_beneficiario);
    }

    /* Setea el url de la SAS/proyecto */
    function setUrl(string url) onlyowner public {
        m_url = url;
        emit urlSet(m_url);
    }

    /* Setea el nombre de la SAS/proyecto */
    function setNombre(string nombre) onlyowner public {
        m_nombre = nombre;
        emit nombreSet(m_nombre);
    }

    /* Setea el monto de la SAS/proyecto */
    function setMonto(uint monto) onlyowner public {
        m_monto = monto;
        emit montoSet(m_monto);
    }

    /* Setea el monto max de la SAS/proyecto */
    function setMontoMax(uint monto_max) onlyowner public {
        m_monto_max = monto_max;
        emit montoMaxSet(m_monto_max);
    }

    /* Setea la fecha de la SAS/proyecto */
    function setFecha(uint fecha_fin) onlyowner public {
        m_fecha_fin = fecha_fin;
        emit fechaSet(m_fecha_fin);
    }

    /* Setea la descripcion de la SAS/proyecto */
    function setDescripcion(string descripcion) onlyowner public {
        m_descripcion = descripcion;
        emit descripcionSet(m_descripcion);
    }

    /* Setea el CUIT de la SAS/proyecto */
    function setCuit(uint cuit) onlyowner public {
        m_cuit = cuit;
        emit cuitSet(m_cuit);
    }

    function setCNVAddress(address cnv_addr) onlyowner public {
      cnv = CNV(cnv_addr);
    }

    function setProjectValidity() onlyowner public {
      m_project_valid = cnv.isProjectValid(address(this));
    }

    function setBeneficiaryValidity() onlyowner public {
      m_beneficiary_valid = cnv.isBeneficiaryValid(m_beneficiario);
    }

    function transfer(address to, uint tokens) public returns (bool success) {
      balances[owner] = balances[owner].sub(tokens); // WARNING: ERC20 dice, debería ser msg.sender, ponemos owner porque no sabemos si se mantiene el msg.sender entre closeRound y transfer
      balances[to] = balances[to].add(tokens);
      emit Transfer(owner, to, tokens);
      return true;
    }

    function balanceOf(address who) public view returns (uint balance) {
      return balances[who];
    }

    function calculateTokens(uint _wei) private view returns (uint tokens) {
      return _wei * m_total_supply / address(this).balance;
    }

    function closeRound() public returns (bool success) {
      require(!m_closed_round, "La ronda debe seguir abierta para poder realizar el cierre.");
      if(oraculo_precio.getPrecio() * address(this).balance / 10**uint(m_decimals) >= m_monto) { // Se alcanzó el monto esperado para el proyecto
        for (uint i = 1; i <= contribution_counter; i++) { // Repartimos tokens a los holders
          transfer(m_contributions[i]._from, calculateTokens(m_contributions[i]._amount)); // Los tokens los mandamos como el amount sin multiplicar por los decimales porque ya los estamos almacenando en wei al crear la contribución.
        }
        m_closed_round = true;
      } else if(now >= m_fecha_fin) { // Se alcanzó la fecha de cierre del proyecto y no se alcanzó el monto esperado
        for (uint j = 1; j <= contribution_counter; j++) { // Devolvemos la plata a los holders y cerramos la ronda
          m_contributions[j]._from.transfer(m_contributions[j]._amount); // En este caso, address.transfer es una llamada a transfer de solidity https://solidity.readthedocs.io/en/develop/units-and-global-variables.html#members-of-address-types
        }
        m_closed_round = true;
      }
      return m_closed_round;
    }

    /* Setea el uid de la SAS/proyecto */
    /* function setUid(uint uid) onlyowner public {
        m_uid = uid;
        emit uidSet(m_uid);
    } */

    /* TODO: Fill in function or get from frontend */
    /*function getUserId() private returns (uint) {
        return 1;
    }*/

    /* m_project_valid = cnv_addr.call(bytes4(keccak256("isProjectValid(address)")), address(this)); */
}
