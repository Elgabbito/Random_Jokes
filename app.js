const fs = require('fs');
const axios = require('axios');

async function getJokes(searchTerm) {
  try {
    const response = await axios.get(`https://icanhazdadjoke.com/search?term=${searchTerm}`, {
      headers: { Accept: 'application/json' }
    });
    const jokes = response.data.results;

    if (jokes.length > 0) {
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)].joke;
      console.log('Random Joke:', randomJoke);

      fs.appendFile('jokes.txt', randomJoke + '\n', (err) => {
        if (err) {
          console.error('Error saving joke to file:', err);
        } else {
          console.log('Joke saved to jokes.txt');
        }
      });
    } else {
      console.log('No jokes found for the search term.');
    }
  } catch (error) {
    console.error('Error making API request:', error);
  }
}


if (process.argv.includes('leaderboard')) {

  fs.readFile('jokes.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading jokes.txt:', err);
    } else {
      const jokes = data.split('\n').filter(Boolean);
      const jokeCounts = {};

      jokes.forEach((joke) => {
        jokeCounts[joke] = (jokeCounts[joke] || 0) + 1;
      });

      const mostPopularJoke = Object.entries(jokeCounts).reduce((a, b) => (a[1] > b[1] ? a : b));
      console.log('Most Popular Joke:', mostPopularJoke[0]);
    }
  });
} else {

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter a search term: ', (searchTerm) => {
    getJokes(searchTerm);
    rl.close();
  });
}
