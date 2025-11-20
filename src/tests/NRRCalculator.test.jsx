import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NRRCalculator from '../components/NRRCalculator';

describe('NRRCalculator Component', () => {
  const mockTeams = [
    { team: 'Rajasthan Royals', matches: 7, won: 3, lost: 4, nrr: 0.331, runsFor: 1066, oversFor: 128.2, runsAgainst: 1094, oversAgainst: 137.1, points: 6 },
    { team: 'Delhi Capitals', matches: 7, won: 4, lost: 3, nrr: 0.319, runsFor: 1085, oversFor: 126, runsAgainst: 1136, oversAgainst: 137, points: 8 }
  ];

  it('should render calculator form', () => {
    render(<NRRCalculator teams={mockTeams} />);
    expect(screen.getByText('NRR Calculator')).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Team/i)).toBeInTheDocument();
  });

  it('should have required form fields', () => {
    render(<NRRCalculator teams={mockTeams} />);
    expect(screen.getByLabelText(/Your Team/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Opposition Team/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Match Overs/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Desired Position/i)).toBeInTheDocument();
  });
});

