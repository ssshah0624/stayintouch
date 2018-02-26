var express = require('express');
var router = express.Router();

/* GET users listing. */

//Need to store the following in MONGO SOON!

var allCommunicationPreferenceOptions = ["I'll Text", "I'll Call",]
var allCommunicationFrequencyOptions = ["Every Day","Every Week","Every 2 Weeks","Every Month","Every 3 Months","Never"]
var groupHelper = ["Siblings", "Parents", "Children", "Grandparents", "Siblings-In-Laws", 'Parent-In-Laws', 'Uncles & Aunts', 'Cousins (1st)', "Cousins (2nd)", "Nieces & Nephews"]
var allGroups = []
for(let i=0; i<groupHelper.length;i++){
  let temp = {}
  temp.key=i,
  temp.group=groupHelper[i],
  temp.contacts = [],
  temp.communicationMethod = "I'll Text",
  temp.communicationFrequency = "Never"
  allGroups.push(temp)
}


router.get('/', function(req, res, next) {
  res.status(200).json(
    {allCommunicationPreferenceOptions: allCommunicationPreferenceOptions,
      allCommunicationFrequencyOptions: allCommunicationFrequencyOptions,
      allGroups: allGroups,
  })
});

module.exports = router;
