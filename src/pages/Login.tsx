import { useForm } from "react-hook-form"
import { DevTool } from "@hookform/devtools"
import { Link } from 'react-router-dom'

type FormValues = {
    email: string,
    password: string,
}

const Login = () => {
  const form = useForm<FormValues>();
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = form;

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Formular submitted!");
    throw new Error("Formular submitted!");
  }

  const onError = () => {
    console.log("Formular error!");
  }

  return (
    <>
        <form className="login-form" onSubmit={handleSubmit(onSubmit, onError)} noValidate>

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

           <p>Du hast bereits einen Account? <Link to="/register">Registrieren</Link></p>
        </form>
        <DevTool control= { control } />
    </>
  )
}

export default Login