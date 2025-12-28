import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { PrototypeInMemoryStats } from '@f88/promidas';
import { AppPresentation } from '@/components/app/app-presentation';

describe('App', () => {
  it('renders loading state', () => {
    render(<AppPresentation loading error={null} stats={null} />);
    expect(screen.getByText('Loading PROMIDAS...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(<AppPresentation loading={false} error="Boom" stats={null} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Error:');
    expect(screen.getByText('Boom')).toBeInTheDocument();
  });

  it('renders stats', () => {
    const stats: PrototypeInMemoryStats = {
      size: 123,
      cachedAt: new Date(1730000000000),
      isExpired: false,
      remainingTtlMs: 300000,
      dataSizeBytes: 1024,
      refreshInFlight: false,
    };

    render(<AppPresentation loading={false} error={null} stats={stats} />);

    expect(screen.getByText('PROMIDAS Stats')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });
});
