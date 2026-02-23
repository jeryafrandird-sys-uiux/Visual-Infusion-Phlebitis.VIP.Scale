import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Search, Filter, Eye, Trash2, Calendar, User, MapPin, Activity, FileText, Clock, TrendingUp, Users, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subDays, startOfDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';

const VIP_COLORS = {
  0: { bg: 'bg-green-100', text: 'text-green-800', badge: 'bg-green-500' },
  1: { bg: 'bg-lime-100', text: 'text-lime-800', badge: 'bg-lime-500' },
  2: { bg: 'bg-yellow-100', text: 'text-yellow-800', badge: 'bg-yellow-500' },
  3: { bg: 'bg-orange-100', text: 'text-orange-800', badge: 'bg-orange-500' },
  4: { bg: 'bg-red-100', text: 'text-red-800', badge: 'bg-red-500' },
  5: { bg: 'bg-red-200', text: 'text-red-900', badge: 'bg-red-700' }
};

const VIP_TITLES = {
  0: "Tidak ada tanda phlebitis",
  1: "Kemungkinan tanda awal phlebitis",
  2: "Tahap awal phlebitis",
  3: "Tahap menengah phlebitis",
  4: "Tahap lanjut phlebitis",
  5: "Tahap lanjut thrombophlebitis"
};

