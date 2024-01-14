import { useContext } from "react"
import { useForm } from "react-hook-form"
import { DevTool } from "@hookform/devtools"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from "../context/AuthProvider"


type FormValues = {
    email: string,
    password: string,
}

const Login = () => {
  const { auth, setAuth } = useContext(AuthContext)
  const navigate = useNavigate()
  const { state } = useLocation() 

  const form = useForm<FormValues>();
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = form;

  console.log(auth);  

  const  { from = "/" } = state || {}

  const login = {
    id: 1,
    username: "sienderby",
    email: "sean.darby@outlook.de",
    password: "Passwort",
    role: "user"
  };

  const onSubmit = async (data: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Formular submitted!");
    if(data.email === login.email && data.password === login.password) {
        setAuth((prevAuth) => {
            let role = null

            if(login.role === "admin") {
                role = login.role as "admin";
            }
            if(login.role === "user") {
                role = login.role as "user";
            }

            return {
                ...prevAuth,
                id: login.id,
                username: login.username,
                role: role
            }
        })
        navigate(from);
    }
  }

  // throw new Error("Error!");

  const onError = () => {
    console.log("Formular error!");
  }

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

           <p>Du hast bereits einen Account? <Link className="link-btn" to="/register">Registrieren</Link></p>
        </form>
        <DevTool control= { control } />
    </div>
  )
}

export default Login