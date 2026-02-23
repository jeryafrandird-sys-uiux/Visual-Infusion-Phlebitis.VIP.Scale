import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Save, RotateCcw, Home } from 'lucide-react';
import { toast } from 'sonner';

export default function Skor0() {
  const navigate = useNavigate();
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

  const handleSubmit = () => {
    if (!formData.patient_name || !formData.room_number || !formData.nurse_name) {
      toast.error('Mohon lengkapi data pasien terlebih dahulu');
      return;
    }

    const finalIvSite = formData.iv_site === 'Lainnya' ? formData.iv_site_other : formData.iv_site;
    
    createMutation.mutate({
      ...formData,
      iv_site: finalIvSite,
      vip_score: 0,
      symptoms: ['Area IV tampak sehat'],
      action_taken: 'Tidak ada tindakan',
      monitoring_date: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#2c3e5f] py-4 px-6">
        <div className="container mx-auto flex items-center justify-end">
          <div className="flex items-center gap-2 text-white cursor-pointer">
            <FileText className="w-5 h-5" />
            <span className="text-sm">Report</span>
          </div>
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
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-4xl shadow-lg">
                0
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#2c3e5f] mb-6">Skor 0</h2>
            
            <div className="mb-6">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694161f617aa933f3fd01621/705c46881_Gemini_Generated_Image_24hq3x24hq3x24hq.png"
                alt="Skor 0"
                className="w-64 h-64 mx-auto object-contain"
              />
            </div>

            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <p className="font-semibold text-gray-700 mb-2">Kriteria:</p>
              <p className="text-gray-600">Lokasi intravena tampak sehat.</p>
            </div>
          </CardContent>
        </Card>

        {/* Interpretation */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold text-[#2c3e5f] mb-3 flex items-center gap-2">
              🔍 Interpretasi
            </h3>
            <div className="bg-green-100 rounded-lg p-4">
              <p className="text-green-800 text-center font-medium">Tidak ada tanda-tanda phlebitis.</p>
            </div>
          </CardContent>
        </Card>

        {/* Intervention */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold text-[#2c3e5f] mb-3 flex items-center gap-2">
              💊 Intervensi Keperawatan
            </h3>
            <div className="bg-green-100 rounded-lg p-4">
              <p className="font-bold text-green-800 mb-2">OBSERVASI KANULA</p>
              <ul className="text-green-800 space-y-1 text-sm">
                <li>• Lanjutkan observasi rutin.</li>
                <li>• Pastikan balutan bersih dan utuh.</li>
                <li>• Pertahankan teknik aseptik dan patensi infus.</li>
                <li>• Edukasi pasien untuk melapor jika ada nyeri.</li>
              </ul>
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
          <Link to={createPageUrl('Monitor')} className="flex-1">
            <Button className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-white font-bold py-6 rounded-full">
              <RotateCcw className="w-5 h-5 mr-2" />
              Monitor Lagi
            </Button>
          </Link>
        </div>

        <Link to={createPageUrl('Home')}>
          <Button className="w-full bg-[#2d9b87] hover:bg-[#248a77] text-white font-bold py-6 rounded-full">
            <Home className="w-5 h-5 mr-2" />
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
}
