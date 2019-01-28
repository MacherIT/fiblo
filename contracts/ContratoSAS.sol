pragma solidity ^0.4.17;

import './mortal.sol';
import './CNV.sol';

contract ContratoSAS is mortal {

    CNV cnv;

    /* Events */
    event contributionFiled(address indexed from, uint256 indexed uid, uint256 amount);
    event receivedFunds(address _from, uint256 _amount);
    event beneficiarioSet(address beneficiario);
    event urlSet(string url);
    event nombreSet(string nombre);
    event montoSet(uint256 monto);
    event montoMaxSet(uint256 monto_max);
    event fechaSet(string fecha);
    event descripcionSet(string descripcion);
    event cuitSet(uint cuit);
    /* event uidSet(uint uid); */

    struct Contribution {
        address _from;
        uint256 _uid;
        uint256 _amount;
    }

    uint public    contribution_counter;
    address public m_beneficiario;
    string public  m_url;
    string public  m_nombre;
    uint256 public m_monto;
    uint256 public m_monto_max;
    string public  m_fecha;
    string public  m_descripcion;
    uint public    m_cuit;
    bool public    m_project_valid;
    bool public    m_owner_valid;
    /* uint public    m_uid; */

    mapping(uint => Contribution) m_contributions;

    constructor() public {
      contribution_counter = 0;
      m_project_valid = false;
      m_owner_valid = false;
    }
    /* constructor(address beneficiario, string url, string nombre, uint256 monto, uint256 monto_max, string fecha, string descripcion, uint cuit) public {
      contribution_counter = 0;
      m_beneficiario = beneficiario;
      m_url = url;
      m_nombre = nombre;
      m_monto = monto;
      m_monto_max = monto_max;
      m_fecha = fecha;
      m_descripcion = descripcion;
      m_cuit = cuit;
      m_project_valid = false;
      m_owner_valid = false;
    } */

    function receiveFunds(uint uid) payable public {
        /* Receive amount */
        if(msg.value > 0) {
            emit receivedFunds(msg.sender, msg.value);
        }
        /* File contribution*/
        contribution_counter++;
        m_contributions[contribution_counter] = Contribution(msg.sender, uid, msg.value);
        emit contributionFiled(msg.sender, uid, msg.value);

        m_nombre = 'Pepe';
    }

    /*function getNombre() public returns (string) {
        return m_nombre;
    }*/

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
    function setMonto(uint256 monto) onlyowner public {
        m_monto = monto;
        emit montoSet(m_monto);
    }

    /* Setea el monto max de la SAS/proyecto */
    function setMontoMax(uint256 monto_max) onlyowner public {
        m_monto_max = monto_max;
        emit montoMaxSet(m_monto_max);
    }

    /* Setea la fecha de la SAS/proyecto */
    function setFecha(string fecha) onlyowner public {
        m_fecha = fecha;
        emit fechaSet(m_fecha);
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
