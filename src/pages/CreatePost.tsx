import { useState } from 'react';
import {useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import http from '../utils/http';

type FormValues = {
    title: string;
    description: string;
    image: FileList;
    camera?: string;
    lens?: string;
    filter?: string;
    tripod?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];


const CreatePost = () => {
  const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>();
    const [submitError, setSubmitError] = useState('');

    const validateFileSize = (fileList: FileList) => {
        if (fileList.length > 0 && fileList[0].size > MAX_FILE_SIZE) {
            return `❌ Die Datei darf nicht größer als ${MAX_FILE_SIZE / 1024 / 1024}MB sein`;
        }
        return true;
    };

    const validateFileType = (fileList: FileList) => {
        if (fileList.length > 0 && !ALLOWED_FILE_TYPES.includes(fileList[0].type)) {
            return '❌ Nur PNG, JPEG, JPG, GIF und WEBP Dateien sind erlaubt';
        }
        return true;
    };

    // const [imagePreview, setImagePreview] = useState<string | null>(null);

   /* const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    }; */


    const onSubmit = async (data: FormValues) => {
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            if (data.image[0]) formData.append('image', data.image[0]);
            if (data.camera) formData.append('camera', data.camera);
            if (data.lens) formData.append('lens', data.lens);
            if (data.filter) formData.append('filter', data.filter);
            if (data.tripod) formData.append('tripod', data.tripod);

            const response = await http.post('/auth/create-post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const postId = response.data.post.id;
            navigate(`/posts/${postId}`, { state: { message: '✅ Post erfolgreich erstellt' } });
        } catch (error) {
            setSubmitError('❌ Fehler beim Erstellen des Posts');
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
            
            <form className="create-post-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <h2>Post erstellen</h2>
                <div className="post-form-container">
                <div className="post-infos">
                  <div className="form-group">
                      <label htmlFor="title">Titel</label>
                      <input type="text" 
                      {...register('title', {
                        required:  {
                          value: true,
                          message:'❌ Dieses Feld ist ein Pflichtfeld'}
                        })} />
                      {errors.title && <p className="error">{errors.title.message}</p>}
                  </div>

                  <div className="form-group">
                      <label htmlFor="description">Beschreibung</label>
                      <textarea className="post-desc" {...register('description', {
                        required:  {
                          value: true,
                          message:'❌ Dieses Feld ist ein Pflichtfeld'}
                        })}></textarea>
                      {errors.description && <p className="error">{errors.description.message}</p>}
                  </div>

                  <div className="form-group">
                      <label htmlFor="image">Bild</label>
                      <input type="file" {...register('image', {
                        required:  {
                          value: true,
                          message:'❌ Dieses Feld ist ein Pflichtfeld'},
                          validate: {
                            fileSize: validateFileSize,
                            fileType: validateFileType
                        }
                        })} />
                      {errors.image && <p className="error">{errors.image.message}</p>}
                  </div>
                  {/* {imagePreview && <div className="image-preview">
                    <img src={imagePreview} alt="Vorschau" />
                  </div>}  */}
                </div>
                <div className="camera-settings">
                  <div className="form-group">
                      <label htmlFor="camera">Kamera</label>
                      <input type="text"  {...register('camera', {
                        required:  {
                          value: true,
                          message:'❌ Dieses Feld ist ein Pflichtfeld'}
                        })} />
                      {errors.camera && <p className="error">{errors.camera.message}</p>}
                  </div>

                  <div className="form-group">
                      <label htmlFor="lens">Objektiv</label>
                      <input type="text"  {...register('lens', {
                        required:  {
                          value: true,
                          message:'❌ Dieses Feld ist ein Pflichtfeld'}
                        })} />
                      {errors.lens && <p className="error">{errors.lens.message}</p>}
                  </div>

                  <div className="form-group">
                      <label htmlFor="filter">Filter</label>
                      <input type="text"  {...register('filter', {
                        required:  {
                          value: true,
                          message:'❌ Dieses Feld ist ein Pflichtfeld'}
                        })} />
                      {errors.filter && <p className="error">{errors.filter.message}</p>}
                  </div>

                  <div className="form-group">
                      <label htmlFor="tripod">Stativ</label>
                      <input type="text"  {...register('tripod', {
                        required:  {
                          value: true,
                          message:'❌ Dieses Feld ist ein Pflichtfeld'}
                        })} />
                      {errors.tripod && <p className="error">{errors.tripod.message}</p>}
                  </div>
                </div>
                </div>
                {submitError && <p className="error">{submitError}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                >
                    {isSubmitting ? 'Erstellen des Posts läuft...' : 'Post erstellen'}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
