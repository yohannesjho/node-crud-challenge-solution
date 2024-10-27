const express = require('express')
const bodyParser = require('body-parser');
const { v4: uuid } = require('uuid');
const app = express()

app.use(bodyParser.json());

let persons = [{
    id: '1',
    name: 'Sam',
    age: '26',
    hobbies: []    
}] //This is your in memory database

app.set('db', persons)
//TODO: Implement crud of person

//get all persons
app.get('/person',(req,res)=>{
    return res.status(200).json(persons)
})

//get specific person
app.get('/person/:id',(req,res)=>{
    const {id}=req.params
    const person = persons.find(p=>p.id === id)
    res.status(200).json(person)
})

//create new person
app.post('/person', (req, res) => {
    const { name, age, hobbies } = req.body;

    // Validate input
    if (!name || !age || !Array.isArray(hobbies)) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    if (typeof age !== 'number') {
        return res.status(400).json({ message: '"age" must be a number' });
    }

    const newPerson = {
        id: uuid(),
        name,
        age,
        hobbies
    };

    persons.push(newPerson);
    res.status(200).json(newPerson);  
});

//update  a person
app.put('/person/:id',(req,res)=>{
    const { id } = req.params;
    const { name, age, hobbies } = req.body;

    const personIndex = persons.findIndex(person => person.id === id);
    if (personIndex === -1) {
        return res.status(400).json({ message: 'Person not found' });
    }

    persons[personIndex] = { id, name, age, hobbies };
    res.status(200).json(persons[personIndex]);
})

//delete a person
app.delete('/person/:id', (req, res) => {
    const { id } = req.params;

    const personIndex = persons.findIndex(person => person.id === id);

    if (personIndex === -1) {
        return res.status(400).json({ message: 'Person not found' });
    }

    // Remove the person from the array
    persons.splice(personIndex, 1);

    res.status(200).json({ message: 'Person deleted successfully' });
});

//non existing user request handler
app.get('/person/:id', (req, res) => {
    const person = persons.find(p => p.id ===  req.params.id);
    if (!person) {
        return res.status(404).json({ message: 'User not found' });
    } 
    return  res.json(person);
   
});

//non existing endpoint handler
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});
if (require.main === module) {
    app.listen(3000)
}
module.exports = app;