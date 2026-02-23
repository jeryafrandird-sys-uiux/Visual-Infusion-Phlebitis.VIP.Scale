import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const SCORE_DATA = [
  {
    score: 0,
    title: "Skor 0",
    subtitle: "Tidak ada tanda phlebitis",
    description: "Area IV tampak sehat tanpa keluhan apapun",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    circleColor: "bg-green-500",
    criteria: [
      { icon: "✓", text: "Tanda dan Gejala:", color: "text-green-700" },
      { icon: "➤", text: "Area IV tampak sehat", color: "text-gray-700" }
    ],
    action: {
      icon: "⚠️",
      title: "Tindakan yang Direkomendasikan:",
      text: "Tidak ada tindakan, observasi rutin",
      bgColor: "bg-green-100",
      textColor: "text-green-800"
    }
  },
  {
    score: 1,
    title: "Skor 1",
    subtitle: "Kemungkinan tanda awal phlebitis",
    description: "Pasien mungkin mengelami nyeri atau kemerahan ringan",
    bgColor: "bg-lime-50",
    borderColor: "border-lime-200",
    circleColor: "bg-lime-500",
    criteria: [
      { icon: "✓", text: "Tanda dan Gejala:", color: "text-lime-700" },
      { icon: "➤", text: "Nyeri ringan dekat area IV", color: "text-gray-700" },
      { icon: "➤", text: "Kemerahan ringan dekat area IV", color: "text-gray-700" }
    ],
    action: {
      icon: "⚠️",
      title: "Tindakan yang Direkomendasikan:",
      text: "Observasi kanula (pantau perkembangan)",
      bgColor: "bg-lime-100",
      textColor: "text-lime-800"
    }
  },
  {
    score: 2,
    title: "Skor 2",
    subtitle: "Tahap awal phlebitis",
    description: "Tanda-tanda phlebitis mulai terlihat jelas",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    circleColor: "bg-yellow-500",
    criteria: [
      { icon: "✓", text: "Tanda dan Gejala:", color: "text-yellow-700" },
      { icon: "➤", text: "Nyeri pada area IV", color: "text-gray-700" },
      { icon: "➤", text: "Kemerahan", color: "text-gray-700" },
      { icon: "➤", text: "Pembengkakan", color: "text-gray-700" }
    ],
    action: {
      icon: "⚠️",
      title: "Tindakan yang Direkomendasikan:",
      text: "Pindahkan kanula ke lokasi lain",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800"
    }
  },
  {
    score: 3,
    title: "Skor 3",
    subtitle: "Tahap menengah phlebitis",
    description: "Phlebitis berkembang dengan pengerasan jaringan",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    circleColor: "bg-orange-500",
    criteria: [
      { icon: "✓", text: "Tanda dan Gejala:", color: "text-orange-700" },
      { icon: "➤", text: "Nyeri sepanjang kanula", color: "text-gray-700" },
      { icon: "➤", text: "Kemerahan", color: "text-gray-700" },
      { icon: "➤", text: "Indurasi (pengerasan)", color: "text-gray-700" }
    ],
    action: {
      icon: "⚠️",
      title: "Tindakan yang Direkomendasikan:",
      text: "Pindahkan kanula, pertimbangkan perawatan phlebitis",
      bgColor: "bg-orange-100",
      textColor: "text-orange-800"
    }
  },
  {
    score: 4,
    title: "Skor 4",
    subtitle: "Tahap lanjut phlebitis / awal thrombophlebitis",
    description: "Vena mulai teraba keras (palpable venous cord)",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    circleColor: "bg-red-500",
    criteria: [
      { icon: "✓", text: "Tanda dan Gejala:", color: "text-red-700" },
      { icon: "➤", text: "Nyeri sepanjang kanula", color: "text-gray-700" },
      { icon: "➤", text: "Kemerahan", color: "text-gray-700" },
      { icon: "➤", text: "Indurasi", color: "text-gray-700" },
      { icon: "➤", text: "Vena teraba keras (palpable venous cord)", color: "text-gray-700" }
    ],
    action: {
      icon: "⚠️",
      title: "Tindakan yang Direkomendasikan:",
      text: "Pindahkan kanula segera, lakukan perawatan phlebitis",
      bgColor: "bg-red-100",
      textColor: "text-red-800"
    }
  },
  {
    score: 5,
    title: "Skor 5",
    subtitle: "Tahap lanjut thrombophlebitis",
    description: "Kondisi paling serius dengan kemunculan demam",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    circleColor: "bg-red-700",
    criteria: [
      { icon: "✓", text: "Tanda dan Gejala:", color: "text-red-800" },
      { icon: "➤", text: "Nyeri sepanjang kanula", color: "text-gray-700" },
      { icon: "➤", text: "Kemerahan", color: "text-gray-700" },
      { icon: "➤", text: "Indurasi", color: "text-gray-700" },
      { icon: "➤", text: "Vena teraba keras", color: "text-gray-700" },
      { icon: "➤", text: "Demam", color: "text-gray-700" }
    ],
    action: {
      icon: "⚠️",
      title: "Tindakan yang Direkomendasikan:",
      text: "Pindahkan kanula, terapi preventif phlebitis segera, lapor dokter",
      bgColor: "bg-red-100",
      textColor: "text-red-800"
    }
  }
];

