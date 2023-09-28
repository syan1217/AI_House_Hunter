// use express module: web framework
const express = require("express");
//use ejs module: HTML framework:
const ejs = require("ejs");

//create an instance to allow us to use functionality of express framework.
const app = express();
//use body-parser module to pass the parameter from UI side to server side.
const bodyParser = require("body-parser");

//import ejs with creating a views folder, and we will place all UI related files in this 'views' folder.
app.set('view engine', 'ejs');

//set up a static folder, we can name it as 'public'. We can put any static files like css or images here.
app.use(express.static("public"));
//to extract data from client side in UI to server side in certain format,usually combine with req.body.
app.use(bodyParser.urlencoded({extended:true}));

//import module:
const promptQuery = require(__dirname + "/public/OpenAI/promptQuery.js");

//give a response back to the client when a client log into your URL path created from your server:
app.get("/",function(req,res){
  // res.render is a method in the Express.js web framework that renders an EJS template and sends the resulting HTML markup to the client.
  res.render("Home");
})


//request product pages:
app.get("/Product",function(req,res){
  res.render("Product",{ results: [] });
})

//post prompt pages:
app.post("/PromptPage", async function(req, res) {
  let promptMsg = req.body.prompt;

  promptMsg = promptMsg + ' Please provide supporting data in a table format followed by an explanation of the data. Ensure the table starts and ends with pipe characters ("|").';

  try {
    let answer = await promptQuery.processPrompt(promptMsg);
    const answerArray = answer.split('\n').filter(item => item.trim() !== "" && !item.includes('---'));

    let tableContent = [];
    let explanations = [];
    let isTable = true; // Start by assuming it's table content first

    // Organize the content into table and explanations
    for(let line of answerArray) {
      if(line.startsWith('|')) {
        if(isTable) {
          tableContent.push(line);
        } else {
          // Reset to capture potential tables after explanations
          isTable = true;
          tableContent.push(line);
        }
      } else {
        isTable = false;
        explanations.push(line);
      }
    }

    res.json({
      type: 'tableWithExplanation',
      table: tableContent,
      explanations: explanations
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});


//start the server and assign a port or heroku:
app.listen(process.env.PORT || 3050, function(){
    console.log("Server started on port 3050")
});
