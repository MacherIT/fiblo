pragma solidity ^0.4.17;

import './mortal.sol';

contract ContratoSAS is mortal {
    /* Events */
    event contributionFiled(address indexed from, uint256 indexed uid, uint256 amount);
    event receivedFunds(address _from, uint256 _amount);
    event nombreSet(string nombre);
    event montoSet(uint256 monto);
    event fechaSet(string fecha);
    event descripcionSet(string descripcion);
    event cuitSet(uint cuit);

    struct Contribution {
        address _from;
        uint256 _uid;
        uint256 _amount;
    }

    uint contribution_counter;
    string  m_nombre;
    uint256 m_monto;
    string  m_fecha;
    string  m_descripcion;
    uint    m_cuit;

    mapping(uint => Contribution) m_contributions;

    function receiveFunds(uint uid) payable public {
        /* Receive amount */
        if(msg.value > 0) {
            emit receivedFunds(msg.sender, msg.value);
        }

        /* File contribution*/
        /*uint uid = getUserId();*/
        contribution_counter++;
        m_contributions[contribution_counter] = Contribution(msg.sender, uid, msg.value);
        emit contributionFiled(msg.sender, uid, msg.value);
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

    /* TODO: Fill in function or get from frontend */
    /*function getUserId() private returns (uint) {
        return 1;
    }*/

}
