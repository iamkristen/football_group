const express = require('express');
const router = express.Router();
const Football = require('../model/footballModel');

router.get('/', (req, res) => {
  res.send('Hello world');
});


//===== 1.5 Add a Query in a POST method of the REST API ======
router.post('/add', async (req, res) => {
    try {
      
      const team = new Football(req.body);
      const savedData = await team.save();
  
      if (!savedData) {
        return res.status(500).json({ success: false, error: "Failed to save data." });
      }
  
      res.status(201).json({ success: true, data: savedData });
    } catch (error) {
      console.error("Error saving data:", error);
      res.status(500).json({ success: false, error: "Internal server error." });
    }
  });



//===== 1.6 write Query in a separate POST method for updating a single record for a Given Team ======
router.post('/update/:id', async (req, res) => {
    const data = req.body;
    const id = req.params.id;
    try{
        const updatedData = await Football.findOneAndUpdate({"_id":id},data);
        if(!updatedData){
            res.json({success:false,error:"Query Failed."});
            return;
        }
        res.json({success:true,data:"Data updated successfully."});
    }catch(err){
        res.json({success:false,error:"Something Went Wrong."});
    }
});


//===== 1.7 It should also have an separate Get method to show total games Played, Draw and Won for the given year ======
router.get('/getdata-by-year/:year', async (req, res) => {
    const year = req.params.year;
    try{
        const getData = await Football.aggregate([
            {
              $match: { 
                Year: parseInt(year) }
            },
            {
              $group: {
                _id: null,
                totalGamesPlayed: { $sum: '$Games Played' },
                totalDraw: { $sum: '$Draw' },
                totalWin: { $sum: '$Win' }
              }
            }
          ]);
      
          if (getData === 0) {
            return res.json({ success:true,data:'No stats found for the year' });
          }
      
          return res.json({success:true, data: getData });
        } catch (error) {
          console.error('Error retrieving team statistics:', error);
          return res.json({ success:false,error:"Something Went Wrong." });
        }
});


//===== 1.8 It should also have an separate endpoint using POST method for deleting record for a given Team ======
router.post('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try{
        const data = await Football.findOneAndDelete({"_id":id});
        if(!data){
            res.json({success:false,error:"Query Failed."});
            return;
        }
        res.json({success:true,data:"Data deleted successfully."});
    }catch(err){
        res.json({success:false,error: "Something Went Wrong."});
    }
});


//===== 1.9 it should have an endpoint to having a Query to display first 10 record from the Football data base to display the all the Teams including all nine columns)) for match “won” greater than a given value entered by the user . the data should be displayed on browser. ======
router.get('/getdata', async (req, res) => {
    const {wonValue} = req.query;
    try{
        let data = undefined;
        if(wonValue>0){
            data = await Football.find({ Win: {$gt: wonValue} }).limit(10);
        }else{
            data = await Football.find();
        }
        if(!data){
            res.json({success:false, data:"Query Failed."});
        }
        res.json({success:true, data:data});
    }catch(err){
        res.json({success:false, data:"went wrong."});
    }
});


//===== 2.0 it should have an endpoint having a Query to display the all the Team (including all nine columns) where average “Goal For” for a given year entered by the user the data should be displayed on browser. ======
router.get('/teams-average-goals/:year', async (req, res) => {
  const year = parseInt(req.params.year);

  try {
    const result = await Football.aggregate([
      { $match: { Year: parseInt(year) } },
      {
        $group: {
          _id: null,
          averageGoalsFor: { $avg: '$Goals For' },
          teams: { $push: '$$ROOT' }, 
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No data found for the given year' });
    }

    // Send the result as JSON response
    res.json({ year, averageGoalsFor: result[0].averageGoalsFor, teams: result[0].teams });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});



module.exports = router;
