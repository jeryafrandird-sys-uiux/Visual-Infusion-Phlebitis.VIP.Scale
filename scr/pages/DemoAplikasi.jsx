import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { FileText, Home } from 'lucide-react';

export default function DemoAplikasi() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#2c3e5f] py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-white text-xl md:text-2xl font-bold">VIP Scale Monitor</h1>
          <div className="flex flex-col items-center text-white cursor-pointer hover:text-gray-200">
            <FileText className="w-5 h-5" />
            <span className="text-xs">Report</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">

        {/* Apa itu VIP Scale */}
        <div className="bg-white rounded-xl shadow-sm mb-5 overflow-hidden">
          {/* Section title */}
          <div className="bg-[#2d9b87] px-5 py-3">
            <h2 className="text-white font-bold text-base">
              Apa itu <em>Visual Infusion Phlebitis</em> (VIP) Scale?
            </h2>
          </div>

          <div className="p-5 space-y-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Visual Infusion Phlebitis (VIP) Scale</strong> adalah Visual Infusion Phlebitis (VIP) Scale adalah
              instrumen pengukuran klinis standar yang digunakan untuk menilai tingkat keparahan
              flebitis (inflamasi vena) yang terkait dengan penggunaan terapi intravena (infus) perifer.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Phlebitis</strong> merupakan peradangan lapisan dinding pembuluh darah vena paling dalam
              (interior) yang disebabkan oleh sumber mekanik, kimia, atau bakteri.
            </p>

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
              <p className="text-sm font-bold text-yellow-800 mb-1">Peringatan</p>
              <p className="text-sm text-yellow-700 leading-relaxed">
                Monitoring VIP Scale harus dilakukan secara rutin setiap shift atau satu kali per hari minimal
                untuk pasien yang terpasang infus.
              </p>
            </div>

            {/* CTA Button */}
            <Link to={createPageUrl('PanduanVIPScale')}>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-full text-base shadow">
                🎯 Mulai Panduan VIP Scale
              </Button>
            </Link>
          </div>
        </div>

        {/* Demo Aplikasi Steps */}
        <div className="bg-white rounded-xl shadow-sm mb-5 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-[#2c3e5f]">Demo Aplikasi</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {/* Step 1 */}
            <div className="flex items-start gap-4 p-5">
              <div className="w-11 h-11 rounded-full bg-[#2c3e5f] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-bold text-gray-800 mb-1">Mulai Monitoring</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Klik tombol "Monitor" pada halaman utama untuk memulai proses monitoring.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 p-5">
              <div className="w-11 h-11 rounded-full bg-[#2c3e5f] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-bold text-gray-800 mb-1">Pilih Skor Visual Infusion Phlebitis</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Evaluasi kondisi area infus pasien dan pilih skor yang sesuai berdasarkan
                  kriteria Visual Infusion Phlebitis (VIP) Scale. Skor berkisar dari 0 (sehat) hingga 5
                  (tromboflebitis lanjut).
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 p-5">
              <div className="w-11 h-11 rounded-full bg-[#2c3e5f] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-bold text-gray-800 mb-1">Lihat Hasil & Intervensi</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Sistem akan menampilkan interpretasi kondisi dan rekomendasi intervensi
                  keperawatan yang harus dilakukan berdasarkan skor yang dipilih.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-4 p-5">
              <div className="w-11 h-11 rounded-full bg-[#2c3e5f] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-bold text-gray-800 mb-1">Simpan Hasil</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Klik "Simpan Hasil" untuk menyimpan data monitoring. Anda dapat melihat
                  riwayat monitoring melalui tombol "Riwayat Log" di halaman utama.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Penggunaan */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <p className="font-bold text-blue-800 mb-2">💡 Tips Penggunaan</p>
          <ul className="space-y-1">
            <li className="text-sm text-blue-700 flex items-start gap-2">
              <span>•</span>
              <span>Lakukan monitoring secara berkala sesuai dengan Standar Operasional Prosedur.</span>
            </li>
            <li className="text-sm text-blue-700 flex items-start gap-2">
              <span>•</span>
              <span>Pastikan evaluasi dilakukan dengan teliti dan objektif.</span>
            </li>
            <li className="text-sm text-blue-700 flex items-start gap-2">
              <span>•</span>
              <span>Dokumentasikan setiap hasil monitoring untuk tracking kondisi pasien.</span>
            </li>
          </ul>
        </div>

        {/* Back Button */}
        <Link to={createPageUrl('Home')}>
          <Button className="w-full bg-[#2d9b87] hover:bg-[#248a77] text-white font-bold py-4 rounded-full text-base">
            🏠 Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
}
