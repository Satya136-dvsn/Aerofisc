/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProfessionalButton from './ProfessionalButton';

describe('ProfessionalButton', () => {
    it('renders children correctly', () => {
        render(<ProfessionalButton>Click Me</ProfessionalButton>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('handles click events', () => {
        const handleClick = vi.fn();
        render(<ProfessionalButton onClick={handleClick}>Click Me</ProfessionalButton>);

        fireEvent.click(screen.getByText('Click Me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('shows loading text when loading prop is true', () => {
        render(<ProfessionalButton loading>Submit</ProfessionalButton>);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.queryByText('Submit')).not.toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
        render(<ProfessionalButton disabled>Disabled</ProfessionalButton>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('is disabled when loading prop is true', () => {
        render(<ProfessionalButton loading>Loading</ProfessionalButton>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });
});
