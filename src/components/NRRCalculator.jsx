import { useState } from "react";
import { calculateNRRRange } from "../services/api";
import "./NRRCalculator.css";

const NRRCalculator = ({ teams }) => {
  const [formData, setFormData] = useState({
    yourTeam: "",
    oppositionTeam: "",
    matchOvers: 20,
    desiredPosition: "",
    tossResult: "batting",
    runs: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newValue =
        name === "matchOvers" || name === "desiredPosition" || name === "runs"
          ? value === ""
            ? ""
            : Number(value)
          : value;

      // If "Your Team" is changed and it matches "Opposition Team", clear opposition team
      const updatedData = {
        ...prev,
        [name]: newValue,
      };

      if (name === "yourTeam" && updatedData.oppositionTeam === newValue) {
        updatedData.oppositionTeam = "";
      }

      return updatedData;
    });
    setError(null);
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!formData.yourTeam || !formData.oppositionTeam || !formData.runs) {
      setError("Please fill all required fields");
      return;
    }

    if (formData.yourTeam === formData.oppositionTeam) {
      setError("Your team and opposition team cannot be the same");
      return;
    }

    setLoading(true);

    try {
      const response = await calculateNRRRange({
        yourTeam: formData.yourTeam,
        oppositionTeam: formData.oppositionTeam,
        matchOvers: formData.matchOvers,
        desiredPosition: formData.desiredPosition,
        tossResult: formData.tossResult,
        runs: formData.runs,
      });

      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error || "Calculation failed");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const formatOvers = (overs) => {
    const whole = Math.floor(overs);
    const balls = Math.round((overs - whole) * 10);
    // In cricket, balls can only be 0-5, so cap at 5
    const validBalls = Math.min(balls, 5);
    if (validBalls === 0) return whole.toString();
    return `${whole}.${validBalls}`;
  };

  return (
    <div className="calculator-container">
      <h2>NRR Calculator</h2>

      <form onSubmit={handleSubmit} className="calculator-form">
        <div className="form-group">
          <label htmlFor="yourTeam">Your Team *</label>
          <select
            id="yourTeam"
            name="yourTeam"
            value={formData.yourTeam}
            onChange={handleChange}
            required
          >
            <option value="">Select your team</option>
            {teams.map((team) => (
              <option key={team.team} value={team.team}>
                {team.team}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="oppositionTeam">Opposition Team *</label>
          <select
            id="oppositionTeam"
            name="oppositionTeam"
            value={formData.oppositionTeam}
            onChange={handleChange}
            required
          >
            <option value="">Select opposition team</option>
            {teams
              .filter((team) => team.team !== formData.yourTeam)
              .map((team) => (
                <option key={team.team} value={team.team}>
                  {team.team}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="matchOvers">Match Overs</label>
          <input
            type="number"
            id="matchOvers"
            name="matchOvers"
            value={formData.matchOvers}
            onChange={handleChange}
            min="1"
            max="50"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="desiredPosition">Desired Position</label>
          <input
            type="number"
            id="desiredPosition"
            name="desiredPosition"
            value={formData.desiredPosition}
            onChange={handleChange}
            min="1"
            max={teams.length}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tossResult">Toss Result</label>
          <select
            id="tossResult"
            name="tossResult"
            value={formData.tossResult}
            onChange={handleChange}
            required
          >
            <option value="batting">Batting First</option>
            <option value="bowling">Bowling First</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="runs">
            {formData.tossResult === "batting"
              ? "Runs Scored (Batting First) *"
              : "Runs to Chase (Bowling First) *"}
          </label>
          <input
            type="number"
            id="runs"
            name="runs"
            value={formData.runs}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Calculating..." : "Calculate NRR Range"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {result && (
        <div className="result-container">
          {result.scenario === "batting_first" ? (
            <div className="result-box batting-first">
              <p>
                If <strong>{result.yourTeam}</strong> score{" "}
                <strong>{result.runsScored}</strong> runs in{" "}
                <strong>{result.oversBatted}</strong> overs,{" "}
                <strong>{result.yourTeam}</strong> need to restrict{" "}
                <strong>{result.oppositionTeam}</strong> between{" "}
                <strong>{result.minRunsToRestrict}</strong> to{" "}
                <strong>{result.maxRunsToRestrict}</strong> runs in{" "}
                <strong>{result.oversToRestrict}</strong> overs.
              </p>
              <p className="nrr-info">
                Revised NRR of <strong>{result.yourTeam}</strong> will be
                between <strong>{result.minNRR.toFixed(3)}</strong> to{" "}
                <strong>{result.maxNRR.toFixed(3)}</strong>.
              </p>
            </div>
          ) : (
            <div className="result-box bowling-first">
              <p>
                <strong>{result.yourTeam}</strong> need to chase{" "}
                <strong>{result.runsToChase}</strong> runs between{" "}
                <strong>{formatOvers(result.minOversToChase)}</strong> and{" "}
                <strong>{formatOvers(result.maxOversToChase)}</strong> overs.
              </p>
              <p className="nrr-info">
                Revised NRR for <strong>{result.yourTeam}</strong> will be
                between <strong>{result.minNRR.toFixed(3)}</strong> to{" "}
                <strong>{result.maxNRR.toFixed(3)}</strong>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NRRCalculator;
