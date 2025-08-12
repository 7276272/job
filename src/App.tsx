import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Building2, Users, Search, BriefcaseIcon, ArrowRight, Globe, Award, TrendingUp, Menu, MessageCircle, MapPin } from 'lucide-react';
import { useLanguage } from './i18n/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';
import { HomeCarousel } from './components/HomeCarousel';
import { ResumeForm } from './components/ResumeForm'; 
import { JobDetails } from './components/JobDetails';
import { LocationJobs } from './pages/LocationJobs';
import { AuthForm } from './components/AuthForm';
import { AdminDashboard } from './pages/AdminDashboard';
import { supabase } from './lib/supabase';

interface JobLocation {
  id: number;
  nameKey: string;
  image: string;
  jobCount: number;
}

function App() {
  const { t, language } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [jobs, setJobs] = React.useState([]);
  const [jobLocations, setJobLocations] = React.useState<JobLocation[]>([
    {
      id: 1,
      nameKey: 'locations.ghana',
      image: 'https://cy-747263170.imgix.net/%E5%8A%A0%E7%BA%B3.png',
      jobCount: 0
    },
    {
      id: 2,
      nameKey: 'locations.cambodia',
      image: 'https://cy-747263170.imgix.net/%E6%9F%AC%E5%9F%94%E5%AF%A8.png',
      jobCount: 0
    },
    {
      id: 3,
      nameKey: 'locations.malaysia',
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
      jobCount: 0
    },
    {
      id: 4,
      nameKey: 'locations.indonesia',
      image: 'https://cy-747263170.imgix.net/%E5%8D%B0%E5%BA%A6%E5%B0%BC%E8%A5%BF%E4%BA%9A.png',
      jobCount: 0
    },
    {
      id: 5,
      nameKey: 'locations.myanmar',
      image: 'https://cy-747263170.imgix.net/%E7%BC%85%E7%94%B8.png',
      jobCount: 0
    },
    {
      id: 6,
      nameKey: 'locations.dubai',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      jobCount: 0
    },
    {
      id: 7,
      nameKey: 'locations.oman',
      image: 'https://cy-747263170.imgix.net/%E9%98%BF%E6%9B%BC.png',
      jobCount: 0
    },
    {
      id: 8,
      nameKey: 'locations.philippines',
      image: 'https://cy-747263170.imgix.net/%E8%8F%B2%E5%BE%8B%E5%AE%BE.png',
      jobCount: 0
    }
  ]);
  const [customerService, setCustomerService] = React.useState({
    whatsapp_link: '',
    telegram_link: ''
  });

  React.useEffect(() => {
    checkAuth();
    fetchJobs();
    fetchCustomerService();
    fetchJobCounts();
    supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsLoggedIn(!!session);
  };

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchJobCounts = async () => {
    try {
      const updatedLocations = await Promise.all(
        jobLocations.map(async (location) => {
          const { count } = await supabase
            .from('jobs')
            .select('*', { count: 'exact' })
            .textSearch('description', t(location.nameKey));
          
          return {
            ...location,
            jobCount: count || 0
          };
        })
      );
      setJobLocations(updatedLocations);
    } catch (error) {
      console.error('Error fetching job counts:', error);
    }
  };

  const fetchCustomerService = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_service_settings')
        .select('*')
        .limit(1)
        .single();
      
      if (error) {
        console.error('Error fetching customer service settings:', error);
        return;
      }
      
      if (data) {
        setCustomerService({
          whatsapp_link: data.whatsapp_link || '',
          telegram_link: data.telegram_link || ''
        });
      }
    } catch (error) {
      console.error('Error fetching customer service settings:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/submit-resume" element={<ResumeForm />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/location/:location" element={<LocationJobs />} />
        <Route path="/dashabi/login" element={<AuthForm />} />
        <Route path="/dashabi/dashboard" element={<AdminDashboard />} />
        <Route path="/" element={
          <div className="min-h-screen bg-white">
            <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white relative z-30">
              <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-8 w-8" />
                    <span className="text-xl font-bold">TalentHub</span>
                  </div>
                  
                  <button 
                    className="md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <Menu className="h-6 w-6" />
                  </button>

                  <div className="hidden md:flex items-center space-x-8">
                    <LanguageSelector />
                    {customerService.whatsapp_link && (
                      <a 
                        href={customerService.whatsapp_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-white hover:text-blue-200"
                      >
                        <MessageCircle className="h-5 w-5 mr-1" />
                        WhatsApp
                      </a>
                    )}
                    {customerService.telegram_link && (
                      <a 
                        href={customerService.telegram_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-white hover:text-blue-200"
                      >
                        <MessageCircle className="h-5 w-5 mr-1" />
                        Telegram
                      </a>
                    )}
                    {isLoggedIn ? (
                      <>
                        <Link to="/submit-resume" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50">
                          {t('resume.submitTitle')}
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="text-white hover:text-blue-200"
                        >
                          {t('auth.logout')}
                        </button>
                      </>
                    ) : (
                      <Link 
                        to="/submit-resume" 
                        className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50"
                      >
                        {t('resume.submitTitle')}
                      </Link>
                    )}
                  </div>
                </div>

                {isMenuOpen && (
                  <div className="md:hidden mt-4 pb-4">
                    <div className="flex flex-col space-y-4">
                      <LanguageSelector />
                      {customerService.whatsapp_link && (
                        <a 
                          href={customerService.whatsapp_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-white hover:text-blue-200"
                        >
                          <MessageCircle className="h-5 w-5 mr-1" />
                          WhatsApp
                        </a>
                      )}
                      {customerService.telegram_link && (
                        <a 
                          href={customerService.telegram_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-white hover:text-blue-200"
                        >
                          <MessageCircle className="h-5 w-5 mr-1" />
                          Telegram
                        </a>
                      )}
                      {isLoggedIn ? (
                        <>
                          <Link to="/submit-resume" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 text-center">
                            {t('resume.submitTitle')}
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="text-white hover:text-blue-200"
                          >
                            {t('auth.logout')}
                          </button>
                        </>
                      ) : (
                        <Link 
                          to="/submit-resume"
                          className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 text-center"
                        >
                          {t('resume.submitTitle')}
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </nav>

              <div className="relative z-10">
                <HomeCarousel />
                
                <div className="container mx-auto px-4 py-12">
                  <h1 className="text-3xl md:text-6xl font-bold mb-6 text-center">
                    {t('hero.title')}
                  </h1>
                  <p className="text-xl mb-8 text-blue-100 text-center">
                    {t('hero.subtitle')}
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
                    <div className="flex-1 flex items-center bg-gray-50 rounded px-4">
                      <Search className="text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder={t('hero.searchPlaceholder')}
                        className="w-full p-2 bg-transparent focus:outline-none"
                      />
                    </div>
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                      {t('hero.searchButton')}
                    </button>
                  </div>
                </div>
              </div>
            </header>

            <section className="py-12 bg-gray-50">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{t('featured.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.map((job: any) => (
                    <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-gray-600">{job.salary}</p>
                        </div>
                        <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-500 flex items-center">
                          <Globe className="h-4 w-4 mr-2" />
                          {job.working_hours}
                        </p>
                      </div>
                      <Link 
                        to={`/jobs/${job.id}`}
                        className="mt-4 w-full bg-gray-50 text-blue-600 py-2 rounded flex items-center justify-center hover:bg-gray-100"
                      >
                        {t('featured.viewDetails')}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-12 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{t('locations.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobLocations.map((location) => (
                    <div 
                      key={location.id}
                      className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <img 
                        src={location.image} 
                        alt={t(location.nameKey)}
                        className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex flex-col justify-end p-6">
                        <h3 className="text-white text-xl font-bold mb-2">{t(location.nameKey)}</h3>
                        <div className="flex items-center text-white/90">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{location.jobCount} {t('locations.openings')}</span>
                        </div>
                      </div>
                      <Link 
                        to={`/jobs/location/${encodeURIComponent(t(location.nameKey))}`}
                        className="absolute inset-0"
                        aria-label={`View jobs in ${t(location.nameKey)}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-12">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{t('whyUs.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-xl mb-2">{t('whyUs.topCompanies.title')}</h3>
                    <p className="text-gray-600">{t('whyUs.topCompanies.desc')}</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-xl mb-2">{t('whyUs.qualityPositions.title')}</h3>
                    <p className="text-gray-600">{t('whyUs.qualityPositions.desc')}</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-xl mb-2">{t('whyUs.careerGrowth.title')}</h3>
                    <p className="text-gray-600">{t('whyUs.careerGrowth.desc')}</p>
                  </div>
                </div>
              </div>
            </section>

            <footer className="bg-gray-900 text-white py-12">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <Building2 className="h-6 w-6" />
                      <span className="text-lg font-bold">TalentHub</span>
                    </div>
                    <p className="text-gray-400">{t('footer.tagline')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">{t('footer.jobSeekers')}</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><Link to="/jobs" className="hover:text-white">{t('footer.browseJobs')}</Link></li>
                      <li><Link to="/resources" className="hover:text-white">{t('footer.careerResources')}</Link></li>
                      <li><Link to="/resume-tips" className="hover:text-white">{t('footer.resumeTips')}</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">{t('footer.contact')}</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li>mz2503687@gmail.com</li>
                      <li>1-800-TALENT</li>
                      <li>Copyrights © HUIYING. All Rights Reserved</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">{t('footer.customerService')}</h4>
                    <ul className="space-y-2 text-gray-400">
                      {customerService.whatsapp_link && (
                        <li>
                          <a 
                            href={customerService.whatsapp_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white flex items-center"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            WhatsApp
                          </a>
                        </li>
                      )}
                      {customerService.telegram_link && (
                        <li>
                          <a 
                            href={customerService.telegram_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white flex items-center"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Telegram
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                  <p>&copy; 2025 TalentHub. {t('footer.rights')}</p>
                </div>
              </div>
            </footer>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;