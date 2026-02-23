import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertCircle, Save, RotateCcw, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const VIP_SCALE_DATA = [
  {
    score: 0,
    title: "Skor 0",
    circleColor: "bg-green-500",
    borderColor: "border-green-500",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694161f617aa933f3fd01621/705c46881_Gemini_Generated_Image_24hq3x24hq3x24hq.png",
    criteriaText: "Lokasi intravena tampak sehat",
    criteria: ["Lokasi intravena tampak sehat"],
    interpretation: "Tidak ada tanda-tanda phlebitis.",
    interpretationBg: "bg-green-100",
    interventionTitle: "OBSERVASI KANULA",
    interventionBg: "bg-green-100",
    interventions: [
      "Melanjutkan observasi rutin.",
      "Memastikan balutan bersih dan utuh.",
      "Mempertahankan teknik aseptik dan patensi infus.",
      "Mengedukasi pasien untuk melapor jika ada nyeri."
    ]
  },
  {
    score: 1,
    title: "Skor 1",
    circleColor: "bg-[#f3d78f]",
    borderColor: "border-[#f3d78f]",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694161f617aa933f3fd01621/888f19fb2_Gemini_Generated_Image_omjr23omjr23omjr.png",
    criteriaText: "Salah satu dari tanda berikut, terbukti:",
    criteria: ["Nyeri sedikit diadekat lokasi, atau;", "Kemerahan sedikit di dekat lokasi intravena."],
    interpretation: "Kemungkinan tanda-tanda awal flebitis.",
    interpretationBg: "bg-[#fef3c7]",
    interventionTitle: "OBSERVASI KANULA (waspada)",
    interventionBg: "bg-[#fef3c7]",
    interventions: [
      "Jangan atau tidak mencabut infus (kecuali diperlukan).",
      "Memantau area insersi lebih sering (misal: tiap 4 jam).",
      "Memberikan kompres hangat, serta pemberian analgesik (jika diperlukan)",
      "Mengecek kepatenan aliran infus."
    ]
  },
  {
    score: 2,
    title: "Skor 2",
    circleColor: "bg-[#f3b878]",
    borderColor: "border-[#f3b878]",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694161f617aa933f3fd01621/4f8d957ab_Gemini_Generated_Image_8fjo8y8fjo8y8fjo.png",
    criteriaText: "Dua dari tanda-tanda berikut terbukti:",
    criteria: ["Nyeri di lokasi intravena, dan/atau;", "Kemerahan, dan/atau;", "Bengkak."],
    interpretation: "Flebitis tingkat awal.",
    interpretationBg: "bg-[#fed7aa]",
    interventionTitle: "PINDAHKAN KANULA",
    interventionBg: "bg-[#fed7aa]",
    interventions: [
      "Menghentikan infus.",
      "Melepas/mencabut kanula intravena.",
      "Memasang infus dilokasi baru (ekstremitas berbeda jika memungkinkan).",
      "Mendokumentasikan kejadian.",
      "Area bekas infus dibersihkan, mengelevasi ekstremitas, dan memberikan kompres hangat."
    ]
  },
  {
    score: 3,
    title: "Skor 3",
    circleColor: "bg-[#ea6c5f]",
    borderColor: "border-[#ea6c5f]",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694161f617aa933f3fd01621/060eed10e_Gemini_Generated_Image_1s9nb11s9nb11s9n.png",
    criteriaText: "Semua tanda-tanda berikut, terbukti:",
    criteria: ["Nyeri di sepanjang jalur kanula,", "Kemerahan di sekitar lokasi intravena,", "Bengkak, dan;", "Pembengkakan vena yang teraba (terasa)."],
    interpretation: "Flebitis tingkat sedang.",
    interpretationBg: "bg-[#fecaca]",
    interventionTitle: "PINDAHKAN KANULA & PERTIMBANGKAN TERAPI",
    interventionBg: "bg-[#fecaca]",
    interventions: [
      "Melepas kanula segera.",
      "Memasang infus di lokasi baru.",
      "Mengelevasi ekstremitas.",
      "Melakukan kompres (hangat/dingin sesuai SOP).",
      "Berkolaborasi pemberian analgesik, jika perlu.",
      "Mempertimbangkan penggunaan antibiotik (jika terdapat indikasi).",
      "Mendokumentasikan kejadian."
    ]
  },
  {
    score: 4,
    title: "Skor 4",
    circleColor: "bg-[#b44c5c]",
    borderColor: "border-[#b44c5c]",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694161f617aa933f3fd01621/db448d7cb_Gemini_Generated_Image_3r9w523r9w523r9w1.png",
    criteriaText: "Semua tanda-tanda berikut terbukti dan ekstensif (meluas):",
    criteria: ["Nyeri di sepanjang jalur kanula,", "Kemerahan di sekitar lokasi,", "Bengkak, dan;", "Pembengkakan vena yang teraba (terasa)."],
    interpretation: "Flebitis tahap lanjut atau awal tromboflebitis.",
    interpretationBg: "bg-[#fca5a5]",
    interventionTitle: "PINDAHKAN KANULA & PERTIMBANGKAN TERAPI",
    interventionBg: "bg-[#fca5a5]",
    interventions: [
      "Melepas kanula segera.",
      "Memasang infus di lokasi baru.",
      "Mengelevasi ekstremitas.",
      "Melakukan kompres (hangat/dingin sesuai SOP) dan manajemen nyeri.",
      "Berkolaborasi untuk pertimbangkan terapi antibiotik/anti-inflamasi, jika ada infeksi. Evaluasi resiko trombosis.",
      "Mendokumentasikan kejadian."
    ]
  },
  {
    score: 5,
    title: "Skor 5",
    circleColor: "bg-[#7c2d5e]",
    borderColor: "border-[#7c2d5e]",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694161f617aa933f3fd01621/0260ab0a4_Gemini_Generated_Image_bomyiubomyiubomy.png",
    criteriaText: "Semua tanda-tanda berikut, terbukti dan ekstensif (meluas):",
    criteria: ["Nyeri di sepanjang jalur kanula,", "Kemerahan di sekitar lokasi,", "Bengkak,", "Pembengkakan vena yang teraba (terasa), dan;", "Pireksia (demam)."],
    interpretation: "Tromboflebitis tahap lanjut.",
    interpretationBg: "bg-[#e9d5ff]",
    interventionTitle: "MULAI TERAPI",
    interventionBg: "bg-[#e9d5ff]",
    interventions: [
      "Melepas kanula segera.",
      "Membersihkan bekas area bekas insersi.",
      "Memantau tanda-tanda sepsis.",
      "Melakukan pemeriksaan kultur ujung kateter dan darah vena, jika ada pus/tanda infeksi sistemik).",
      "Memasang infus kembali, (jika diperlukan).",
      "Jika memerlukan terapi jangka panjang, pertimbangkan pemasangan PICC.",
      "Berkolaborasi untuk terapi antibiotik dan analgesik.",
      "Mendokumentasikan kejadian."
    ]
  }
];

