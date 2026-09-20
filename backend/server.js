const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const {
  DynamoDBClient
} = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  PutCommand
} = require("@aws-sdk/lib-dynamodb");
const {
  S3Client,
  PutObjectCommand
} = require("@aws-sdk/client-s3");

const app = express();

app.use(cors());
app.use(express.json());


// AWS S3 CONFIGURATION


const s3 = new S3Client({
  region: "ap-south-1"
});

const BUCKET_NAME = "careerpilot-resumes-2026-yourname";

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1"
});

const dynamoDB = DynamoDBDocumentClient.from(dynamoClient);

const TABLE_NAME = "CareerPilotAnalyses";


// MULTER CONFIGURATION


// Store uploaded PDF temporarily in memory
const upload = multer({
  storage: multer.memoryStorage()
});



// TEST API


app.get("/", (req, res) => {
  res.json({
    message: "CareerPilot backend is working!"
  });
});



// ANALYZE RESUME API


app.post(
  "/api/analyze",
  upload.single("resume"),
  async (req, res) => {

    try {

      // Check resume
      if (!req.file) {
        return res.status(400).json({
          error: "Resume is required"
        });
      }


      
      const jobDescription = req.body.jobDescription;

      if (!jobDescription) {
        return res.status(400).json({
          error: "Job description is required"
        });
      }


      
      // UPLOAD RESUME TO AMAZON S3
      

      const fileName =
        `${Date.now()}-${req.file.originalname}`;

      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: `resumes/${fileName}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      };

      await s3.send(
        new PutObjectCommand(uploadParams)
      );

      console.log(
        `Resume uploaded to S3: resumes/${fileName}`
      );


      
      // READ RESUME PDF
      

      const pdfData = await pdfParse(req.file.buffer);

      const resumeText =
        pdfData.text.toLowerCase();


      
      // JOB DESCRIPTION
      

      const jdText =
        jobDescription.toLowerCase();


      
      // SKILLS WE WANT TO CHECK
      

      const skills = [
        "javascript",
        "react",
        "node.js",
        "express",
        "mongodb",
        "sql",
        "python",
        "java",
        "aws",
        "docker",
        "git",
        "github",
        "html",
        "css",
        "rest api",
        "api"
      ];


      
      // FIND SKILLS IN RESUME
      

      const resumeSkills = skills.filter(skill =>
        resumeText.includes(skill)
      );


      
      // FIND REQUIRED SKILLS
      

      const requiredSkills = skills.filter(skill =>
        jdText.includes(skill)
      );


      
      // MATCHED AND MISSING SKILLS
      

      const matchedSkills = requiredSkills.filter(skill =>
        resumeSkills.includes(skill)
      );

      const missingSkills = requiredSkills.filter(skill =>
        !resumeSkills.includes(skill)
      );


      
      // CALCULATE MATCH SCORE
      

      let score = 0;

      if (requiredSkills.length > 0) {

        score = Math.round(
          (matchedSkills.length / requiredSkills.length) * 100
        );

      }


      
      // PERSONALIZED ROADMAP
      

      const roadmap = missingSkills.map(skill => {

        const roadmapDetails = {

          aws: {
            skill: "AWS",
            learn: "S3, EC2, Lambda, IAM",
            practice:
              "Deploy a simple Node.js application on AWS",
            goal:
              "Build one cloud deployment project"
          },

          docker: {
            skill: "Docker",
            learn:
              "Images, containers, Dockerfile, Docker Compose",
            practice:
              "Containerize your Node.js backend",
            goal:
              "Run your backend inside a Docker container"
          },

          sql: {
            skill: "SQL",
            learn:
              "SELECT, JOIN, GROUP BY, subqueries",
            practice:
              "Solve SQL problems using a sample database",
            goal:
              "Become comfortable writing database queries"
          },

          python: {
            skill: "Python",
            learn:
              "Variables, functions, lists, dictionaries, OOP",
            practice:
              "Build a small Python project",
            goal:
              "Develop basic Python programming skills"
          },

          react: {
            skill: "React",
            learn:
              "Components, props, state, hooks",
            practice:
              "Build a small React application",
            goal:
              "Create an interactive frontend"
          },

          javascript: {
            skill: "JavaScript",
            learn:
              "Functions, arrays, objects, async/await",
            practice:
              "Build small JavaScript applications",
            goal:
              "Strengthen JavaScript fundamentals"
          }

        };


        return roadmapDetails[skill] || {

          skill: skill,

          learn:
            `Learn the fundamentals of ${skill}`,

          practice:
            `Build a small project using ${skill}`,

          goal:
            `Develop practical experience with ${skill}`

        };

      });


      
      // INTERVIEW QUESTIONS
      

      const interviewQuestions = [];


      if (missingSkills.includes("aws")) {

        interviewQuestions.push(

          "What is Amazon EC2 and when would you use it?",

          "What is Amazon S3 and how is it different from a database?"

        );

      }


      if (missingSkills.includes("docker")) {

        interviewQuestions.push(

          "What is Docker and why is it useful for application deployment?",

          "What is the difference between a Docker image and a Docker container?"

        );

      }


      if (missingSkills.includes("sql")) {

        interviewQuestions.push(

          "What is the difference between INNER JOIN and LEFT JOIN?",

          "How would you find duplicate records in a SQL table?"

        );

      }


      if (missingSkills.includes("python")) {

        interviewQuestions.push(

          "What are lists and dictionaries in Python?",

          "Explain the concept of object-oriented programming in Python."

        );

      }


      if (missingSkills.includes("react")) {

        interviewQuestions.push(

          "What are React components?",

          "What is the difference between props and state in React?"

        );

      }


      
      // STRENGTHS
      

      const strengths = [];


      if (matchedSkills.includes("javascript")) {

        strengths.push(
          "Strong JavaScript programming foundation."
        );

      }


      if (
        matchedSkills.includes("react") &&
        matchedSkills.includes("node.js")
      ) {

        strengths.push(
          "Experience with both frontend and backend development."
        );

      }


      if (
        matchedSkills.includes("express") &&
        matchedSkills.includes("rest api")
      ) {

        strengths.push(
          "Experience building backend services and REST APIs."
        );

      }


      if (
        matchedSkills.includes("git") ||
        matchedSkills.includes("github")
      ) {

        strengths.push(
          "Familiarity with Git and GitHub for version control."
        );

      }


      if (strengths.length === 0) {

        strengths.push(
          "Your resume demonstrates relevant technical skills for the target role."
        );

      }


      
      // GAP EXPLANATION
      

      const gapExplanation =
        missingSkills.map((skill) => {

          const explanations = {

            aws:
              "AWS is important because many modern applications are deployed and operated using cloud infrastructure and services.",

            docker:
              "Docker is important because it helps developers package applications consistently and simplify deployment.",

            sql:
              "SQL is important because many software applications need reliable storage, querying, and management of structured data.",

            python:
              "Python is widely used for backend development, automation, data processing, and AI-related applications.",

            react:
              "React is important for building modern, interactive web interfaces.",

            javascript:
              "JavaScript is a core technology for modern web application development."

          };


          return {

            skill,

            explanation:
              explanations[skill] ||
              `${skill} is an important skill mentioned in the target job description.`

          };

        });
        
// SAVE ANALYSIS TO DYNAMODB


const analysisId = `${Date.now()}`;

const dynamoItem = {
  analysisId,
  targetRole: "Software Development Engineer",
  score,
  matchedSkills,
  missingSkills,
  roadmap,
  interviewQuestions,
  createdAt: new Date().toISOString()
};

await dynamoDB.send(
  new PutCommand({
    TableName: TABLE_NAME,
    Item: dynamoItem
  })
);

console.log(
  `Analysis saved to DynamoDB: ${analysisId}`
);
        




      
      // LOG RESULTS
      

      console.log(
        "Resume skills:",
        resumeSkills
      );

      console.log(
        "Required skills:",
        requiredSkills
      );

      console.log(
        "Matched skills:",
        matchedSkills
      );

      console.log(
        "Missing skills:",
        missingSkills
      );


      
      // SEND RESPONSE
      

      res.json({

        analysisId,

        score,

        matchedSkills,

        missingSkills,

        strengths,

        gapExplanation,

        roadmap,

        interviewQuestions

      });


    } catch (error) {

      console.error(
        "Error processing resume:",
        error
      );

      res.status(500).json({

        error:
          "Failed to process resume"

      });

    }

  }
);



// START SERVER


app.listen(5000, () => {

  console.log(
    "CareerPilot backend running on http://localhost:5000"
  );

});