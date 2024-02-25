import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from "../context/AuthProvider"
import http from "../utils/http"


type FormValues = {
    email: string;
    password: string;
    role: string;
};



const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const { state } = useLocation();
    const message = state?.message; 
    const [backendError, setBackendError] = useState("");


    const form = useForm<FormValues>();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }      
    } = form;


    const { from = '/' } = state || {};


    const onSubmit = async (data: FormValues) => {

        try {
            await http.get('/sanctum/csrf-cookie');
            const response = await http.post('/auth/login', data);
            const userData = response.data;

            setAuth({ ...userData, role: userData.role ?? 'user' });
            navigate(from);
        } catch (exception: any) {
            const errorResponse = exception.response?.data?.errors?.root;
            if (errorResponse) {
                setBackendError(errorResponse[0]); 
            } else {
                setBackendError("Ein unbekannter Fehler ist aufgetreten.");
            }
        }

    };

    const onError = () => {
        console.log('Formular Error');
    };

  return (
    <div className="form-container">
         {isSubmitting && (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            )}

        <form className="login-form" onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            {message && <div className="success">{message}</div>}
            {backendError && <div className="error">{backendError}</div>}

            <h2>Einloggen</h2>

           <div className="form-group">
            <label htmlFor="email">EMail</label> 
            <input id="email" type="email" autoComplete="off" aria-invalid={errors.email ? "true" : "false"}
             {...register("email", {
                required: {
                    value: true,
                    message: "❌ Dieses Feld ist ein Pflichtfeld"
                },
                pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "❌ Ungültige Emailadresse"
                }
            })}/>
            <p className="error">{errors.email?.message}</p>
           </div>

           <div className="form-group">
            <label htmlFor="password">Passwort</label> 
            <input id="password" type="password" aria-invalid={errors.password ? "true" : "false"}
            {...register("password", {
                 required: {
                    value: true,
                    message: "❌ Dieses Feld ist ein Pflichtfeld"
                },
                minLength: {
                    value: 8,
                    message: "❌ Das Passwort muss mindestens 8 Zeichen lang sein"
                },
                maxLength: {
                    value: 16,
                    message: "❌ Das Passwort darf nicht länger als 16 Zeichen sein"
                }
            })}/>
            <p className="error">{errors.password?.message}</p>
           </div>

           <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                >
                    {isSubmitting ? 'Einloggen läuft...' : 'Einloggen'}
                </button>

           <p className="link-text">Du hast noch keinen Account? <Link className="link-btn" to="/register">Registrieren</Link></p>
        </form>
    </div>
  )
}

export default Login