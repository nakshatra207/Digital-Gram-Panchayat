
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ArrowLeft, Filter, Grid3X3 } from 'lucide-react';
import { IndianServiceCard } from '@/components/IndianServiceCard';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  requiredDocuments: string[];
  processingTime: string;
  fees: number;
  status: 'active' | 'inactive';
}

const Services = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticIndianServices: Service[] = [
      {
        id: 'birth-cert-001',
        name: 'जन्म प्रमाण पत्र / Birth Certificate',
        description: 'नवजात के जन्म का आधिकारिक प्रमाण पत्र जारी करना। यह पासपोर्ट, स्कूल प्रवेश और सरकारी दस्तावेजों के लिए आवश्यक है।',
        category: 'certificates',
        requiredDocuments: ['अस्पताल का जन्म प्रमाण पत्र', 'माता-पिता का पहचान प्रमाण', 'निवास प्रमाण', 'जन्म पंजीकरण फॉर्म'],
        processingTime: '७ कार्य दिवस',
        fees: 50,
        status: 'active'
      },
      {
        id: 'income-cert-002',
        name: 'आय प्रमाण पत्र / Income Certificate',
        description: 'सरकारी योजनाओं, शैक्षणिक प्रवेश और ऋण आवेदन के लिए आय का आधिकारिक प्रमाण पत्र।',
        category: 'certificates',
        requiredDocuments: ['वेतन प्रमाण पत्र', '६ माह का बैंक स्टेटमेंट', 'पहचान प्रमाण', 'निवास प्रमाण'],
        processingTime: '१० कार्य दिवस',
        fees: 30,
        status: 'active'
      },
      {
        id: 'caste-cert-003',
        name: 'जाति प्रमाण पत्र / Caste Certificate',
        description: 'शिक्षा में आरक्षण, नौकरी में आरक्षण और सरकारी योजनाओं के लिए जाति प्रमाण पत्र।',
        category: 'certificates',
        requiredDocuments: ['पहचान प्रमाण', 'निवास प्रमाण', 'पारिवारिक अभिलेख', 'जाति घोषणा पत्र'],
        processingTime: '१५ कार्य दिवस',
        fees: 40,
        status: 'active'
      },
      {
        id: 'domicile-cert-004',
        name: 'निवास प्रमाण पत्र / Domicile Certificate',
        description: 'राज्य-विशिष्ट लाभों और स्थानीय कोटा के लिए निवास का प्रमाण पत्र।',
        category: 'certificates',
        requiredDocuments: ['पहचान प्रमाण', 'निवास प्रमाण', 'निवास इतिहास', 'संपत्ति दस्तावेज'],
        processingTime: '१२ कार्य दिवस',
        fees: 35,
        status: 'active'
      },
      {
        id: 'property-tax-005',
        name: 'संपत्ति कर भुगतान / Property Tax Payment',
        description: 'गांव की सीमा के भीतर पंजीकृत संपत्तियों के लिए वार्षिक संपत्ति कर का भुगतान।',
        category: 'payments',
        requiredDocuments: ['संपत्ति दस्तावेज', 'पिछली कर रसीद', 'संपत्ति पहचान संख्या'],
        processingTime: '१ कार्य दिवस',
        fees: 0,
        status: 'active'
      },
      {
        id: 'water-connection-006',
        name: 'जल कनेक्शन / Water Connection',
        description: 'आवासीय और व्यावसायिक संपत्तियों के लिए नया जल कनेक्शन आवेदन।',
        category: 'utilities',
        requiredDocuments: ['संपत्ति दस्तावेज', 'पहचान प्रमाण', 'निवास प्रमाण', 'साइट प्लान'],
        processingTime: '२१ कार्य दिवस',
        fees: 500,
        status: 'active'
      },
      {
        id: 'business-license-007',
        name: 'व्यापार लाइसेंस / Business License',
        description: 'गांव की सीमा के भीतर दुकानों और सेवाओं सहित छोटे व्यापार संचालन के लिए लाइसेंस।',
        category: 'licenses',
        requiredDocuments: ['व्यापार योजना', 'पहचान प्रमाण', 'निवास प्रमाण', 'पड़ोसियों से अनापत्ति प्रमाण पत्र'],
        processingTime: '२० कार्य दिवस',
        fees: 200,
        status: 'active'
      },
      {
        id: 'marriage-cert-008',
        name: 'विवाह प्रमाण पत्र / Marriage Certificate',
        description: 'कानूनी मान्यता के लिए आधिकारिक विवाह प्रमाण पत्र पंजीकरण।',
        category: 'certificates',
        requiredDocuments: ['विवाह का निमंत्रण', 'पहचान प्रमाण (दोनों)', 'निवास प्रमाण', 'गवाह दस्तावेज'],
        processingTime: '१४ कार्य दिवस',
        fees: 100,
        status: 'active'
      },
      {
        id: 'building-permission-009',
        name: 'भवन निर्माण अनुमति / Building Permission',
        description: 'आवासीय/व्यावसायिक भवनों के निर्माण या नवीनीकरण के लिए अनुमति।',
        category: 'permits',
        requiredDocuments: ['साइट प्लान', 'संपत्ति दस्तावेज', 'इंजीनियर से अनापत्ति प्रमाण पत्र', 'पर्यावरण मंजूरी'],
        processingTime: '३० कार्य दिवस',
        fees: 1000,
        status: 'active'
      },
      {
        id: 'senior-citizen-010',
        name: 'वरिष्ठ नागरिक पहचान / Senior Citizen ID',
        description: 'आयु-संबंधी लाभों तक पहुंच के लिए वरिष्ठ नागरिकों के लिए विशेष पहचान।',
        category: 'certificates',
        requiredDocuments: ['आयु प्रमाण', 'पहचान प्रमाण', 'निवास प्रमाण', 'चिकित्सा प्रमाण पत्र'],
        processingTime: '५ कार्य दिवस',
        fees: 25,
        status: 'active'
      }
    ];

    setTimeout(() => {
      setServices(authenticIndianServices);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory && service.status === 'active';
  });

  const categories = [...new Set(services.map(service => service.category))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">सेवाएं लोड हो रही हैं...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Enhanced Indian Header */}
      <header className="bg-gradient-to-r from-orange-600 via-white to-green-600 shadow-lg border-b-4 border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate('/')} className="text-blue-900 hover:bg-blue-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('backToHome')}
              </Button>
              <div className="h-8 w-px bg-blue-300 mx-4" />
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-b from-orange-500 via-white to-green-500 rounded-lg flex items-center justify-center border-2 border-blue-600">
                  <span className="text-blue-800 font-bold text-lg">🇮🇳</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-blue-900">{t('eServicePortal')}</h1>
                  <p className="text-sm text-blue-800">{t('browseServices')}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <LanguageSelector variant="button" />
              <Button variant="outline" onClick={() => navigate('/login')} className="border-orange-600 text-orange-700 hover:bg-orange-50">
                {t('login')}
              </Button>
              <Button onClick={() => navigate('/register')} className="bg-green-600 hover:bg-green-700">
                {t('registerToApply')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Page Header with Indian elements */}
        <div className="text-center mb-8 bg-gradient-to-r from-orange-100 to-green-100 p-6 rounded-lg border-2 border-orange-200">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <span className="text-3xl">🇮🇳</span>
            <h1 className="text-3xl font-bold text-gray-900">{t('gramPanchayatServices')}</h1>
            <span className="text-3xl">🇮🇳</span>
          </div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {t('serviceDescription')}
          </p>
        </div>

        {/* Enhanced Search and Filter Section */}
        <Card className="mb-8 border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-green-50">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-orange-600" />
                  <Input
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-orange-300 focus:border-green-500"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-64 border-orange-300 focus:border-green-500">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-orange-600" />
                    <SelectValue placeholder={t('allCategories')} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allCategories')}</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center space-x-2">
                        <Grid3X3 className="h-4 w-4" />
                        <span>{t(category)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service Statistics */}
            <div className="flex justify-center mt-4 space-x-6">
              <div className="text-center">
                <Badge className="bg-orange-100 text-orange-800 border-orange-300 px-3 py-1">
                  {filteredServices.length} {t('servicesAvailable')}
                </Badge>
              </div>
              <div className="text-center">
                <Badge className="bg-green-100 text-green-800 border-green-300 px-3 py-1">
                  {t('freeProcessing')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredServices.map((service) => (
            <IndianServiceCard
              key={service.id}
              service={service}
              onApply={() => navigate('/register')}
            />
          ))}
        </div>

        {/* No Results with Indian styling */}
        {filteredServices.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg border-2 border-orange-200">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 mx-auto mb-4 text-orange-500" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noServicesFound')}</h3>
              <p className="text-gray-600 mb-4">
                {t('adjustCriteria')}
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                {t('clearFilters')}
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced Info Section */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-100 border-2 border-blue-300">
            <CardContent className="pt-6">
              <div className="max-w-2xl mx-auto">
                <div className="flex justify-center items-center space-x-2 mb-4">
                  <span className="text-2xl">🏛️</span>
                  <h3 className="text-lg font-semibold text-blue-900">
                    {t('readyToStart')}
                  </h3>
                  <span className="text-2xl">📋</span>
                </div>
                <p className="text-blue-800 mb-4">
                  {t('createAccountDesc')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => navigate('/register')} className="bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700">
                    {t('createAccount')}
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/login')} className="border-blue-600 text-blue-700 hover:bg-blue-50">
                    {t('alreadyHaveAccount')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Services;
