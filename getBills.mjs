import fetch from 'node-fetch';

async function getBillData() {
  try {
    const query = `SELECT * FROM Bills;`;
    const response = await fetch(
      'https://second-petal-398210.ts.r.appspot.com/database',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: 'root',
          pass: 'root',
          db_name: 'plutus',
          query: query,
        }),
      }
    );
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error fetching data for housemate stuff:', error);
  }
}

// Export the function if needed
export { getBillData };