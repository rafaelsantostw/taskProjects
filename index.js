const express = require('express');

const server = express();

server.use(express.json());

const projectsData = [{
  "id": "1",
  "title": "New Project",
  "tasks": []
}];

server.use((req, res, next) => {
  var request = req.url;
  
  console.log(`Method => ${req.method} | URL => ${request} `);
  return next();
});

//Middleware to validate if project ID exists
function validateIdExists (req, res, next) {
  const { id } = req.params;
  const resultId = projectsData.find(projects => projects.id === id);

  if(!resultId){
    return res.status(400).json({ error: "Id not exists" })
  }

  return next();
};

//List all projects
server.get('/projects', (req, res) => {

  return res.json(projectsData);
});

//Create new project
server.post('/projects', (req, res) => {
  const { id, title, tasks } = req.body;

  var newProject = { 
    id, 
    title,
    tasks
  }

  projectsData.push(newProject);

  return res.json(projectsData);
});

//Update title from obj by param id
server.put('/projects/:id', validateIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const result = projectsData.find(projects => projects.id === id);
  
  result.title = title;

  return res.json(result);
});

//Remove project by id
server.delete('/projects/:id', validateIdExists, (req, res) => {
  const { id } = req.params;

  var removeIndex = projectsData.findIndex(projects => projects.id == id);
  
  projectsData.splice(removeIndex, 1);
  
  return res.json({ Message: "Project succefull removed" });

});

//Insert a new task to project by id param
server.post('/projects/:id/tasks', validateIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const result = projectsData.find(projects => projects.id === id);

  result.tasks.push(title);

  return res.json(result);

});


server.listen(3000);