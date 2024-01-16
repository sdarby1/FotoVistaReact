import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import http from '../utils/http';

type FormValues = {
    username: string;
    email: string;
    profileImage: FileList;
};

const EditProfile = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const { register, handleSubmit, setValue, formState: { errors }, setError } = useForm<FormValues>();
    const [profileImagePreview, setProfileImagePreview] = useState(auth.profileImageUrl || '');

    const navigate = useNavigate();


    useEffect(() => {
        setValue('username', auth.username || '');
        setValue('email', auth.email || '');
    }, [auth, setValue]);

    const onSubmit = async (data: FormValues) => {
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('email', data.email);
        if (data.profileImage.length) {
            formData.append('profile_image', data.profileImage[0]);
        }

        try {
            const response = await http.post('/update-profile', formData);
            setAuth({ ...auth, ...response.data.user });
            if(response.data.user.profileImageUrl) {
                setProfileImagePreview(response.data.user.profileImageUrl);
            }
            navigate('/profile');
        } catch (exception: any) {
        }
    };

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <div className="form-container">
            <form className="edit-profile-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-group">
                    <label htmlFor="username">Nutzername</label>
                    <input type="text" {...register("username", { required: "Nutzername ist erforderlich" })} />
                    {errors.username && <p className="error">{errors.username.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">E-Mail</label>
                    <input type="email" {...register("email", { required: "E-Mail ist erforderlich" })} />
                    {errors.email && <p className="error">{errors.email.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="profileImage">Profilbild</label>
                    <input type="file" {...register("profileImage")} onChange={handleProfileImageChange} />
                    {profileImagePreview && <img className="image-preview" src={profileImagePreview} alt="Profilvorschau" />}
                </div>

                <button type="submit" className="submit-btn">Profil aktualisieren</button>
            </form>
        </div>
    );
};

export default EditProfile;
