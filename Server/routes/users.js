var express = require('express');
var router = express.Router();

/* GET users listing. */

//Need to store the following in MONGO SOON!

var allCommunicationPreferenceOptions = ["I'll Text", "I'll Call",]
var allCommunicationFrequencyOptions = ["Every Day","Every Week","Every 2 Weeks","Every Month","Every 3 Months","Never"]
var groupHelper = ["Siblings", "Parents", "Children", "Grandparents", "Siblings-In-Laws", 'Parent-In-Laws', 'Uncles & Aunts', 'Cousins (1st)', "Cousins (2nd)", "Nieces & Nephews"]
var allGroups = []
var groupsImPartOf = []
var groupsImNotPartOf = [...groupHelper]

for(let i=0; i<groupHelper.length;i++){
  let temp = {}
  temp.key=i,
  temp.group=groupHelper[i],
  temp.contacts = [],
  temp.communicationMethod = "I'll Text",
  temp.communicationFrequency = "Never"
  allGroups.push(temp)
}

router.post('/addcategory', function(req, res, next) {
  console.log("Adding category:",req.body.category.item)
  groupsImPartOf.push(req.body.category)
  groupsImNotPartOf.splice(groupsImNotPartOf.indexOf(req.body.category.item),1)

  res.status(200).json({
    groupsImPartOf:groupsImPartOf,
    groupsImNotPartOf:groupsImNotPartOf,
  })
});

router.post('/removecategory', function(req, res, next) {
  console.log("Removing category:",req.body.category.item)
  groupsImNotPartOf.push(req.body.category)
  groupsImPartOf.splice(groupsImPartOf.indexOf(req.body.category.item),1)

  res.status(200).json({
    groupsImPartOf:groupsImPartOf,
    groupsImNotPartOf:groupsImNotPartOf,
  })
});

router.post('/addcontacttogroup', function(req, res, next) {
  console.log("Adding contact to group:",req.body.contact, req.body.group)
  console.log(allGroups)

  //Remove contact logic
  allGroups.filter(x => x.group === req.body.group)[0].contacts.push(req.body.contact)

  res.status(200).json({
    contacts: allGroups.filter(x => x.group === req.body.group)[0].contacts,
  })
});

router.post('/removecontactfromgroup', function(req, res, next) {

  //Remove contact logic
  allGroups.filter(x => x.group === req.body.group)[0].contacts = allGroups.filter(x => x.group === req.body.group)[0].contacts.filter(x => x.key !== req.body.contact.key)

  res.status(200).json({
    contacts: allGroups.filter(x => x.group === req.body.group)[0].contacts,
  })
});


router.get('/', function(req, res, next) {
  res.status(200).json(
    {allCommunicationPreferenceOptions: allCommunicationPreferenceOptions,
      allCommunicationFrequencyOptions: allCommunicationFrequencyOptions,
      allGroups: allGroups,
      groupsImPartOf: groupsImPartOf,
      groupsImNotPartOf: groupsImNotPartOf,
  })
});

module.exports = router;
