const mongoose = require('mongoose');
const Football = require('./model/footballModel');

main().catch(err => console.log(err));

async function main() {
  mongoose.set('strictQuery',true)
  await mongoose.connect('mongodb://127.0.0.1:27017/football').then(()=>console.log("Database connected")).catch((err)=> console.log(err));

  // Add football entries
  const newFootballEntry = new Football({
    Team: 'Sample Team',
    "Games Played": 10,
    Win: 5,
    Draw: 3,
    Loss: 2,
    "Goals For": 15,
    "Goals Against": 10,
    Points: 18,
    Year: 2023
  });
  
  newFootballEntry.save()
    .then(savedFootball => {
      console.log('Football entry added:', savedFootball);
    })
    .catch(err => {
      console.error('Error adding football entry:', err);
    });
  
  // Find football entries
  Football.find({ year: 2023 })
    .then(foundFootballEntries => {
      console.log('Found football entries:', foundFootballEntries);
    })
    .catch(err => {
      console.error('Error finding football entries:', err);
    });
  
  // Update a football entry
  Football.findOneAndUpdate({ team: 'Sample Team' }, { $set: { points: 20 } }, { new: true })
    .then(updatedFootball => {
      console.log('Updated football entry:', updatedFootball);
    })
    .catch(err => {
      console.error('Error updating football entry:', err);
    });
  
  // Delete a football entry
  Football.findOneAndDelete({ team: 'Sample Team' })
    .then(deletedFootball => {
      console.log('Deleted football entry:', deletedFootball);
    })
    .catch(err => {
      console.error('Error deleting football entry:', err);
    });

}
