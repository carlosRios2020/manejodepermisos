document.addEventListener('DOMContentLoaded', async function () {
    let provider;
    let signer;
    let contract;
  
    const contractAddress = '0x9d896f4de4b8982488f151b076da9bf079f117c4'; // Dirección del contrato
    const contractABI = [
      {
        inputs: [
          {
            internalType: 'address',
            name: '_direccionGestorUsuarios',
            type: 'address',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        inputs: [],
        name: 'ObtenerRegistros',
        outputs: [
          {
            internalType: 'string[]',
            name: '',
            type: 'string[]',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'string',
            name: '_dato',
            type: 'string',
          },
        ],
        name: 'registrarDato',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
    ];
  
    // Función para conectar la billetera
    async function connectWallet() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send('eth_requestAccounts', []);
          signer = provider.getSigner();
          const address = await signer.getAddress();
  
          // Guardar la dirección en localStorage para mantener la conexión
          localStorage.setItem('walletAddress', address);
  
          document.getElementById('connectButton').textContent = 'Desconectar MetaMask';
          document.getElementById('accountAddress').textContent = `Conectado: ${address}`;
  
          contract = new ethers.Contract(contractAddress, contractABI, signer);
          console.log('Contrato inicializado correctamente');
        } catch (error) {
          console.error('Error al conectar MetaMask:', error);
          document.getElementById('accountAddress').textContent = 'Error al conectar MetaMask';
        }
      } else {
        alert('MetaMask no está instalado!');
      }
    }
  
    // Función para desconectar la billetera
    function disconnectWallet() {
      localStorage.removeItem('walletAddress');
      document.getElementById('connectButton').textContent = 'Conectar MetaMask';
      document.getElementById('accountAddress').textContent = 'Desconectado';
    }
  
    // Verificar si hay una conexión previa guardada
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress) {
      await connectWallet();
    }
  
    // Asignar eventos al botón de conectar/desconectar
    document.getElementById('connectButton').addEventListener('click', async () => {
      const isConnected = localStorage.getItem('walletAddress');
      if (isConnected) {
        disconnectWallet();
      } else {
        await connectWallet();
      }
    });
  
    // Función para registrar un nuevo dato
    document.getElementById('registerDataButton').addEventListener('click', async () => {
      const dataInput = document.getElementById('registerDataInput');
      const data = dataInput ? dataInput.value.trim() : null;
  
      if (data && contract) {
        try {
          // Intentar estimar el gas para ver si la transacción puede tener éxito
          const gasEstimate = await contract.estimateGas.registrarDato(data, {
            value: ethers.utils.parseEther('0.01'),
          });
  
          // Enviar la transacción con el gas estimado
          const tx = await contract.registrarDato(data, {
            value: ethers.utils.parseEther('0.01'),
            gasLimit: gasEstimate,
          });
          await tx.wait();
          document.getElementById('registerDataResult').textContent = `Dato registrado exitosamente.`;
  
          // Limpiar campo después de registrar el dato
          dataInput.value = '';
        } catch (error) {
          console.error('Error al registrar dato:', error);
          document.getElementById('registerDataResult').textContent = `Error: ${error.message}`;
        }
      } else {
        document.getElementById('registerDataResult').textContent = 'Por favor, introduce un dato válido.';
      }
    });
  
    // Función para obtener registros
    document.getElementById('getRecordsButton').addEventListener('click', async () => {
      if (contract) {
        try {
          const records = await contract.ObtenerRegistros();
          document.getElementById('getRecordsResult').textContent = `Registros: ${records.join(', ')}`;
        } catch (error) {
          console.error('Error al obtener registros:', error);
          document.getElementById('getRecordsResult').textContent = `Error: ${error.message}`;
        }
      }
    });
  });
  
  