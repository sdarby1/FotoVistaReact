import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import http from '../utils/http';
import DeletePost from '../components/DeletePost';

// Stellen Sie sicher, dass Sie die Struktur Ihrer Post-Daten anpassen
interface FormValues {
  id: number;
  title: string;
  description: string;
  camera: string;
  lens: string;
  filter: string;
  tripod: string;
}

const EditPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState('');

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await http.get(`/posts/${postId}`);
        const postData = response.data.post;
        // Vorbelegen der Formularfelder mit den Post-Daten
        Object.keys(postData).forEach(key => {
          setValue(key as keyof FormValues, postData[key]);
        });
        setIsLoading(false);
      } catch (err) {
        console.error('Fehler beim Laden des Posts:', err);
        setSubmitError('Post konnte nicht geladen werden.');
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      await http.put(`/posts/${postId}`, data);
      navigate(`/profile`, { state: { message: '✅ Post erfolgreich bearbeitet' } });
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Posts:', error);
      setSubmitError('Fehler beim Aktualisieren des Posts.');
    }
  };

  if (isLoading) return 
  <div className="loader-container">
    <div className="loader"></div>
  </div>;
  if (submitError) return <div className="error">{submitError}</div>;

  return (
    <div className="form-container">
       {isSubmitting && (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            )}
      <form className="edit-post-form" onSubmit={handleSubmit(onSubmit)} noValidate>

        <h2>Post bearbeiten</h2>

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
          <textarea className="post-desc" 
            {...register('description', {
              required:  {
                value: true,
                message:'❌ Dieses Feld ist ein Pflichtfeld'}
            })}></textarea>
          {errors.description && <p className="error">{errors.description.message}</p>}
        </div>

        <div className="camera-settings">
          <div className="form-group">
            <label htmlFor="camera">Kamera</label>
            <input type="text"  
              {...register('camera', {
                required:  {
                  value: true,
                  message:'❌ Dieses Feld ist ein Pflichtfeld'}
              })} />
            {errors.camera && <p className="error">{errors.camera.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="lens">Objektiv</label>
            <input type="text"  
              {...register('lens', {
                required:  {
                  value: true,
                  message:'❌ Dieses Feld ist ein Pflichtfeld'}
              })} />
            {errors.lens && <p className="error">{errors.lens.message}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="filter">Filter</label>
            <input type="text"  
              {...register('filter', {
                required:  {
                  value: true,
                  message:'❌ Dieses Feld ist ein Pflichtfeld'}
              })} />
            {errors.filter && <p className="error">{errors.filter.message}</p>}
          </div>
              
          <div className="form-group">
            <label htmlFor="tripod">Stativ</label>
            <input type="text"  
              {...register('tripod', {
                required:  {
                  value: true,
                  message:'❌ Dieses Feld ist ein Pflichtfeld'}
              })} />
            {errors.tripod && <p className="error">{errors.tripod.message}</p>}
          </div>

        </div>

        <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                >
                    {isSubmitting ? 'Ändern des Posts läuft...' : 'Änderungen speichern'}
                </button>
                <DeletePost />
        {submitError && <p className="error">{submitError}</p>}
      </form>
    </div>
  );
};

export default EditPost;