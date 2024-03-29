import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import http from '../utils/http';
import DeleteUser from '../components/DeleteUser';

type FormValues = {
    username: string;
    email: string;
    profile_image: FileList;
};

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];


const EditProfile = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const { register, handleSubmit, setValue, formState: { isSubmitting, errors } } = useForm<FormValues>();
    const [profileImagePreview, setProfileImagePreview] = useState(auth.profile_image || '');

    const navigate = useNavigate();

    const [backendError, setBackendError] = useState("");

    const validateFileType = (fileList: FileList) => {
        if (fileList.length > 0 && !ALLOWED_FILE_TYPES.includes(fileList[0].type)) {
            return '❌ Nur PNG, JPEG, JPG, GIF und WEBP Dateien sind erlaubt';
        }
        return true;
    };


    useEffect(() => {
        setValue('username', auth.username || '');
        setValue('email', auth.email || '');
    }, [auth, setValue]);

    const onSubmit = async (data: FormValues) => {
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('email', data.email);
        if (data.profile_image.length) {
            formData.append('profile_image', data.profile_image[0]);
        }

        try {
            const response = await http.post('/update-profile', formData);
            setAuth({ ...auth, ...response.data.user });
            if(response.data.user.profile_image) {
                setProfileImagePreview(response.data.user.profile_image);
            }
            navigate('/profile', { state: { message: '✅ Profil erfolgreich bearbeitet' } });
        } catch (exception: any) {
            const errorResponse = exception.response?.data?.errors?.root;
           if (errorResponse) {
            setBackendError(errorResponse[0]) } else  {
            setBackendError('❌ Ein unbekannter Fehler ist aufgetreten');
            }
          }
    };

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };


    return (
        <div className="form-container">
             {isSubmitting && (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            )}

            <form className="edit-profile-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {backendError && <div className="error">{backendError}</div>}
                <h2>Profil bearbeiten</h2>
                <div className="form-group">
                    <label htmlFor="username">Nutzername</label>
                    <input type="text" {...register("username", { required: "❌ Dieses Feld ist ein Pflichtfeld" })} />
                    {errors.username && <p className="error">{errors.username.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">E-Mail</label>
                    <input type="email" {...register("email", { required: "❌ Dieses Feld ist ein Pflichtfeld" })} />
                    {errors.email && <p className="error">{errors.email.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="profile_image">Profilbild</label>
                    <input type="file" {...register("profile_image", {
                            validate: {
                              fileType: validateFileType
                          }
                          })} onChange={handleProfileImageChange} />
                        {errors.profile_image && <p className="error">{errors.profile_image.message}</p>}
                    {profileImagePreview && <img className="image-preview" src={profileImagePreview} alt="Profilvorschau" />}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                >
                    {isSubmitting ? 'Aktualisierung läuft...' : 'Profil aktualisieren'}
                </button>
                <DeleteUser isSubmitting={isSubmitting}/>         
            </form>
        </div>
    );
};

export default EditProfile;
