
import React, { useEffect, useState } from "react";
import axios from "../../../redux/axiosInstance";
import styles from "./AdminStatistic.module.css";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
const AdminStatistic = () => {
  const [total, setTotal] = useState({ doctorCount: 0, patientCount: 0 });
  const [daily, setDaily] = useState({ doctor: [], patient: [] });
  const [monthly, setMonthly] = useState({ doctor: [], patient: [] });
  const [gender, setGender] = useState({ doctor: {male:0, female:0}, patient: {male:0, female:0} });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });


  // Gender statistikası tarixə görə çəkilsin
  const fetchGender = (start, end) => {
    let url = "/api/statistics/gender";
    if (start && end) url += `?start=${start}&end=${end}`;
    axios.get(url).then(r => {
      const g = r.data;
      setGender({
        doctor: {
          male: g.doctor?.find(x => x._id === "male")?.count || 0,
          female: g.doctor?.find(x => x._id === "female")?.count || 0
        },
        patient: {
          male: g.patient?.find(x => x._id === "male")?.count || 0,
          female: g.patient?.find(x => x._id === "female")?.count || 0
        }
      });
    });
  };

  useEffect(() => {
    axios.get("/api/statistics/total").then(r => setTotal(r.data));
    axios.get("/api/statistics/monthly").then(r => setMonthly(r.data));
    fetchGender(dateRange.start, dateRange.end);
    fetchDaily();
    // eslint-disable-next-line
  }, []);

  // Tarix dəyişəndə gender statistikası yenilənsin
  useEffect(() => {
    fetchGender(dateRange.start, dateRange.end);
  }, [dateRange]);

  const fetchDaily = () => {
    let url = "/api/statistics/daily";
    if (dateRange.start && dateRange.end) {
      url += `?start=${dateRange.start}&end=${dateRange.end}`;
    }
    axios.get(url).then(r => setDaily(r.data));
  };

  // Son 6 ay üçün ay adları və il (YYYY-MM)
  const now = new Date();
  const last6Months = Array.from({length: 6}, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}`;
  });
  const monthLabels = last6Months.map(m => {
    const [y, mo] = m.split('-');
    const aylar = ["Yan", "Fev", "Mar", "Apr", "May", "İyn", "İyl", "Avq", "Sen", "Okt", "Noy", "Dek"];
    return aylar[parseInt(mo,10)-1] + ' ' + y;
  });
  const monthKeys = last6Months;
  const barData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Həkim",
        backgroundColor: "#1976d2",
        data: monthKeys.map(m => (monthly.doctor?.find(d => d._id === m)?.count || 0)),
      },
      {
        label: "Pasiyent",
        backgroundColor: "#ff9800",
        data: monthKeys.map(m => (monthly.patient?.find(d => d._id === m)?.count || 0)),
      },
    ],
  };

  // Pie chart (gender) - ümumi gender statistikası
  // Pie chart (gender) - tarixə görə gender statistikası, bütün dəyərlər 0 olsa belə göstər
  const pieData = {
    labels: ["Kişi Həkim", "Qadın Həkim", "Kişi Pasiyent", "Qadın Pasiyent"],
    datasets: [
      {
        data: [gender.doctor.male, gender.doctor.female, gender.patient.male, gender.patient.female],
        backgroundColor: ["#1976d2", "#e91e63", "#ff9800", "#4caf50"],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Statistika</h2>
      <div className={styles.statBlock}>
        <div className={styles.statCard}>
          <div>Həkim sayı</div>
          <b>{total.doctorCount}</b>
        </div>
        <div className={styles.statCard}>
          <div>Pasiyent sayı</div>
          <b>{total.patientCount}</b>
        </div>
      </div>
      <div className={styles.dateFilterBlock}>
        <label>Başlanğıc: <input type="date" value={dateRange.start} onChange={e => setDateRange({ ...dateRange, start: e.target.value })} /></label>
        <label>Son: <input type="date" value={dateRange.end} onChange={e => setDateRange({ ...dateRange, end: e.target.value })} /></label>
        <button onClick={fetchDaily}>Göstər</button>
      </div>
      <div className={styles.chartBlock}>
        <div className={styles.chartTitle}>Günlük qeydiyyat</div>
        <table className={styles.statTable}>
          <thead>
            <tr><th>Tarix</th><th>Həkim</th><th>Pasiyent</th></tr>
          </thead>
          <tbody>
            {/* Tarixə görə bütün unikal günləri tap və sırala */}
            {(() => {
              const doctorMap = (daily.doctor || []).reduce((acc, d) => { acc[d._id] = d.count; return acc; }, {});
              const patientMap = (daily.patient || []).reduce((acc, d) => { acc[d._id] = d.count; return acc; }, {});
              const allDates = Array.from(new Set([
                ...Object.keys(doctorMap),
                ...Object.keys(patientMap)
              ])).sort();
              return allDates.map(date => (
                <tr key={date}>
                  <td>{date}</td>
                  <td>{doctorMap[date] || 0}</td>
                  <td>{patientMap[date] || 0}</td>
                </tr>
              ));
            })()}
          </tbody>
        </table>
      </div>
      <div className={styles.charts}>
        <div className={styles.chartBlock}>
          <div className={styles.chartTitle}>Son 6 ayda aylıq qeydiyyat (Bar)</div>
          <Bar data={barData} options={{responsive:true, plugins:{legend:{display:true}}}} height={200} />
        </div>
        <div className={styles.chartBlock}>
          <div className={styles.chartTitle}>
            Cins üzrə qeydiyyat (Dairəvi, tarixə görə)
          </div>
          <div className={styles.dateRangeLabel}>
            {dateRange.start && dateRange.end ? (
              <span>Seçilmiş aralıq: {dateRange.start} — {dateRange.end}</span>
            ) : (
              <span>Bütün tarixlər üzrə</span>
            )}
          </div>
          <Pie
            data={pieData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.parsed || 0;
                      return `${label}: ${value}`;
                    }
                  }
                }
              }
            }}
            height={200}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminStatistic;
