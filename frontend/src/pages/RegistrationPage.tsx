import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft, ArrowRight, User, Building, CreditCard, CheckCircle, Package } from 'lucide-react';
import { createStudent } from '../lib/api';
import type { FormData } from '../types';

const schema = yup.object({
  paket: yup.string().oneOf(['pius-plus', 'pius-pro']).required('Paket je obavezan'),
  ime: yup.string().required('Ime je obavezno'),
  prezime: yup.string().required('Prezime je obavezno'),
  adresa: yup.string().required('Adresa je obavezna'),
  postanskiBroj: yup.string().required('Poštanski broj je obavezan'),
  mjesto: yup.string().required('Mjesto je obavezno'),
  drzava: yup.string().required('Država je obavezna'),
  telefon: yup.string().required('Telefon je obavezan'),
  email: yup.string().email('Email nije valjan').required('Email je obavezan'),
  brojLicnogDokumenta: yup.string().required('Broj ličnog dokumenta je obavezan'),
  tipLica: yup.string().oneOf(['fizicko', 'pravno']).required(),
  nacinPlacanja: yup.string().oneOf(['cjelokupno', 'rate']).required(),
  nazivFirme: yup.string().when('tipLica', {
    is: 'pravno',
    then: (s) => s.required('Naziv firme je obavezan'),
  }),
  pdvBroj: yup.string().when('tipLica', {
    is: 'pravno',
    then: (s) => s.required('PDV broj je obavezan'),
  }),
  adresaFirme: yup.string().when('tipLica', {
    is: 'pravno',
    then: (s) => s.required('Adresa firme je obavezna'),
  }),
  postanskiBrojFirme: yup.string().when('tipLica', {
    is: 'pravno',
    then: (s) => s.required('Poštanski broj firme je obavezan'),
  }),
  mjestoFirme: yup.string().when('tipLica', {
    is: 'pravno',
    then: (s) => s.required('Mjesto firme je obavezno'),
  }),
  drzavaFirme: yup.string().when('tipLica', {
    is: 'pravno',
    then: (s) => s.required('Država firme je obavezna'),
  }),
  registracijaFirme: yup.string().when('tipLica', {
    is: 'pravno',
    then: (s) => s.required('Registracijski broj je obavezan'),
  }),
});

interface Props {
  preselectedPackage?: 'pius-plus' | 'pius-pro';
}

