// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//administrar los permisos con escritura

contract GestorUsuarios {
    address public administrador;

    modifier soloAdminstrador() {
        require(
            msg.sender == administrador,
            "No estas autorizado a realizar esta accion"
        );

        _;
    }

    //registrar usuario
    constructor() {
        administrador = msg.sender;
    }

    struct usuario {
        bool registrado;
        string nombre;
    }

    mapping(address => usuario) private usuarios;

    function registrarUsuario(address _usuario, string memory _nombre)
        public
        soloAdminstrador
    {

        require(!usuarios[_usuario].registrado, "Usuario ya registrado");
        usuarios[_usuario] = usuario(true, _nombre);
    }

    function IsRegister(address _usuario) public view returns (bool) {
        return usuarios[_usuario].registrado;
    }

    function getUserName(address _usuario) public view returns (string memory) {
        return usuarios[_usuario].nombre;
    }


    function deleteUser(address _usuario) public soloAdminstrador  {
       require(usuarios[_usuario].registrado, "Usuario no esta Registrado");
       delete  usuarios[_usuario];
    }

}
