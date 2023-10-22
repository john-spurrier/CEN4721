//code sampled from oracle tutorials: https://www.oracle.com/database/technologies/appdev/quickstartnodeonprem.html

const oracledb = require('oracledb');
const express = require('express');
const app = express();
const cors = require("cors");
const PORT = 3001;

// currently only implemented for searching by ingredients
function createQuery(ingredientsArray) {
  console.log("Entering createQuery()");
  let Query = 'SELECT * FROM RECIPES WHERE INGREDIENTS LIKE ';
  Query = Query.concat('\'%', ingredientsArray[0], '%\'');

  if(ingredientsArray.length > 1) {
    for(i = 1; i < ingredientsArray.length; i++) {
      Query = Query.concat(' OR INGREDIENTS LIKE \'%', ingredientsArray[i], '%\'');
    }
}

  return Query;
}

async function processQuery() {
  let connection;
  try {
    connection = await oracledb.getConnection({
        user: "Jordan.Insinger",
        password: "EncrFhPKjcpPV45gvRgvCvBi",
        connectionString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = oracle.cise.ufl.edu)(PORT = 1521))(CONNECT_DATA =(SID= orcl)))"
      });
    console.log("Successfully connected to Oracle Database");

    // SAMPLE HARDCODED QUERY
    arr = ['orange', 'celery'];
    const query = createQuery(arr);
    const result = await connection.execute(query);

    // CAPTURE RESULTS
    const data = result.rows;

    return data;

  } catch (err) {
    console.error(err);
    throw err; 
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

// testing connection from frontend to backend
async function processQuery(ingredients) {
  console.log("Entering processQuery: ", ingredients);
  let connection;
  try {
    connection = await oracledb.getConnection({
        user: "Jordan.Insinger",
        password: "EncrFhPKjcpPV45gvRgvCvBi",
        connectionString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = oracle.cise.ufl.edu)(PORT = 1521))(CONNECT_DATA =(SID= orcl)))"
      });
    console.log("Successfully connected to Oracle Database");

    // SAMPLE HARDCODED QUERY
    //arr = ['orange', 'celery'];
    const query = createQuery(ingredients);
    console.log("QUERY: ", query);
    const result = await connection.execute(query);

    // CAPTURE RESULTS
    const data = result.rows;
    return data;

  } catch (err) {
    console.error(err);
    throw err; 
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function main() {
  // Express listening for queries from frontend
  app.listen(PORT, ()=>{
  console.log("Server is Listening on Port ", PORT);
  })

  app.use(express.json());
  app.use(cors());

  app.post('/api/query', async (req, res) => {
      const ingredients = req.body;
      const results = await processQuery(ingredients);
      console.log("RESULTS: ", results);
      
      // THIS IS WHERE THE TABLE IS BEING SENT TO CLIENT SIDE
      res.json(results);
  })
  
// Commented out for testing

//==================== For manual Testing ========================//
  /*try {
    const recipesData = await processQuery();
    console.log(recipesData);

    // Here, you can process the recipesData variable as needed.
    // You can return it from your API endpoint or perform other operations.

  } catch (err) {
    console.error("An error occurred:", err);
    }*/

}
main();
