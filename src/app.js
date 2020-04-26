const express = require("express");
const cors = require("cors");
const {uuid, isUuid} = require('uuidv4');

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use('/repositories/:id',validateId);


function validateId(request, response, next){
  const {id} = request.params;
  if(!isUuid(id)){
    return response.status(400).json({error : "invalid ID"});
  }
  if (repositories.find(repository => repository.id===id)===undefined){
    return response.status(400).json({error: "Repository doesn't exist"});
  }
  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const {title, techs, url } = request.body;
  const repository ={
    title,
    techs,
    url,
    id : uuid(),
    likes : 0
  }
  repositories.push(repository);
  console.log(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs} = request.body;
  const {id} = request.params;
 
  const index = repositories.findIndex(repo=>repo.id===id);

  const repository={
    title,
    url,
    techs,
    id,
    likes:repositories[index].likes
  }
  console.log(repository);
  repositories[index]= repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
 
  const index = repositories.findIndex(repo=>repo.id===id);

  repositories.splice(index,1);
  return response.status(204).send();

});

app.post("/repositories/:id/like",validateId, (request, response) => {
  const {id}= request.params;
  const index = repositories.findIndex(repo=>repo.id===id);

  repositories[index].likes++;
  return response.json(repositories[index]);
});

module.exports = app;
