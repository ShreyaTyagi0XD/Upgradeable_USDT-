const express = require('express');
const { Web3 } = require('web3');
const mysql = require('mysql2');
const { EventEmitter } = require('events');
const { TIMESTAMP } = require('mysql/lib/protocol/constants/types');

const app = express();
const PORT = 3306;
const myEventEmitter = new EventEmitter();
myEventEmitter.setMaxListeners(2);

// Connect to Avalanche Fuji C-Chain (testnet)
const web3 = new Web3('https://rpc.ankr.com/avalanche_fuji-c');

// Connect to MySQL database
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'transaction_details',
  port: 8090,
});

module.exports = connection;

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
  console.log('Connected to MySQL');
});

app.use(express.json());

// API endpoint to handle transfer function
app.post('/transfer', async (req, res) => {
  const { transactionHash } = '0x885f641939fd6230e6d27ece7d339c9e07c1fb6401258becd763759b72116c20';

  // Fetch transaction details from Avalanche using the provided transaction hash
  const transactionDetails = await getTransactionDetails(transactionHash);

  // Insert transaction details into the database
  insertTransactionDetails(transactionDetails);

  res.json({ success: true, message: 'Transaction details inserted successfully' });
});

// Function to get transaction details from Avalanche using the transaction hash
async function getTransactionDetails(transactionHash) {
  const avaxScanUrl = `https://testnet.avascan.info/blockchain/c/tx/${transactionHash}`;

  try {
    const avaxScanResponse = await axios.get(avaxScanUrl);
    return avaxScanResponse.data;
  } catch (error) {
    console.error('Error fetching transaction details from AVAXScan:', error);
    throw new Error('Error fetching transaction details from AVAXScan');
  }
}

// Function to insert transaction details into the MySQL database
function insertTransactionDetails(transactionDetails) {
  const { sender, receiver, amount, timestamp } = transactionDetails;

  const insertQuery = `
    INSERT INTO transactions (\`Sender Address\`, \`Receiver Address\`, Amount, Timestamp)
    VALUES (?, ?, ?, ?)
  `;

  const values = [sender, receiver, amount, timestamp];
  connection.query(insertQuery, values, (err) => {
    if (err) {
      console.error('Error inserting into the database:', err);
      throw new Error('Error inserting into the database');
    }
    console.log('Transaction details inserted into the database');
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