export default function RiwayatLog() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScore, setFilterScore] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['infus-monitor'],
    queryFn: () => base44.entities.InfusMonitor.list('-monitoring_date', 100),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.InfusMonitor.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infus-monitor'] });
      toast.success('Data berhasil dihapus');
    },
    onError: (error) => {
      toast.error('Gagal menghapus data: ' + error.message);
    }
  });

  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.room_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.nurse_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterScore === 'all' || record.vip_score === parseInt(filterScore);
    
    return matchesSearch && matchesFilter;
  });

  const getScoreStats = () => {
    const stats = { total: records.length, byScore: {} };
    for (let i = 0; i <= 5; i++) {
      stats.byScore[i] = records.filter(r => r.vip_score === i).length;
    }
    return stats;
  };

  const stats = getScoreStats();

  const handleExportToExcel = () => {
    if (filteredRecords.length === 0) {
      toast.error('Tidak ada data untuk diunduh');
      return;
    }

    const exportData = filteredRecords.map((record, index) => ({
      'No': index + 1,
      'Tanggal': record.monitoring_date ? format(new Date(record.monitoring_date), 'dd/MM/yyyy HH:mm', { locale: id }) : '-',
      'Nama Pasien': record.patient_name || '-',
      'Nomor Kamar': record.room_number || '-',
      'Nomor Tempat Tidur': record.bed_number || '-',
      'Lokasi IV': record.iv_site || '-',
      'Skor VIP': record.vip_score,
      'Status': VIP_TITLES[record.vip_score] || '-',
      'Gejala': record.symptoms?.join('; ') || '-',
      'Tindakan': record.action_taken || '-',
      'Intervensi': record.interventions_checked?.join('; ') || '-',
      'Catatan': record.notes || '-',
      'Nama Perawat': record.nurse_name || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Riwayat Monitoring');

    // Set column widths
    worksheet['!cols'] = [
      { wch: 5 },  // No
      { wch: 18 }, // Tanggal
      { wch: 20 }, // Nama Pasien
      { wch: 12 }, // Nomor Kamar
      { wch: 15 }, // Nomor Tempat Tidur
      { wch: 25 }, // Lokasi IV
      { wch: 10 }, // Skor VIP
      { wch: 30 }, // Status
      { wch: 40 }, // Gejala
      { wch: 30 }, // Tindakan
      { wch: 50 }, // Intervensi
      { wch: 40 }, // Catatan
      { wch: 20 }  // Nama Perawat
    ];

    const fileName = `Riwayat_Monitoring_${format(new Date(), 'dd-MM-yyyy_HHmm')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success('Data berhasil diunduh!');
  };

  // Calculate dashboard statistics
  const dashboardStats = useMemo(() => {
    const totalPatients = records.length;
    const patientsWithPhlebitis = records.filter(r => r.vip_score >= 2).length;
    
    // VIP Score Distribution for Pie Chart
    const scoreDistribution = [
      { name: 'Skor 0 (No Sign)', value: stats.byScore[0], fill: '#22c55e' },
      { name: 'Skor 1 (Possible)', value: stats.byScore[1], fill: '#84cc16' },
      { name: 'Skor 2 (Early)', value: stats.byScore[2], fill: '#eab308' },
      { name: 'Skor 3 (Medium)', value: stats.byScore[3], fill: '#f97316' },
      { name: 'Skor 4 (Advanced)', value: stats.byScore[4], fill: '#ef4444' },
      { name: 'Skor 5 (Severe)', value: stats.byScore[5], fill: '#991b1b' }
    ];

    // Trend data for last 7 days (Line Chart)
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = startOfDay(date);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      
      const dayRecords = records.filter(r => {
        const recordDate = new Date(r.monitoring_date);
        return recordDate >= dayStart && recordDate <= dayEnd;
      });
      
      const phlebitisCount = dayRecords.filter(r => r.vip_score >= 2).length;
      
      trendData.push({
        day: format(date, 'EEE', { locale: id }),
        date: format(date, 'dd/MM'),
        count: phlebitisCount
      });
    }

    return {
      totalPatients,
      patientsWithPhlebitis,
      scoreDistribution: scoreDistribution.filter(s => s.value > 0),
      trendData
    };
  }, [records, stats]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1e3a5f] py-4 px-6">
        <div className="container mx-auto flex items-center gap-4">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#f59e0b]"></div>
            <h1 className="text-white text-xl md:text-2xl font-bold">Riwayat Log Monitoring</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Monitoring Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6" />
            Riwayat Monitoring
          </h2>

          {/* Top Stats */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Patients with Phlebitis */}
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Pasien dengan Phlebitis (VIP ≥ 2)</p>
                    <p className="text-4xl font-bold text-orange-600">{dashboardStats.patientsWithPhlebitis}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart - VIP Scale Distribution */}
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-600">Distribusi Total VIP Scale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <ResponsiveContainer width="60%" height={150}>
                    <PieChart>
                      <Pie
                        data={dashboardStats.scoreDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                        label={(entry) => {
                          const percentage = dashboardStats.totalPatients > 0 
                            ? ((entry.value / dashboardStats.totalPatients) * 100).toFixed(1)
                            : 0;
                          return `${percentage}%`;
                        }}
                        labelLine={false}
                      >
                        {dashboardStats.scoreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => {
                          const percentage = dashboardStats.totalPatients > 0 
                            ? ((value / dashboardStats.totalPatients) * 100).toFixed(1)
                            : 0;
                          return [`${value} pasien (${percentage}%)`, 'Jumlah'];
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col justify-center space-y-2 text-xs">
                    {dashboardStats.scoreDistribution.map((entry, index) => {
                      const percentage = dashboardStats.totalPatients > 0 
                        ? ((entry.value / dashboardStats.totalPatients) * 100).toFixed(1)
                        : 0;
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }}></div>
                          <span className="text-gray-700">
                            Skor {entry.name.match(/\d+/)[0]}: <strong>{entry.value}</strong> ({percentage}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Line Chart - Phlebitis Trend */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Tren Insiden Phlebitis (7 Hari Terakhir)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dashboardStats.trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                    formatter={(value) => [`${value} kasus`, 'Jumlah Phlebitis']}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        return `${payload[0].payload.day}, ${payload[0].payload.date}`;
                      }
                      return label;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-2 md:col-span-1 bg-white rounded-xl shadow-lg p-4 border-l-4 border-[#2d9b87]"
          >
            <p className="text-xs text-gray-500 mb-1">Total Monitoring</p>
            <p className="text-2xl font-bold text-[#1e3a5f]">{stats.total}</p>
          </motion.div>
          
          {[0, 1, 2, 3, 4, 5].map((score) => (
            <motion.div
              key={score}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: score * 0.05 }}
              className={`bg-white rounded-xl shadow-lg p-4 border-l-4 ${
                score === 0 ? 'border-green-500' :
                score === 1 ? 'border-lime-500' :
                score === 2 ? 'border-yellow-500' :
                score === 3 ? 'border-orange-500' :
                score === 4 ? 'border-red-500' : 'border-red-700'
              }`}
            >
              <p className="text-xs text-gray-500 mb-1">Skor {score}</p>
              <p className="text-xl font-bold text-gray-800">{stats.byScore[score]}</p>
            </motion.div>
          ))}
        </div>

        {/* Search and Filter */}
        <Card className="border-none shadow-lg mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Cari nama pasien, kamar, atau perawat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-[#2d9b87] focus:ring-[#2d9b87]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <Select value={filterScore} onValueChange={setFilterScore}>
                  <SelectTrigger className="w-[180px] border-gray-300">
                    <SelectValue placeholder="Filter Skor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Skor</SelectItem>
                    <SelectItem value="0">Skor 0</SelectItem>
                    <SelectItem value="1">Skor 1</SelectItem>
                    <SelectItem value="2">Skor 2</SelectItem>
                    <SelectItem value="3">Skor 3</SelectItem>
                    <SelectItem value="4">Skor 4</SelectItem>
                    <SelectItem value="5">Skor 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleExportToExcel}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={filteredRecords.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Unduh Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#2d9b87] to-[#248a77] text-white">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Data Monitoring ({filteredRecords.length} record)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="p-12 text-center">
                <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Belum ada data monitoring</p>
                <Link to={createPageUrl('Monitor')}>
                  <Button className="mt-4 bg-[#2d9b87] hover:bg-[#248a77]">
                    Mulai Monitoring
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Tanggal</TableHead>
                      <TableHead className="font-semibold">Pasien</TableHead>
                      <TableHead className="font-semibold">Kamar</TableHead>
                      <TableHead className="font-semibold">Lokasi IV</TableHead>
                      <TableHead className="font-semibold text-center">Skor VIP</TableHead>
                      <TableHead className="font-semibold">Perawat</TableHead>
                      <TableHead className="font-semibold text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredRecords.map((record, index) => (
                        <motion.tr
                          key={record.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.02 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-sm">{record.monitoring_date ? format(new Date(record.monitoring_date), 'dd MMM yyyy', { locale: id }) : '-'}</p>
                                <p className="text-xs text-gray-500">{record.monitoring_date ? format(new Date(record.monitoring_date), 'HH:mm', { locale: id }) : ''}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              {record.patient_name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {record.room_number}{record.bed_number ? `-${record.bed_number}` : ''}
                            </div>
                          </TableCell>
                          <TableCell>{record.iv_site || '-'}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={`${VIP_COLORS[record.vip_score]?.badge} text-white px-3 py-1`}>
                              {record.vip_score}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.nurse_name}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedRecord(record)}
                                className="hover:bg-[#2d9b87]/10 hover:text-[#2d9b87]"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  if (confirm('Yakin ingin menghapus data ini?')) {
                                    deleteMutation.mutate(record.id);
                                  }
                                }}
                                className="hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#2d9b87]" />
              Detail Monitoring
            </DialogTitle>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-4">
              {/* VIP Score Badge */}
              <div className={`${VIP_COLORS[selectedRecord.vip_score]?.bg} rounded-xl p-4`}>
                <div className="flex items-center gap-4">
                  <div className={`${VIP_COLORS[selectedRecord.vip_score]?.badge} w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                    {selectedRecord.vip_score}
                  </div>
                  <div>
                    <p className={`font-bold ${VIP_COLORS[selectedRecord.vip_score]?.text}`}>
                      Skor VIP: {selectedRecord.vip_score}
                    </p>
                    <p className="text-sm text-gray-600">
                      {VIP_TITLES[selectedRecord.vip_score]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <User className="w-3 h-3" /> Nama Pasien
                  </p>
                  <p className="font-semibold">{selectedRecord.patient_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Kamar
                  </p>
                  <p className="font-semibold">
                    {selectedRecord.room_number}{selectedRecord.bed_number ? `-${selectedRecord.bed_number}` : ''}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Activity className="w-3 h-3" /> Lokasi IV
                  </p>
                  <p className="font-semibold">{selectedRecord.iv_site || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Waktu Monitoring
                  </p>
                  <p className="font-semibold">
                    {selectedRecord.monitoring_date 
                      ? format(new Date(selectedRecord.monitoring_date), 'dd MMM yyyy, HH:mm', { locale: id })
                      : '-'
                    }
                  </p>
                </div>
              </div>

              {/* Symptoms */}
              {selectedRecord.symptoms?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Gejala yang ditemukan:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecord.symptoms.map((symptom, idx) => (
                      <Badge key={idx} variant="outline" className="bg-gray-50">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action */}
              {selectedRecord.action_taken && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-blue-800 mb-1">Tindakan:</p>
                  <p className="text-sm text-blue-700">{selectedRecord.action_taken}</p>
                </div>
              )}

              {/* Interventions Checked */}
              {selectedRecord.interventions_checked?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Intervensi yang Dilakukan:</p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <ul className="space-y-1">
                      {selectedRecord.interventions_checked.map((intervention, idx) => (
                        <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>{intervention}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedRecord.notes && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Catatan:</p>
                  <p className="text-sm text-gray-600">{selectedRecord.notes}</p>
                </div>
              )}

              {/* Nurse */}
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500">Perawat: <span className="font-semibold text-gray-700">{selectedRecord.nurse_name}</span></p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
