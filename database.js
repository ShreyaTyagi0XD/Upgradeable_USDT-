const { ethers } = require('ethers');
const mysql = require('mysql2/promise');

// Configure your Ethereum provider and contract addresses
const provider = new ethers.providers.JsonRpcProvider('YOUR_ETHEREUM_RPC_URL');
const proxyAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

// MySQL database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'database',
};

//  Connect to MySQL database
async function connectToDatabase() {
  const connection = await mysql.createConnection(dbConfig);
  console.log('Connected to MySQL database');
  return connection;
}

// Insert transaction details into the database
async function insertTransaction(connection, from, to, amount) {
  const [rows] = await connection.execute(
    'INSERT INTO transactions (from_address, to_address, amount) VALUES (?, ?, ?)',
    [from, to, amount]
  );
  console.log(`Transaction inserted with ID: ${rows.insertId}`);
}

// Deploy the proxy contract and perform a transaction
async function deployAndTransfer() {
  const signer = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);
  const proxyContract = new ethers.Contract(proxyAddress, ['function transferToContract(address, uint256)'], signer);

  // Connect to the database
  const dbConnection = await connectToDatabase();

  try {
    // Perform a transaction using the proxy contract
    const toAddress = 'RECIPIENT_ADDRESS';
    const amount = ethers.utils.parseEther('1.0');
    const transaction = await proxyContract.transferToContract(toAddress, amount);

    // Insert transaction details into the database
    await insertTransaction(dbConnection, signer.address, toAddress, amount.toString());
  } catch (error) {
    console.error('Error during transaction:', error);
  } finally {
    // Close the database connection
    await dbConnection.end();
  }
}

// Run the script
deployAndTransfer();
