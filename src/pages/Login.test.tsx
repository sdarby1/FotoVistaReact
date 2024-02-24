// Login.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Importieren von userEvent
import { MemoryRouter } from 'react-router-dom'; // Verwenden Sie MemoryRouter für Tests
import { AuthContext, defaultAuth } from "../context/AuthProvider";
import Login from '../pages/Login';
import '@testing-library/jest-dom';

vi.mock("../utils/http", () => ({
    create: () => ({
    post: vi.fn(() => Promise.resolve({ 
      data: { 
        id: 1, 
        username: "testUser", 
        role: "user",
        email: "user@example.com", // Stellen Sie sicher, dass dies den tatsächlichen Daten entspricht
        profile_image: null // Stellen Sie sicher, dass dies den tatsächlichen Daten entspricht
      }
    }))
    })
  }));


describe('Login Component', () => {

    it('renders the login form correctly', () => {
        const mockSetAuth = vi.fn();

        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ auth: defaultAuth, setAuth: mockSetAuth }}>
                    <Login />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        // Überprüfen, ob die Eingabefelder und der Button gerendert werden
        expect(screen.getByLabelText(/EMail/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Passwort/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Einloggen/i })).toBeInTheDocument();
    });



    it('displays an error message when the email is invalid', async () => {
        const mockSetAuth = vi.fn();
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ auth: defaultAuth, setAuth: mockSetAuth }}>
                    <Login />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        // Simulieren der Eingabe einer ungültigen E-Mail-Adresse
        const emailInput = screen.getByLabelText(/EMail/i);
        userEvent.type(emailInput, 'invalid-email');

        // Simulieren des Absendens des Formulars
        const submitButton = screen.getByRole('button', { name: /Einloggen/i });
        userEvent.click(submitButton);

        // Erwarten, dass eine Fehlermeldung angezeigt wird
        expect(await screen.findByText(/Ungültige Emailadresse/i)).toBeInTheDocument();
    });





    it('calls setAuth with user data on successful login', async () => {
        const mockSetAuth = vi.fn();
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ auth: defaultAuth, setAuth: mockSetAuth }}>
                    <Login />
                </AuthContext.Provider>
            </MemoryRouter>
        );
    
        userEvent.type(screen.getByLabelText(/EMail/i), 'user@example.com');
        userEvent.type(screen.getByLabelText(/Passwort/i), 'password123');
        userEvent.click(screen.getByRole('button', { name: /Einloggen/i }));
    

            await waitFor(() => 
            expect(mockSetAuth).toHaveBeenCalledWith({
                id: 1,
                username: "testUser",
                role: "user",
                email: "user@example.com", // Passen Sie dies an Ihre tatsächliche Implementierung an
                profile_image: null // Passen Sie dies an Ihre tatsächliche Implementierung an
            })
        );
    });
});
