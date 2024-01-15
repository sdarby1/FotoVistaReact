import { useContext } from "react"
import { useForm } from "react-hook-form"
import { DevTool } from "@hookform/devtools"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from "../context/AuthProvider"
import http from "../utils/http"


type FormValues = {
    email: string;
    password: string;
};

const Login = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const { state } = useLocation();

    const form = useForm<FormValues>();
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError
    } = form;

    // Wenn Nutzer von einer Private Route kam
    // dann wollen wir dahin nach Login zurück
    // Wenn er direkt auf Login klickte, schicken wir
    // den Nutzer an die Homepage
    const { from = '/' } = state || {};

    // Diese Funktion wird nur ausgeführt, wenn alle Felder
    // korrekt validiert sind
    const onSubmit = async (data: FormValues) => {
        // Logik für den Login
        try {
            await http.get('/sanctum/csrf-cookie');
            const response = await http.post('/auth/login', data);
            const userData = response.data;

            setAuth({ ...userData, role: userData.role ?? 'user' });
            navigate(from);
        } catch (exception: any) {
            const errors = exception.response.data.errors;

            for (let [fieldName, errorList] of Object.entries(errors)) {
                type Field = 'email' | 'password' | 'root';
                const errors = (errorList as any[]).map(message => ({ message }));
                console.log(fieldName, errors);
                setError(fieldName as Field, errors[0]);
            }
        }

        console.log('Formular Submit');
    };

    const onError = () => {
        console.log('Formular Error');
    };

  return (
    <div className="form-container">
        <form className="login-form" onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <h2>Einloggen</h2>

           <div className="form-group">
            <label htmlFor="email">EMail</label> 
            <input type="email" aria-invalid={errors.email ? "true" : "false"}
             {...register("email", {
                required: {
                    value: true,
                    message: "Dieses Feld ist ein Pflichtfeld"
                },
                pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Ungültige Emailadresse"
                }
            })}/>
            <p className="error">{errors.email?.message}</p>
           </div>

           <div className="form-group">
            <label htmlFor="password">Passwort</label> 
            <input type="password" aria-invalid={errors.password ? "true" : "false"}
            {...register("password", {
                 required: {
                    value: true,
                    message: "Dieses Feld ist ein Pflichtfeld"
                }
            })}/>
            <p className="error">{errors.password?.message}</p>
           </div>

           <button disabled={isSubmitting} type="submit" className="submit-btn">Login</button>

           <p>Du hast noch keinen Account? <Link className="link-btn" to="/register">Registrieren</Link></p>
        </form>
        <DevTool control= { control } />
    </div>
  )
}

export default Login