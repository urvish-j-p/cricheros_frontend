import "./PointsTable.css";

const PointsTable = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="points-table-container">
      <h2>Current Points Table</h2>
      <div className="table-wrapper">
        <table className="points-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Team</th>
              <th>Matches</th>
              <th>Won</th>
              <th>Lost</th>
              <th className="nrr-col">NRR</th>
              <th>For</th>
              <th>Against</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {data.map((team, index) => (
              <tr key={team.team}>
                <td>{index + 1}</td>
                <td className="team-name">{team.team}</td>
                <td>{team.matches}</td>
                <td>{team.won}</td>
                <td>{team.lost}</td>
                <td
                  className={`nrr-value ${
                    team.nrr >= 0 ? "nrr-positive" : "nrr-negative"
                  }`}
                >
                  {team.nrr.toFixed(3)}
                </td>
                <td>
                  {team.runsFor}/{team.oversFor}
                </td>
                <td>
                  {team.runsAgainst}/{team.oversAgainst}
                </td>
                <td>{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PointsTable;
