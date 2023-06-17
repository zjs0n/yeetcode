// Import MongoDB driver
const { MongoClient } = require('mongodb');
// import the url
const config = require('./db-config.json');

// import the database directly to get the question
const easy_data = require('./database/problems_easy.json')
const medium_data = require('./database/problems_medium.json')
const hard_data = require('./database/problems_hard.json')

const { Language, getDefaultCode } = require('./helpers.js')

// connect to the DB
const connect = async () => {
  try {
    const conn = (await MongoClient.connect(
      config.url,
      { useNewUrlParser: true, useUnifiedTopology: true },
    )).db();
    console.log(`Connected to the database: ${conn.databaseName}`);
    return conn;
  } catch (err) {
    console.log(err);
    throw new Error('could not connect to the database');
  }
};

const getDefaultCodeMap = (problemId) => {
  // Get the problem.
  const total = easy_data.concat(medium_data, hard_data)
  const problemList = total.filter(problem => problem.problem_id == problemId);
  // Throw errors if unique problem cannot be identified.
  if (problemList.length == 0) {
    throw new Error('Could not find the problem specified by the problem ID.');
  } else if (problemList.length > 1) {
    throw new Error('Found multiple problems matching the unique problem ID.');
  }
  const problem = problemList[0];
  const defaultCodeMap = {};
  for (const item in Language) {
    defaultCodeMap[Language[item]] = getDefaultCode(problem, Language[item]);
  }

  console.log(defaultCodeMap)
  return defaultCodeMap;
};

module.exports = {
  connect,
  getDefaultCodeMap,
};
