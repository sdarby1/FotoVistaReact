import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import http from "../utils/http";

type FormValues = {
    username: string;
    email: string;
    password: string;
    passwordRepeat: string;
};

const Register = () => {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting }, getValues } = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {
        try {
            await http.post('/auth/register', data);
            navigate('/login', { state: { message: '✅ Erfolgreich registriert. Logge dich jetzt ein.' } });
        } catch (error) {
            console.error(error);
        }
    };


    return (
        
        <div className="form-container">
            {isSubmitting && (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            )}

            <form className="register-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <h2>Registrieren</h2>
                <div className="register-form-container">
                <div className="form-group">
                    <label htmlFor="username">Benutzername</label>
                    <input type="text" autoComplete="off" aria-invalid={errors.username ? "true" : "false"}
                    {...register("username", { 
                        required: {
                            value: true,
                            message: "❌ Dieses Feld ist ein Pflichtfeld"
                        }, 
                        minLength: {
                            value: 4,
                            message: "❌ Der Nutzername muss mindestens 4 Zeichen lang sein"
                        }, 
                        maxLength: {
                            value: 16,
                            message: "❌ Der Nutzername darf nicht länger als 16 Zeichen lang sein"
                        }, 
                        pattern: {
                            value: /^[a-zA-Z0-9_]+$/,
                            message: "❌ Der Nutzername enthält ungültige Zeichen"
                        }
                        })} />
                    {errors.username && <p className="error">{errors.username.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">E-Mail</label>
                    <input type="email" autoComplete="none" aria-invalid={errors.email ? "true" : "false"}
                    {...register("email", { 
                        required: {
                            value: true,
                            message: "❌ Dieses Feld ist ein Pflichtfeld"
                        }, 
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "❌ Ungültige Emailadresse"
                        }
                        })} />
                    {errors.email && <p className="error">{errors.email.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Passwort</label>
                    <input type="password" aria-invalid={errors.password ? "true" : "false"}
                    {...register("password", { 
                        required: {
                            value: true,
                            message: "❌ Dieses Feld ist ein Pflichtfeld"
                        }, 
                        minLength: { 
                            value: 8, 
                            message: "❌ Das Passwort muss mindestens 8 Zeichen lang sein" 
                        } 
                        })} />
                    {errors.password && <p className="error">{errors.password.message}</p>}
                </div>

                <div className="form-group">
                <label htmlFor="passwordRepeat">Passwort wiederholen</label>
                <input type="password" aria-invalid={errors.passwordRepeat ? "true" : "false"}
                {...register("passwordRepeat", {
                    validate: value =>
                        value === getValues('password') || "❌ Die Passwörter stimmen nicht überein"
                })} />
                {errors.passwordRepeat && <p className="error">{errors.passwordRepeat.message}</p>}
            </div>
            </div>
            <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                >
                    {isSubmitting ? 'Registrierung läuft...' : 'Registrieren'}
                </button>

            <p className="link-text">Hast du schon ein Konto? <Link className="link-btn" to="/login">Einloggen</Link></p>
        </form>
    </div>
);
};
export default Register;