export default function RegistrationPage({ preselectedPackage }: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState(preselectedPackage ? 1 : 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, watch, formState: { errors }, trigger } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
    defaultValues: {
      paket: preselectedPackage || 'pius-plus',
      tipLica: 'fizicko',
      nacinPlacanja: 'rate',
    },
  });

  const paket = watch('paket');
  const tipLica = watch('tipLica');
  const nacinPlacanja = watch('nacinPlacanja');

  const totalSteps = preselectedPackage ? 3 : 4;

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');

    try {
      const response = await createStudent({
        first_name: data.ime,
        last_name: data.prezime,
        address: data.adresa,
        postal_code: data.postanskiBroj,
        city: data.mjesto,
        country: data.drzava,
        phone: data.telefon,
        email: data.email,
        id_document_number: data.brojLicnogDokumenta,
        entity_type: data.tipLica === 'fizicko' ? 'individual' : 'company',
        payment_method: data.nacinPlacanja === 'cjelokupno' ? 'full' : 'installments',
        package_type: data.paket,
        company_name: data.nazivFirme,
        vat_number: data.pdvBroj,
        company_address: data.adresaFirme,
        company_postal_code: data.postanskiBrojFirme,
        company_city: data.mjestoFirme,
        company_country: data.drzavaFirme,
        company_registration: data.registracijaFirme,
      });

      if (data.nacinPlacanja === 'rate') {
        navigate('/ugovor', { state: { studentId: response.data.id, formData: data } });
      } else {
        navigate('/hvala', { state: { isContract: false, package: data.paket } });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Greška pri registraciji. Pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];

    if (step === 0 && !preselectedPackage) {
      fieldsToValidate = ['paket'];
    } else if ((step === 1 && !preselectedPackage) || (step === 0 && preselectedPackage)) {
      fieldsToValidate = ['ime', 'prezime', 'adresa', 'postanskiBroj', 'mjesto', 'drzava', 'brojLicnogDokumenta'];
    } else if ((step === 2 && !preselectedPackage) || (step === 1 && preselectedPackage)) {
      if (tipLica === 'pravno') {
        fieldsToValidate = ['telefon', 'email', 'nazivFirme', 'pdvBroj', 'adresaFirme', 'postanskiBrojFirme', 'mjestoFirme', 'drzavaFirme', 'registracijaFirme'];
      } else {
        fieldsToValidate = ['telefon', 'email'];
      }
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(s => Math.min(s + 1, totalSteps - 1));
    }
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-black text-white font-poppins py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-pius/30 rounded-2xl shadow-2xl p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-400 hover:text-pius transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Nazad
            </button>
            <div className="text-sm text-gray-400">Korak {step + 1} od {totalSteps}</div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-800 rounded-full h-2 mb-8">
            <div
              className="bg-gradient-to-r from-pius to-pius-dark h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-300 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 0: Package Selection */}
            {step === 0 && !preselectedPackage && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-center gap-2 mb-8">
                  <Package className="h-6 w-6 text-pius" />
                  <h2 className="text-xl font-semibold">Odaberite paket</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* PIUS PLUS */}
                  <label className="relative cursor-pointer">
                    <input type="radio" value="pius-plus" {...register('paket')} className="sr-only" />
                    <div className={`border-2 rounded-2xl p-6 transition-all h-full ${
                      paket === 'pius-plus' ? 'border-pius bg-pius/5' : 'border-gray-700 hover:border-gray-600'
                    }`}>
                      <div className="text-center mb-4">
                        <h3 className="text-2xl font-bold text-white mb-1">PIUS PLUS</h3>
                        <div className="text-3xl font-black text-pius mb-1">1.800€</div>
                        <p className="text-sm text-gray-400">Osnovni paket</p>
                      </div>
                      <div className="border-t border-gray-700 pt-4 mt-4">
                        <p className="text-sm font-semibold text-pius mb-3">Šta dobijate:</p>
                        <div className="space-y-2 text-sm text-gray-300">
                          {[
                            '60 dana kompletne edukacije',
                            'Pristup video materijalima',
                            'WhatsApp grupa za podršku',
                            'Sedmični grupni pozivi',
                            'Digitalni certifikat'
                          ].map((item, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-pius mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* PIUS PRO */}
                  <label className="relative cursor-pointer">
                    <input type="radio" value="pius-pro" {...register('paket')} className="sr-only" />
                    <div className={`border-2 rounded-2xl p-6 transition-all relative h-full ${
                      paket === 'pius-pro' ? 'border-pius bg-pius/5' : 'border-gray-700 hover:border-gray-600'
                    }`}>
                      <div className="absolute -top-3 right-4 bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-bold">
                        PREMIUM
                      </div>
                      <div className="text-center mb-4">
                        <h3 className="text-2xl font-bold text-white mb-1">PIUS PRO</h3>
                        <div className="text-3xl font-black text-pius mb-1">2.500€</div>
                        <p className="text-sm text-gray-400">Premium paket</p>
                      </div>
                      <div className="border-t border-gray-700 pt-4 mt-4">
                        <p className="text-sm font-semibold text-pius mb-3">Šta dobijate:</p>
                        <div className="space-y-2 text-sm text-gray-300">
                          {[
                            '60 dana kompletne edukacije',
                            'Pristup video materijalima',
                            'WhatsApp grupa za podršku',
                            'Sedmični grupni pozivi',
                            'Digitalni certifikat'
                          ].map((item, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-pius mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                          <div className="flex items-start gap-2 pt-2 text-pius">
                            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span className="font-medium">Startni paket za rad: Mašina za PMU, 20 igala, 3 boje, mjerač za obrve, 10 posuda za boju, lateks za vježbanje</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full mt-8 bg-gradient-to-r from-pius to-pius-dark text-black py-4 rounded-xl font-semibold flex items-center justify-center text-lg hover:opacity-90 transition-opacity"
                >
                  Nastavi <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </motion.div>
            )}

            {/* Step 1: Entity Type & Basic Info */}
            {((step === 1 && !preselectedPackage) || (step === 0 && preselectedPackage)) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-8">
                  <label className="block text-lg font-medium mb-4">Tip registracije</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="cursor-pointer">
                      <input type="radio" value="fizicko" {...register('tipLica')} className="sr-only" />
                      <div className={`border-2 rounded-xl p-6 text-center transition-all ${
                        tipLica === 'fizicko' ? 'border-pius bg-pius/10' : 'border-gray-700'
                      }`}>
                        <User className="h-8 w-8 mx-auto mb-3 text-pius" />
                        <div className="font-medium">Fizičko lice</div>
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="radio" value="pravno" {...register('tipLica')} className="sr-only" />
                      <div className={`border-2 rounded-xl p-6 text-center transition-all ${
                        tipLica === 'pravno' ? 'border-pius bg-pius/10' : 'border-gray-700'
                      }`}>
                        <Building className="h-8 w-8 mx-auto mb-3 text-pius" />
                        <div className="font-medium">Pravno lice</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Ime *</label>
                    <input
                      {...register('ime')}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pius text-white"
                    />
                    {errors.ime && <p className="text-red-400 text-sm mt-1">{errors.ime.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Prezime *</label>
                    <input
                      {...register('prezime')}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pius text-white"
                    />
                    {errors.prezime && <p className="text-red-400 text-sm mt-1">{errors.prezime.message}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Adresa *</label>
                  <input
                    {...register('adresa')}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pius text-white"
                  />
                  {errors.adresa && <p className="text-red-400 text-sm mt-1">{errors.adresa.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Poštanski broj *</label>
                    <input
                      {...register('postanskiBroj')}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pius text-white"
                    />
                    {errors.postanskiBroj && <p className="text-red-400 text-sm mt-1">{errors.postanskiBroj.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mjesto *</label>
                    <input
                      {...register('mjesto')}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pius text-white"
                    />
                    {errors.mjesto && <p className="text-red-400 text-sm mt-1">{errors.mjesto.message}</p>}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Država *</label>
                  <input
                    {...register('drzava')}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pius text-white"
                  />
                  {errors.drzava && <p className="text-red-400 text-sm mt-1">{errors.drzava.message}</p>}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Broj ličnog dokumenta (pasoš, lična karta) *</label>
                  <input
                    {...register('brojLicnogDokumenta')}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pius text-white"
                    placeholder="Unesite broj pasoša ili lične karte"
                  />
                  {errors.brojLicnogDokumenta && <p className="text-red-400 text-sm mt-1">{errors.brojLicnogDokumenta.message}</p>}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => preselectedPackage ? navigate('/') : prevStep()}
                    className="flex-1 border border-gray-600 text-gray-300 py-3 rounded-lg font-medium flex items-center justify-center"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" /> Nazad
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-gradient-to-r from-pius to-pius-dark text-black py-3 rounded-lg font-medium flex items-center justify-center"
                  >
                    Nastavi <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Contact & Company Info */}
            {((step === 2 && !preselectedPackage) || (step === 1 && preselectedPackage)) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {tipLica === 'pravno' && (
                  <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-semibold text-pius">Podaci o firmi</h3>
                    <input
                      {...register('nazivFirme')}
                      placeholder="Naziv firme *"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                    {errors.nazivFirme && <p className="text-red-400 text-sm mt-1">{errors.nazivFirme.message}</p>}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          {...register('pdvBroj')}
                          placeholder="PDV broj *"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        />
                        {errors.pdvBroj && <p className="text-red-400 text-sm mt-1">{errors.pdvBroj.message}</p>}
                      </div>
                      <div>
                        <input
                          {...register('registracijaFirme')}
                          placeholder="Registracijski broj *"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        />
                        {errors.registracijaFirme && <p className="text-red-400 text-sm mt-1">{errors.registracijaFirme.message}</p>}
                      </div>
                    </div>
                    <input
                      {...register('adresaFirme')}
                      placeholder="Adresa firme *"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                    {errors.adresaFirme && <p className="text-red-400 text-sm mt-1">{errors.adresaFirme.message}</p>}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          {...register('postanskiBrojFirme')}
                          placeholder="Poštanski broj *"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        />
                        {errors.postanskiBrojFirme && <p className="text-red-400 text-sm mt-1">{errors.postanskiBrojFirme.message}</p>}
                      </div>
                      <div>
                        <input
                          {...register('mjestoFirme')}
                          placeholder="Mjesto *"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        />
                        {errors.mjestoFirme && <p className="text-red-400 text-sm mt-1">{errors.mjestoFirme.message}</p>}
                      </div>
                    </div>
                    <input
                      {...register('drzavaFirme')}
                      placeholder="Država *"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                    {errors.drzavaFirme && <p className="text-red-400 text-sm mt-1">{errors.drzavaFirme.message}</p>}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Telefon *</label>
                    <input
                      {...register('telefon')}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      placeholder="+38x xx xxx xxx"
                    />
                    {errors.telefon && <p className="text-red-400 text-sm mt-1">{errors.telefon.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={prevStep} className="flex-1 border border-gray-600 text-gray-300 py-3 rounded-lg font-medium flex items-center justify-center">
                    <ArrowLeft className="h-5 w-5 mr-2" /> Nazad
                  </button>
                  <button type="button" onClick={nextStep} className="flex-1 bg-gradient-to-r from-pius to-pius-dark text-black py-3 rounded-lg font-medium flex items-center justify-center">
                    Nastavi <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment Method */}
            {((step === 3 && !preselectedPackage) || (step === 2 && preselectedPackage)) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <label className="block text-lg font-medium mb-4">
                  <CreditCard className="inline h-5 w-5 text-pius mr-2" />
                  Način plaćanja
                </label>

                <div className="space-y-4 mb-8">
                  <label className="block cursor-pointer">
                    <input type="radio" value="rate" {...register('nacinPlacanja')} className="sr-only" />
                    <div className={`border-2 rounded-xl p-6 transition-all ${
                      nacinPlacanja === 'rate' ? 'border-pius bg-pius/10' : 'border-gray-700'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="font-semibold text-lg">Plaćanje na rate</div>
                        <span className="bg-pius text-black px-3 py-1 rounded-full text-xs font-bold">PREPORUČENO</span>
                      </div>
                      <div className="mt-4 space-y-2 text-sm">
                        {paket === 'pius-plus' ? (
                          <>
                            <div className="flex justify-between text-gray-300">
                              <span>Prva rata (uplata u roku od 24h):</span>
                              <span className="font-semibold">400€</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                              <span>Druga rata (do 01.11.2025):</span>
                              <span className="font-semibold">500€</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                              <span>Treća rata (do 01.12.2025):</span>
                              <span className="font-semibold">900€</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between text-gray-300">
                              <span>Prva rata (uplata u roku od 24h):</span>
                              <span className="font-semibold">500€</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                              <span>Druga rata (do 01.11.2025):</span>
                              <span className="font-semibold">1.000€</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                              <span>Treća rata (do 01.12.2025):</span>
                              <span className="font-semibold">1.000€</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </label>

                  <label className="block cursor-pointer">
                    <input type="radio" value="cjelokupno" {...register('nacinPlacanja')} className="sr-only" />
                    <div className={`border-2 rounded-xl p-6 transition-all ${
                      nacinPlacanja === 'cjelokupno' ? 'border-pius bg-pius/10' : 'border-gray-700'
                    }`}>
                      <div className="font-semibold text-lg">Plaćanje u cjelosti</div>
                      <div className="text-sm text-gray-300 mt-2">
                        Ukupno: {paket === 'pius-plus' ? '1.800€' : '2.500€'} odmah
                      </div>
                    </div>
                  </label>
                </div>

                {/* Package info */}
                <div className="bg-gray-800/50 border border-pius/30 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-pius mr-2" />
                    Šta dobijate ({paket === 'pius-plus' ? 'PIUS PLUS' : 'PIUS PRO'}):
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• 60 dana kompletne edukacije</li>
                    <li>• Pristup video materijalima</li>
                    <li>• WhatsApp grupa za podršku</li>
                    <li>• Sedmični grupni pozivi</li>
                    <li>• Digitalni certifikat</li>
                    {paket === 'pius-pro' && (
                      <li className="text-pius font-semibold">• Startni paket za rad: Mašina za PMU, 20 igala, 3 boje, mjerač za obrve, 10 posuda za boju, lateks za vježbanje</li>
                    )}
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={prevStep} className="flex-1 border border-gray-600 text-gray-300 py-3 rounded-lg font-medium flex items-center justify-center">
                    <ArrowLeft className="h-5 w-5 mr-2" /> Nazad
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-pius to-pius-dark text-black py-3 rounded-lg font-bold disabled:opacity-50"
                  >
                    {loading ? 'Učitavanje...' : nacinPlacanja === 'rate' ? 'Nastavi na ugovor' : 'Završi registraciju'}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
