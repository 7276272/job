import React from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '../i18n/LanguageContext';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, CheckCircle } from 'lucide-react';

interface ResumeFormData {
  fullName: string;
  email: string;
  phone: string;
  education: string;
  experience: string;
  skills: string;
  coverLetter: string;
}

export function ResumeForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ResumeFormData>();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showNotification, setShowNotification] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/dashabi/login', { state: { returnTo: '/submit-resume' } });
      return;
    }
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const onSubmit = async (data: ResumeFormData) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/dashabi/login', { state: { returnTo: '/submit-resume' } });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('resumes')
        .insert({
          "fullName": data.fullName,
          email: data.email,
          phone: data.phone,
          education: data.education,
          experience: data.experience,
          skills: data.skills,
          "coverLetter": data.coverLetter,
          user_id: session.user.id,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      setShowNotification(true);
      reset();
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting resume:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t('nav.back')}
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center text-red-600 hover:text-red-700"
          >
            <LogOut className="h-5 w-5 mr-2" />
            {t('auth.logout')}
          </button>
        </div>

        {showNotification && (
          <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center shadow-lg">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>{t('resume.submitSuccess')}</span>
          </div>
        )}

        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">{t('resume.submitTitle')}</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('resume.fullName')}
              </label>
              <input
                type="text"
                {...register('fullName', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{t('resume.required')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('resume.email')}
              </label>
              <input
                type="email"
                {...register('email', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('resume.phone')}
              </label>
              <input
                type="tel"
                {...register('phone', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('resume.education')}
              </label>
              <textarea
                {...register('education', { required: true })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('resume.experience')}
              </label>
              <textarea
                {...register('experience', { required: true })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('resume.skills')}
              </label>
              <textarea
                {...register('skills', { required: true })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('resume.coverLetter')}
              </label>
              <textarea
                {...register('coverLetter', { required: true })}
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? t('resume.submitting') : t('resume.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}