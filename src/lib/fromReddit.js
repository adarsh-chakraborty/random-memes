const fetch = require('node-fetch');
const fs = require('fs');

function createRandomNumberGenerator() {
  let previousNumbers = {};

  function generateRandomNumber(identifier, max) {
    let min = 0;

    if (!previousNumbers[identifier]) {
      previousNumbers[identifier] = [];
    }

    if (previousNumbers[identifier].length === max) {
      previousNumbers[identifier] = [];
      console.log('Flushed previous numbers for identifier:' + identifier);
    }
    let randomNumber;
    do {
      randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (previousNumbers[identifier].includes(randomNumber));
    previousNumbers[identifier].push(randomNumber);
    console.log(previousNumbers);
    return randomNumber;
  }

  return generateRandomNumber;
}

const generateRandomNumber = createRandomNumberGenerator();

const fromReddit = async function (subredditname, groupId = '1234@g.us') {
  let response = await fetch(
    'https://www.reddit.com/r/' + subredditname + '/hot/.json?count=100'
  );
  let memeObject = await response.json();

  let finalMeme;
  let attempts = 0;

  const identifier = `R${groupId}_${subredditname}K`.toLowerCase();

  while (!finalMeme && attempts < memeObject.data.children.length) {
    let tempPost = await memeObject.data.children[
      generateRandomNumber(identifier, memeObject.data.children.length)
    ];

    const url = tempPost.data.url;
    if (
      url.includes('v.redd.it') ||
      url.includes('i.redd.it') ||
      url.includes('.jpg') ||
      url.includes('.png') ||
      url.includes('.gif') ||
      url.includes('.jpeg') ||
      url.includes('.webp') ||
      url.includes('.mp4') ||
      url.includes('.gifv')
    ) {
      finalMeme = tempPost;
    }
    attempts++;
    console.log(
      `Attempt ${attempts} of ${memeObject.data.children.length}...${url}`
    );
  }

  let meme = {
    image: finalMeme.data.url,
    category: finalMeme.data.link_flair_text,
    caption: finalMeme.data.title,
    permalink: finalMeme.data.permalink
  };

  return meme;
};

module.exports = {
  fromReddit: fromReddit
};