export default function VIPScaleGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const currentScore = SCORE_DATA[currentStep];

  const goNext = () => {
    if (currentStep < SCORE_DATA.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#2c3e5f] py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to={createPageUrl('DemoAplikasi')}>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-white text-lg md:text-xl font-bold">Demo Aplikasi VIP Scale</h1>
          </div>
          <button className="text-white text-sm flex items-center gap-1">
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-lg">
        {/* Progress Indicator */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">Langkah {currentStep + 1} dari {SCORE_DATA.length}</p>
          <div className="flex gap-2">
            {SCORE_DATA.map((_, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === currentStep
                      ? currentScore.circleColor + ' text-white'
                      : index < currentStep
                      ? 'bg-[#2c3e5f] text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index}
                </div>
                {index < SCORE_DATA.length && (
                  <div className={`h-1 w-full ${index < currentStep ? 'bg-[#2c3e5f]' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Score Card */}
        <Card className={`${currentScore.borderColor} border-2`}>
          <CardContent className="p-0">
            {/* Score Badge */}
            <div className={`${currentScore.bgColor} p-6`}>
              <div className="flex items-center gap-4">
                <div className={`${currentScore.circleColor} w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0`}>
                  {currentScore.score}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{currentScore.title}</h2>
                  <p className="text-sm text-gray-700">{currentScore.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-6 space-y-4">
              <p className="text-gray-700 font-medium">{currentScore.description}</p>

              {/* Criteria */}
              <div className="space-y-2">
                {currentScore.criteria.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className={item.color}>{item.icon}</span>
                    <span className={item.color === "text-gray-700" ? "text-gray-700" : item.color + " font-medium"}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action */}
              <div className={`${currentScore.action.bgColor} rounded-lg p-4 space-y-2`}>
                <div className="flex items-start gap-2">
                  <span>{currentScore.action.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-800">{currentScore.action.title}</p>
                    <p className={`text-sm ${currentScore.action.textColor}`}>{currentScore.action.text}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="mt-6 flex gap-3">
          <Button
            onClick={goBack}
            disabled={currentStep === 0}
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Button>
          
          {currentStep < SCORE_DATA.length - 1 ? (
            <Button
              onClick={goNext}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2"
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Link to={createPageUrl('Home')} className="flex-1">
              <Button className="w-full bg-[#2d9b87] hover:bg-[#248a77] text-white flex items-center justify-center gap-2">
                Mulai Monitoring
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