export default function Monitor() {
  const navigate = useNavigate();
  const [selectedScore, setSelectedScore] = useState(null);
  const [checkedCriteria, setCheckedCriteria] = useState({});
  const [checkedInterventions, setCheckedInterventions] = useState({});
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportData, setReportData] = useState({
    name: '',
    email: '',
    problem: ''
  });
  const [formData, setFormData] = useState({
    patient_name: '',
    room_number: '',
    bed_number: '',
    iv_site: '',
    iv_site_other: '',
    notes: '',
    nurse_name: ''
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.InfusMonitor.create(data),
    onSuccess: () => {
      toast.success('Data monitoring berhasil disimpan!');
      navigate(createPageUrl('RiwayatLog'));
    },
    onError: (error) => {
      toast.error('Gagal menyimpan data: ' + error.message);
    }
  });

  const reportMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.integrations.Core.SendEmail({
        to: 'jerry.afrandi0@gmail.com',
        subject: `Laporan Masalah Aplikasi VIP Scale Monitor - ${data.name}`,
        body: `
Laporan Masalah Aplikasi

Nama Pelapor: ${data.name}
Email: ${data.email}
Waktu Laporan: ${new Date().toLocaleString('id-ID')}

Deskripsi Masalah:
${data.problem}

---
Laporan ini dikirim otomatis dari aplikasi VIP Scale Monitor.
        `
      });
    },
    onSuccess: () => {
      toast.success('Laporan masalah berhasil dikirim ke admin!');
      setShowReportDialog(false);
      setReportData({ name: '', email: '', problem: '' });
    },
    onError: (error) => {
      toast.error('Gagal mengirim laporan: ' + error.message);
    }
  });

  const handleReportSubmit = () => {
    if (!reportData.name || !reportData.email || !reportData.problem) {
      toast.error('Mohon lengkapi semua data laporan');
      return;
    }
    reportMutation.mutate(reportData);
  };

  const handleScoreSelect = (score) => {
    setSelectedScore(score);
    const scoreData = VIP_SCALE_DATA.find(s => s.score === score);
    // Auto-check all criteria
    const allCriteriaChecked = {};
    scoreData.criteria.forEach((_, idx) => {
      allCriteriaChecked[idx] = true;
    });
    setCheckedCriteria(allCriteriaChecked);
    setCheckedInterventions({});
  };

  const handleSubmit = () => {
    if (!formData.patient_name || !formData.room_number || !formData.nurse_name) {
      toast.error('Mohon lengkapi data pasien terlebih dahulu');
      return;
    }

    const scoreData = VIP_SCALE_DATA.find(s => s.score === selectedScore);
    const finalIvSite = formData.iv_site === 'Lainnya' ? formData.iv_site_other : formData.iv_site;
    
    // Get checked interventions
    const checkedInterventionsList = scoreData.interventions.filter((_, idx) => checkedInterventions[idx]);
    
    createMutation.mutate({
      ...formData,
      iv_site: finalIvSite,
      vip_score: selectedScore,
      symptoms: scoreData.criteria,
      action_taken: scoreData.interventionTitle,
      interventions_checked: checkedInterventionsList,
      monitoring_date: new Date().toISOString()
    });
  };

  if (selectedScore === null) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-[#2c3e5f] py-4 px-6">
          <div className="container mx-auto flex items-center justify-end">
            <button 
              onClick={() => setShowReportDialog(true)}
              className="flex items-center gap-2 text-white cursor-pointer hover:text-gray-200"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">Laporkan Masalah</span>
            </button>
          </div>
          <div className="container mx-auto">
            <h1 className="text-white text-xl md:text-2xl font-bold">VIP Scale Monitor</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#2c3e5f] text-center mb-8">
              Bagaimana keadaan infus pasien hari ini?
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {VIP_SCALE_DATA.map((data, index) => (
                <motion.div
                  key={data.score}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`border-3 ${data.borderColor} cursor-pointer hover:shadow-lg transition-all duration-300 h-full rounded-xl`}
                    onClick={() => handleScoreSelect(data.score)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`${data.circleColor} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0`}>
                          {data.score}
                        </div>
                        <h3 className="text-base font-bold text-[#2c3e5f] mt-2">{data.title}</h3>
                      </div>

                      <div className="mb-3">
                        <img 
                          src={data.image}
                          alt={`Ilustrasi ${data.title}`}
                          className="w-full h-32 object-contain"
                        />
                      </div>

                      <p className="text-xs text-gray-700 mb-2 font-medium">
                        {data.criteriaText}
                      </p>

                      <ul className="space-y-1">
                        {data.criteria.map((criterion, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                            <span className="text-gray-800">•</span>
                            <span>{criterion}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const scoreData = VIP_SCALE_DATA.find(s => s.score === selectedScore);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#2c3e5f] py-4 px-6">
        <div className="container mx-auto flex items-center justify-end">
          <button 
            onClick={() => setShowReportDialog(true)}
            className="flex items-center gap-2 text-white cursor-pointer hover:text-gray-200"
          >
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">Laporkan Masalah</span>
          </button>
        </div>
        <div className="container mx-auto">
          <h1 className="text-white text-xl md:text-2xl font-bold">VIP Scale Monitor</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Score Display */}
        <Card className="mb-6">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">
              <div className={`w-20 h-20 rounded-full ${scoreData.circleColor} flex items-center justify-center text-white font-bold text-4xl shadow-lg`}>
                {selectedScore}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#2c3e5f] mb-6">{scoreData.title}</h2>
            
            <div className="mb-6">
              <img 
                src={scoreData.image}
                alt={scoreData.title}
                className="w-64 h-64 mx-auto object-contain"
              />
            </div>

            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <p className="font-semibold text-gray-700 mb-3">Kriteria:</p>
              <p className="text-gray-600 text-sm mb-2">{scoreData.criteriaText}</p>
              <div className="space-y-2 text-left max-w-md mx-auto">
                {scoreData.criteria.map((criterion, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Checkbox
                      id={`criteria-${idx}`}
                      checked={checkedCriteria[idx] || false}
                      onCheckedChange={(checked) => setCheckedCriteria({...checkedCriteria, [idx]: checked})}
                    />
                    <label htmlFor={`criteria-${idx}`} className="text-sm text-gray-700 cursor-pointer">
                      {criterion}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interpretation */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold text-[#2c3e5f] mb-3 flex items-center gap-2">
              🔍 Interpretasi
            </h3>
            <div className={`${scoreData.interpretationBg} rounded-lg p-4`}>
              <p className="text-gray-800 text-center font-medium">{scoreData.interpretation}</p>
            </div>
          </CardContent>
        </Card>

        {/* Intervention */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold text-[#2c3e5f] mb-3 flex items-center gap-2">
              💊 Intervensi Keperawatan
            </h3>
            <div className={`${scoreData.interventionBg} rounded-lg p-4`}>
              <p className="font-bold text-gray-800 mb-3 text-center">{scoreData.interventionTitle}</p>
              <div className="space-y-2">
                {scoreData.interventions.map((intervention, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Checkbox
                      id={`intervention-${idx}`}
                      checked={checkedInterventions[idx] || false}
                      onCheckedChange={(checked) => setCheckedInterventions({...checkedInterventions, [idx]: checked})}
                    />
                    <label htmlFor={`intervention-${idx}`} className="text-sm text-gray-800 cursor-pointer">
                      {intervention}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Form */}
        <Card className="mb-6">
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-bold text-[#2c3e5f] mb-4">Informasi Pasien</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient_name">Nama Pasien *</Label>
                <Input
                  id="patient_name"
                  value={formData.patient_name}
                  onChange={(e) => setFormData({...formData, patient_name: e.target.value})}
                  placeholder="Masukkan nama pasien"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room_number">Nomor Kamar *</Label>
                <Input
                  id="room_number"
                  value={formData.room_number}
                  onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                  placeholder="Contoh: 201"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bed_number">Nomor Tempat Tidur</Label>
                <Input
                  id="bed_number"
                  value={formData.bed_number}
                  onChange={(e) => setFormData({...formData, bed_number: e.target.value})}
                  placeholder="Contoh: A"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="iv_site">Lokasi Pemasangan Infus</Label>
                <Select
                  value={formData.iv_site}
                  onValueChange={(value) => setFormData({...formData, iv_site: value, iv_site_other: ''})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih lokasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basilic vein (dextra)">Basilic vein (dextra)</SelectItem>
                    <SelectItem value="Basilic vein (sinistra)">Basilic vein (sinistra)</SelectItem>
                    <SelectItem value="Cephalic vein (dextra)">Cephalic vein (dextra)</SelectItem>
                    <SelectItem value="Cephalic vein (sinistra)">Cephalic vein (sinistra)</SelectItem>
                    <SelectItem value="Dorsal metacarpal vein (dextra)">Dorsal metacarpal vein (dextra)</SelectItem>
                    <SelectItem value="Dorsal metacarpal vein (sinistra)">Dorsal metacarpal vein (sinistra)</SelectItem>
                    <SelectItem value="Great saphenous vein (dextra)">Great saphenous vein (dextra)</SelectItem>
                    <SelectItem value="Great saphenous vein (sinistra)">Great saphenous vein (sinistra)</SelectItem>
                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.iv_site === 'Lainnya' && (
                <div className="space-y-2">
                  <Label htmlFor="iv_site_other">Lokasi Lainnya</Label>
                  <Input
                    id="iv_site_other"
                    value={formData.iv_site_other}
                    onChange={(e) => setFormData({...formData, iv_site_other: e.target.value})}
                    placeholder="Masukkan lokasi pemasangan infus"
                  />
                </div>
              )}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nurse_name">Nama Perawat *</Label>
                <Input
                  id="nurse_name"
                  value={formData.nurse_name}
                  onChange={(e) => setFormData({...formData, nurse_name: e.target.value})}
                  placeholder="Masukkan nama perawat"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Catatan Tambahan</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Tambahkan catatan jika diperlukan..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Button
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="flex-1 bg-[#ff9b6a] hover:bg-[#ff8c57] text-white font-bold py-6 rounded-full"
          >
            <Save className="w-5 h-5 mr-2" />
            {createMutation.isPending ? 'Menyimpan...' : 'Simpan Hasil'}
          </Button>
          <Button 
            onClick={() => setSelectedScore(null)}
            className="flex-1 bg-[#fbbf24] hover:bg-[#f59e0b] text-white font-bold py-6 rounded-full"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Monitor Lagi
          </Button>
        </div>

        <Link to={createPageUrl('Home')}>
          <Button className="w-full bg-[#2d9b87] hover:bg-[#248a77] text-white font-bold py-6 rounded-full">
            <Home className="w-5 h-5 mr-2" />
            Kembali ke Beranda
          </Button>
        </Link>

        {/* Report Dialog */}
        <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Laporkan Masalah
              </DialogTitle>
              <DialogDescription>
                Sampaikan masalah atau error yang Anda alami saat menggunakan aplikasi
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report_name">Nama Anda *</Label>
                <Input
                  id="report_name"
                  value={reportData.name}
                  onChange={(e) => setReportData({...reportData, name: e.target.value})}
                  placeholder="Masukkan nama Anda"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="report_email">Email *</Label>
                <Input
                  id="report_email"
                  type="email"
                  value={reportData.email}
                  onChange={(e) => setReportData({...reportData, email: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="report_problem">Deskripsi Masalah *</Label>
                <Textarea
                  id="report_problem"
                  value={reportData.problem}
                  onChange={(e) => setReportData({...reportData, problem: e.target.value})}
                  placeholder="Jelaskan masalah yang Anda alami..."
                  rows={5}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowReportDialog(false)}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleReportSubmit}
                  disabled={reportMutation.isPending}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  {reportMutation.isPending ? 'Mengirim...' : 'Kirim Laporan'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
