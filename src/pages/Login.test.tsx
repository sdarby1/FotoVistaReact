import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom'; 
import { AuthContext, defaultAuth } from "../context/AuthProvider";
import Login from '../pages/Login';
import '@testing-library/jest-dom';



describe('Login Component', () => {

    it('Fehlermeldung anzeigen, wenn das Passwort zu lang ist', async () => {
        const mockSetAuth = vi.fn();
        render(
          <MemoryRouter>
            <AuthContext.Provider value={{ auth: defaultAuth, setAuth: mockSetAuth }}>
              <Login />
            </AuthContext.Provider>
          </MemoryRouter>
        );
    
        await userEvent.type(screen.getByLabelText(/EMail/i), 'user@example.com');
        await userEvent.type(screen.getByLabelText(/Passwort/i), 'passwordwaytolong');
        await userEvent.click(screen.getByRole('button', { name: /Einloggen/i }));
    
        expect(await screen.findByText(/Das Passwort darf nicht länger als 16 Zeichen sein/i)).toBeInTheDocument();
    });



    it('Fehlermeldung anzeigen, wenn das Passwort zu kurz ist', async () => {
        const mockSetAuth = vi.fn();
        render(
          <MemoryRouter>
            <AuthContext.Provider value={{ auth: defaultAuth, setAuth: mockSetAuth }}>
              <Login />
            </AuthContext.Provider>
          </MemoryRouter>
        );
    
        await userEvent.type(screen.getByLabelText(/EMail/i), 'user@example.com');
        await userEvent.type(screen.getByLabelText(/Passwort/i), 'short');
        await userEvent.click(screen.getByRole('button', { name: /Einloggen/i }));
    
        expect(await screen.findByText(/Das Passwort muss mindestens 8 Zeichen lang sein/i)).toBeInTheDocument();
    });
    


    it('Korrektes Anzeigen der Login Form', () => {
        const mockSetAuth = vi.fn();

        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ auth: defaultAuth, setAuth: mockSetAuth }}>
                    <Login />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByLabelText(/EMail/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Passwort/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Einloggen/i })).toBeInTheDocument();
    });



    it('Fehlermeldung anzeigen, wenn die Email invaild ist', async () => {
        const mockSetAuth = vi.fn();
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ auth: defaultAuth, setAuth: mockSetAuth }}>
                    <Login />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        const emailInput = screen.getByLabelText(/EMail/i);
        userEvent.type(emailInput, 'invalid-email');

        const submitButton = screen.getByRole('button', { name: /Einloggen/i });
        userEvent.click(submitButton);

        expect(await screen.findByText(/Ungültige Emailadresse/i)).toBeInTheDocument();
    });

    

    
});
