import { useState } from "react";
import "./App.css";

function App() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resume || !jobDescription) {
      alert("Please upload your resume and enter a job description.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);

      const response = await fetch(
        "https://369coopgx0.execute-api.ap-south-1.amazonaws.com/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong.");
        return;
      }

      setAnalysis(data);

      setTimeout(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);

    } catch (error) {
      console.error(error);
      alert("Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      {/*  NAVBAR  */}

      <nav className="navbar">

        <div className="logo">
          Career<span>Pilot</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#analyzer">Analyze</a>
          <a href="#how">How It Works</a>
          <a href="#about">About</a>
        </div>

      </nav>


      {/*  HERO  */}

      <section className="hero" id="home">

        <div className="hero-content">

          <div className="badge">
            AI-Powered Career Assistant
          </div>

          <h1>
            Know Your Gap.
            <br />
            <span>Know Your Next Step.</span>
          </h1>

          <p>
            Upload your resume, paste your target job description,
            and discover exactly what skills you need to become job-ready.
          </p>

          <button
            className="hero-button"
            onClick={() =>
              document
                .getElementById("analyzer")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Analyze My Career →
          </button>

        </div>

      </section>


      {/*  ANALYZER */}

      <section className="analyzer" id="analyzer">

        <div className="section-title">

          <h2>
            Analyze Your Job Readiness
          </h2>

          <p>
            Give us your resume and target job. CareerPilot
            will identify your strengths and skill gaps.
          </p>

        </div>


        <div className="analyzer-card">

          {/* Resume Upload */}

          <div className="input-section">

            <label>
              1. Upload Your Resume
            </label>

            <div className="upload-box">

              <div className="upload-icon">
                📄
              </div>

              <h3>
                {resume
                  ? resume.name
                  : "Upload your resume"}
              </h3>

              <p>
                PDF files are recommended
              </p>

              <input
                type="file"
                accept=".pdf"
                onChange={(event) => {
                  const file = event.target.files[0];
                  setResume(file);
                }}
              />

            </div>

          </div>


          {/* Job Description */}

          <div className="input-section">

            <label>
              2. Enter Target Job Description
            </label>

            <textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(event) =>
                setJobDescription(event.target.value)
              }
            />

          </div>


          {/* Analyze Button */}

          <button
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading
              ? "Analyzing..."
              : "Analyze My Readiness"}
          </button>

        </div>

      </section>


      {/*  RESULTS  */}

      {analysis && (

        <section
          className="results-section"
          id="results"
        >

          <h2>
            🎯 Your CareerPilot Analysis
          </h2>


          {/*  SCORE */}

          <div className="score-card">

            <h3>
              Readiness Score
            </h3>

            <div className="score">
              {analysis.score}%
            </div>

            <div className="score-bar">
              <div
                className="score-bar-fill"
                style={{
                  width: `${analysis.score}%`
                }}
              ></div>
            </div>

            <p>
              This score is based on the skills demonstrated
              in your resume compared with the requirements
              in the target job description.
            </p>

          </div>


          {/*  SKILLS  */}

          <div className="results-grid">

            {/* Matched Skills */}

            <div className="result-card">

              <h3>
                ✅ Matched Skills
              </h3>

              {analysis.matchedSkills &&
              analysis.matchedSkills.length > 0 ? (

                <ul>

                  {analysis.matchedSkills.map(
                    (skill, index) => (

                      <li key={index}>
                        {skill}
                      </li>

                    )
                  )}

                </ul>

              ) : (

                <p>
                  No matching skills found.
                </p>

              )}

            </div>


            {/* Missing Skills */}

            <div className="result-card">

              <h3>
                ❌ Missing Skills
              </h3>

              {analysis.missingSkills &&
              analysis.missingSkills.length > 0 ? (

                <ul>

                  {analysis.missingSkills.map(
                    (skill, index) => (

                      <li key={index}>
                        {skill}
                      </li>

                    )
                  )}

                </ul>

              ) : (

                <p>
                  No major skill gaps found.
                </p>

              )}

            </div>

          </div>


{/* ROADMAP  */}

<div className="roadmap-card">

  <h3>
    🗺️ Personalized Roadmap
  </h3>

  <p className="roadmap-subtitle">
    Follow these steps to improve the skills
    required for your target job.
  </p>

  <div className="roadmap-list">

    {analysis.roadmap &&
    Object.keys(analysis.roadmap).length > 0 ? (

      Object.entries(analysis.roadmap).map(
        ([skill, steps], index) => (

          <div
            className="roadmap-item"
            key={skill}
          >

            <div className="roadmap-number">
              {index + 1}
            </div>

            <div className="roadmap-content">

              <h4>
                {skill.toUpperCase()}
              </h4>

              {Array.isArray(steps) ? (

                <ul>
                  {steps.map((step, stepIndex) => (
                    <li key={stepIndex}>
                      {step}
                    </li>
                  ))}
                </ul>

              ) : (

                <p>
                  {steps}
                </p>

              )}

            </div>

          </div>

        )
      )

    ) : (

      <div className="roadmap-item">

        <div className="roadmap-number">
          ✓
        </div>

        <div className="roadmap-content">

          <h4>
            No Major Skill Gaps
          </h4>

          <p>
            🎉 Your resume already demonstrates
            the major skills required for this job.
          </p>

          <p>
            Continue building projects and practicing
            technical interviews.
          </p>

        </div>

      </div>

    )}

  </div>

</div>

          {/*  INTERVIEW PREPARATION  */}

          {analysis.interviewQuestions &&
          analysis.interviewQuestions.length > 0 && (

            <div className="interview-section">

              <div className="interview-header">

                <div>

                  <h3>
                    🎤 Interview Preparation
                  </h3>

                  <p className="interview-subtitle">
                    Practice questions based on your skill gaps
                    and target job.
                  </p>

                </div>

                <div className="interview-badge">
                  {analysis.interviewQuestions.length} Questions
                </div>

              </div>


              <div className="interview-list">

                {analysis.interviewQuestions.map(
                  (question, index) => (

                    <div
                      className="interview-card"
                      key={index}
                    >

                      <div className="interview-number">
                        {String(index + 1).padStart(2, "0")}
                      </div>


                      <div className="interview-question">

                        <div className="question-top">

                          <span className="question-label">
                            Technical Question
                          </span>

                        </div>

                        <h4>
                          {question}
                        </h4>


                        <div className="interview-tip">

                          <span>
                            💡
                          </span>

                          <p>
                            Think about your answer and explain
                            it with an example from your projects
                            or experience.
                          </p>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

        </section>

      )}


      {/*  HOW IT WORKS */}

      <section
        className="how"
        id="how"
      >

        <div className="section-title">

          <h2>
            How CareerPilot Works
          </h2>

          <p>
            A simple process to understand your career gap
            and plan your next steps.
          </p>

        </div>


        <div className="steps">

          {/* Step 1 */}

          <div className="step">

            <div className="step-number">
              01
            </div>

            <h3>
              Upload Resume
            </h3>

            <p>
              Provide your current resume.
            </p>

          </div>


          {/* Step 2 */}

          <div className="step">

            <div className="step-number">
              02
            </div>

            <h3>
              Add Job
            </h3>

            <p>
              Paste the job description you're targeting.
            </p>

          </div>


          {/* Step 3 */}

          <div className="step">

            <div className="step-number">
              03
            </div>

            <h3>
              AI Analysis
            </h3>

            <p>
              CareerPilot identifies your skills and gaps.
            </p>

          </div>


          {/* Step 4 */}

          <div className="step">

            <div className="step-number">
              04
            </div>

            <h3>
              Get Your Roadmap
            </h3>

            <p>
              Follow a personalized plan to become job-ready.
            </p>

          </div>

        </div>

      </section>


      {/*  ABOUT  */}

      <section
        className="about"
        id="about"
      >

        <div className="section-title">

          <h2>
            About CareerPilot
          </h2>

          <p>
            CareerPilot helps students understand where
            they currently stand and what they should learn
            next for their target role.
          </p>

        </div>

      </section>


      {/*  FOOTER  */}

      <footer>

        <div className="logo">
          Career<span>Pilot</span>
        </div>

        <p>
          From "Am I ready?" to "Here's what to do next."
        </p>

      </footer>

    </div>
  );
}

export default App;