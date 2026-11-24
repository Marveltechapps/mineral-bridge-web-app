/**
 * BUG-007: root layout nav must expose only real Mineral Bridge labels —
 * never sample / project-structure scaffolding.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from '../../src/components/layout/Header';

const REAL_NAV_LABELS = ['Mineral Bridge'];
const FORBIDDEN_SAMPLE_TEXTS = ['Samples', 'View sample items', 'Project structure example', 'Sample items'];

describe('BUG-007: the root layout\'s nav renders only the real nav labels', () => {
  it('renders only the real nav labels (assert the label list)', () => {
    render(<Header />);
    for (const label of REAL_NAV_LABELS) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    for (const bad of FORBIDDEN_SAMPLE_TEXTS) {
      expect(screen.queryByText(bad)).not.toBeInTheDocument();
    }
  });

  it('BUG-007 neighbouring: does not link to /samples', () => {
    render(<Header />);
    const links = screen.getAllByRole('link');
    expect(links.map((a) => a.getAttribute('href'))).not.toContain('/samples');
  });
});
