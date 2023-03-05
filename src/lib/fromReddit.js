const fetch = require('node-fetch');
const fs = require('fs');

var fromReddit = async function (subredditname) {
  let response = await fetch(
    'https://www.reddit.com/r/' + subredditname + '/hot/.json?count=100'
  );
  let memeObject = await response.json();
  let postID = await memeObject.data.children[
    Math.floor(Math.random() * memeObject.data.children.length)
  ];
  let meme = {
    image: postID.data.url,
    category: postID.data.link_flair_text,
    caption: postID.data.title,
    permalink: postID.data.permalink
  };

  return meme;
};

module.exports = {
  fromReddit: fromReddit
};
