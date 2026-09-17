import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import Busboy from "busboy";

const s3 = new S3Client({
  region: "ap-south-1",
});

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
});

const dynamoDB = DynamoDBDocumentClient.from(dynamoClient);

const BUCKET_NAME = "careerpilot-resumes-2026-yourname";
const TABLE_NAME = "CareerPilotAnalyses";

function parseMultipartForm(event) {
  return new Promise((resolve, reject) => {
    try {
      const headers = event.headers || {};

      const contentType =
        headers["content-type"] ||
        headers["Content-Type"];

      if (!contentType) {
        reject(new Error("Content-Type header is missing"));
        return;
      }

      const busboy = Busboy({
        headers: {
          "content-type": contentType,
        },
      });

      const fields = {};
      let resumeBuffer = null;
      let resumeFileName = "resume.pdf";

      busboy.on("field", (fieldname, value) => {
        fields[fieldname] = value;
      });

      busboy.on("file", (fieldname, file, info) => {
        const { filename } = info;

        resumeFileName = filename || "resume.pdf";

        const chunks = [];

        file.on("data", (chunk) => {
          chunks.push(chunk);
        });

        file.on("end", () => {
          if (fieldname === "resume") {
            resumeBuffer = Buffer.concat(chunks);
          }
        });
      });

      busboy.on("finish", () => {
        resolve({
          fields,
          resumeBuffer,
          resumeFileName,
        });
      });

      busboy.on("error", (error) => {
        reject(error);
      });

      let body = event.body || "";

      if (event.isBase64Encoded) {
        body = Buffer.from(body, "base64");
      } else {
        body = Buffer.from(body);
      }

      busboy.end(body);
    } catch (error) {
      reject(error);
    }
  });
}

export const handler = async (event) => {
  try {
    console.log("Received request");

    // Parse multipart/form-data from API Gateway
    const {
      fields,
      resumeBuffer,
      resumeFileName,
    } = await parseMultipartForm(event);

    const jobDescription = fields.jobDescription;

    // Validate resume
    if (!resumeBuffer || resumeBuffer.length === 0) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "Resume is required",
        }),
      };
    }

    // Validate job description
    if (!jobDescription || !jobDescription.trim()) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "Job description is required",
        }),
      };
    }

    console.log("Resume received:", resumeFileName);
    console.log("Resume size:", resumeBuffer.length);
    console.log("Job description received");

    // Upload resume to S3
    const s3Key = `resumes/${Date.now()}-${resumeFileName}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: resumeBuffer,
        ContentType: "application/pdf",
      })
    );

    console.log("Resume uploaded to S3:", s3Key);

    // Extract text from PDF
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(resumeBuffer),
    });

    const pdfDocument = await loadingTask.promise;

    let resumeText = "";

    for (
      let pageNumber = 1;
      pageNumber <= pdfDocument.numPages;
      pageNumber++
    ) {
      const page = await pdfDocument.getPage(pageNumber);
      const textContent = await page.getTextContent();

      resumeText +=
        textContent.items
          .map((item) => item.str)
          .join(" ") + "\n";
    }

    resumeText = resumeText.toLowerCase();

    // Skills used by CareerPilot
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
      "api",
    ];

    // Find skills in resume
    const resumeSkills = skills.filter((skill) =>
      resumeText.includes(skill)
    );

    // Find skills in job description
    const jdText = jobDescription.toLowerCase();

    const requiredSkills = skills.filter((skill) =>
      jdText.includes(skill)
    );

    // Match skills
    const matchedSkills = requiredSkills.filter((skill) =>
      resumeSkills.includes(skill)
    );

    const missingSkills = requiredSkills.filter(
      (skill) => !resumeSkills.includes(skill)
    );

    // Calculate readiness score
    const score =
      requiredSkills.length === 0
        ? 0
        : Math.round(
            (matchedSkills.length / requiredSkills.length) * 100
          );

    // Personalized roadmap
    const roadmap = {};

    if (missingSkills.includes("aws")) {
      roadmap.aws = [
        "Learn AWS fundamentals",
        "Learn EC2 and S3",
        "Learn Lambda and API Gateway",
        "Build a small AWS project",
      ];
    }

    if (missingSkills.includes("docker")) {
      roadmap.docker = [
        "Learn Docker basics",
        "Learn images and containers",
        "Dockerize a Node.js application",
      ];
    }

    if (missingSkills.includes("sql")) {
      roadmap.sql = [
        "Learn SELECT and WHERE",
        "Learn JOINs",
        "Practice GROUP BY and subqueries",
      ];
    }

    if (missingSkills.includes("python")) {
      roadmap.python = [
        "Learn Python fundamentals",
        "Practice functions and data structures",
        "Build a small Python project",
      ];
    }

    if (missingSkills.includes("react")) {
      roadmap.react = [
        "Learn React components",
        "Learn props and state",
        "Build a React project",
      ];
    }

    if (missingSkills.includes("javascript")) {
      roadmap.javascript = [
        "Learn JavaScript fundamentals",
        "Practice arrays and objects",
        "Learn async JavaScript",
      ];
    }

    if (Object.keys(roadmap).length === 0) {
      roadmap.general = [
        "Review the skills required for the target role",
        "Practice coding problems",
        "Build and deploy projects",
        "Prepare for technical interviews",
      ];
    }

    // Interview questions
    const interviewQuestions = [];

    if (missingSkills.includes("aws")) {
      interviewQuestions.push(
        "What is AWS and what are EC2, S3 and Lambda used for?"
      );
    }

    if (missingSkills.includes("docker")) {
      interviewQuestions.push(
        "What is Docker and why is it useful?"
      );
    }

    if (missingSkills.includes("sql")) {
      interviewQuestions.push(
        "What is the difference between INNER JOIN and LEFT JOIN?"
      );
    }

    if (missingSkills.includes("python")) {
      interviewQuestions.push(
        "What are lists and tuples in Python?"
      );
    }

    if (missingSkills.includes("react")) {
      interviewQuestions.push(
        "What are props and state in React?"
      );
    }

    if (interviewQuestions.length === 0) {
      interviewQuestions.push(
        "Explain one of your projects and the technical decisions you made."
      );

      interviewQuestions.push(
        "Explain how you would design a REST API."
      );

      interviewQuestions.push(
        "What happens when you enter a URL in a browser?"
      );
    }

    // Strengths
    const strengths =
      matchedSkills.length > 0
        ? matchedSkills.map(
            (skill) => `You have experience with ${skill}.`
          )
        : ["No strong skill matches were detected."];

    // Gap explanation
    const gapExplanation =
      missingSkills.length > 0
        ? `Your resume is missing ${missingSkills.length} skill(s) mentioned in the job description: ${missingSkills.join(
            ", "
          )}.`
        : "Your resume contains all the skills detected in the job description.";

    // Save analysis to DynamoDB
    const analysisId = `${Date.now()}`;

    const dynamoItem = {
      analysisId,
      targetRole: "Software Development Engineer",
      score,
      matchedSkills,
      missingSkills,
      strengths,
      gapExplanation,
      roadmap,
      interviewQuestions,
      s3Key,
      createdAt: new Date().toISOString(),
    };

    await dynamoDB.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: dynamoItem,
      })
    );

    console.log(
      "Analysis saved to DynamoDB:",
      analysisId
    );

    // Return result
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        analysisId,
        score,
        matchedSkills,
        missingSkills,
        strengths,
        gapExplanation,
        roadmap,
        interviewQuestions,
      }),
    };
  } catch (error) {
    console.error(
      "CareerPilot Lambda error:",
      error
    );

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Analysis failed",
        message: error.message,
      }),
    };
  }
};