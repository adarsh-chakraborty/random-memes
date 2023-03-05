const fetch = require('node-fetch');
const fs = require('fs');

var fromReddit = async function (subredditname) {
  let response = await fetch(
    'https://www.reddit.com/r/' + subredditname + '/hot/.json?count=100'
  );
  let memeObject = await response.json();

  let finalMeme;
  let attempts = 0;

  while (!finalMeme && attempts < memeObject.data.children.length) {
    let tempPost = await memeObject.data.children[
      Math.floor(Math.random() * memeObject.data.children.length)
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
