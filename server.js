const express = require ('express');
const server = express();
const mongoose = require('mongoose');
const Database = require('./database')
const Football = require('./model/footballModel')


server.listen(5000,()=>{
    console.log('Server running on Port:5000 ');
})


server.get("/",(req,res)=>{
    res.send("Hello world");
})

//===== 1.5 Add a Query in a POST method of the REST API ======
server.post("/add",async (req,res)=>{
    const data = req.body;
    const team =new Football(data);
    const savedData = await Football.save();
    if(!savedData){
        res.json({success:false,error:"Query Failed"});
        return;
    }
    res.json({success:true,data:savedData});
}
)


//===== 1.6 write Query in a separate POST method for updating a single record for a Given Team ======

server.post("/update/:team",async(req,res)=>{
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
})

//===== 1.7 It should also have an separate Get method to show total games Played, Draw and Won for the given year ======

server.get('/getdata-by-year/:year',async(req,res)=>{
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
    
})


//===== 1.8 It should also have an separate endpoint using POST method for deleting record for a given Team ======

server.post("/delete/:team",async(req,res)=>{
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
})


//===== 1.9 it should have an endpoint to having a Query to display first 10 record from the Football data base to display the all the Teams including all nine columns)) for match “won” greater than a given value entered by the user . the data should be displayed on browser. ======

server.get('/getdata',async(req,res)=>{
    const {wonValue} = req.query;
    // console.log(wonValue);
    try{
        const data = await Football.find({ Win: {$gt: wonValue} }).limit(10);
        if(!data){
            res.json({success:false, data:"Query Failed."});
        }
        res.json({success:true, data:data});
    }catch(err){
        res.json({success:false, data:"went wrong."});
    }
})



//===== 2.0 it should have an endpoint having a Query to display the all the Team (including all nine columns) where average “Goal For” for a given year entered by the user the data should be displayed on browser. ======

server.get('/get-avg-goal/:year',async(req,res)=>{
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
    
})
