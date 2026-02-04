// List of profane words to filter (basic list - expand as needed)
const profanityList = [
  'badword1', 'badword2', 'badword3' // Add actual words as needed
];

const profanityFilter = (req, res, next) => {
  const content = req.body.content?.toLowerCase() || '';
  
  const hasProfanity = profanityList.some(word => content.includes(word));
  
  if (hasProfanity) {
    return res.status(400).json({ 
      message: 'Your post contains inappropriate language. Please revise.' 
    });
  }
  
  next();
};

module.exports = profanityFilter;
