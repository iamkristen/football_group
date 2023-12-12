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
router.post('/update/:team', async (req, res) => {
    const data = req.body;
    const team = req.params.team;
    try{
        const updatedData = await Football.findOneAndUpdate({"Team":team},data);
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
                totalGamesPlayed: { $sum: '$GamesPlayed' },
                totalDraw: { $sum: '$Draw' },
                totalWin: { $sum: '$Win' }
              }
            }
          ]);
      
          if (getData === 0) {
            return res.json({ success:true,data:'No stats found for the year' });
          }
      
          return res.json({statistics: getData });
        } catch (error) {
          console.error('Error retrieving team statistics:', error);
          return res.json({ success:false,error:"Something Went Wrong." });
        }
});


//===== 1.8 It should also have an separate endpoint using POST method for deleting record for a given Team ======
router.post('/delete/:team', async (req, res) => {
    const team = req.params.team;
    try{
        const data = await Football.findOneAndDelete({"Team":team});
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
router.get('/get-avg-goal/:year', async (req, res) => {
    const year = req.params.year;
    try{
        const avgGoal = await Football.aggregate([
            {
              $match: { 
                Year: parseInt(year) }
            },
            {
              $group: {
                _id: '$Team',
                AvgGoal: { $avg: '$GoalsFor' },
                
              }
            }
          ]);
      
          if (avgGoal === 0) {
            return res.json({ success:true,data:'No data found for the year' });
          }
      
          const teamsData = await Football.find({
            Team: { $in: avgGoal.map(item => item._id) }, // Filter by teams from averageGoals result
            GoalsFor: { $gt: 0 }, // Ensures teams with non-zero 'goalsFor' are included
            Year: parseInt(year) // Filter by the given year
          });
      
          return res.json({success:true,data:teamsData });
        } catch (error) {
          console.error('Error retrieving team data:', error);
          return res.json({ success:false,error:"Something Went Wrong." });
        }
});

module.exports = router;
