import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuArrowRight, LuUserPlus } from 'react-icons/lu';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import studentService from '../services/studentService';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [statsData, students] = await Promise.all([
          studentService.getDashboardStats(),
          studentService.getAll(),
        ]);
        if (!mounted) return;
        setStats(statsData);
        setRecent(
          [...students]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
        );
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const topCourse = stats?.studentsByCourse
    ? Object.entries(stats.studentsByCourse).sort((a, b) => b[1] - a[1])[0]
    : null;

  return (
    <>
      <Topbar title="Registrar Overview" />
      <div className="page-content">
        {error && (
          <div className="card" style={{ padding: 16, marginBottom: 20, color: '#9a2b32', borderColor: '#f0cfce' }}>
            Couldn't reach the API: {error}. Make sure the Spring Boot backend is running on port 8080.
          </div>
        )}

        <div className="stat-grid">
          <StatCard
            label="Total Enrolled"
            value={loading ? '—' : stats?.totalStudents ?? 0}
            foot="All-time student records"
            accent="#c89b3c"
          />
          <StatCard
            label="Active Students"
            value={loading ? '—' : stats?.activeStudents ?? 0}
            foot="Currently attending"
            accent="#3d8462"
          />
          <StatCard
            label="Inactive"
            value={loading ? '—' : stats?.inactiveStudents ?? 0}
            foot="Graduated, dropped, or on leave"
            accent="#b8373f"
          />
          <StatCard
            label="Courses Offered"
            value={loading ? '—' : stats?.totalCourses ?? 0}
            foot={topCourse ? `Most popular: ${topCourse[0]}` : 'No enrollments yet'}
            accent="#2b3f74"
          />
        </div>

        <div className="section-head">
          <div>
            <span className="section-eyebrow">Latest Entries</span>
            <div className="section-title">Recently Registered Students</div>
          </div>
          <Link to="/students/new" className="btn btn-accent">
            <LuUserPlus /> New Student
          </Link>
        </div>

        <div className="ledger-table-wrap">
          {loading ? (
            <div className="loading-wrap"><div className="spinner" /> Loading records&hellip;</div>
          ) : recent.length === 0 ? (
            <div className="empty-state">
              <h3>No students on record</h3>
              <p>Register your first student to begin building the ledger.</p>
            </div>
          ) : (
            <table className="ledger-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Enrolled</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recent.map((s, i) => (
                  <tr key={s.id}>
                    <td className="row-index">{String(i + 1).padStart(2, '0')}</td>
                    <td>
                      <div className="student-name-cell">
                        <div className="avatar-initial">{s.firstName?.[0]}{s.lastName?.[0]}</div>
                        <div>
                          <div className="cell-name">{s.fullName}</div>
                          <div className="cell-sub">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="course-pill">{s.course}</span></td>
                    <td><StatusBadge status={s.status} /></td>
                    <td className="cell-sub">{s.enrollmentDate}</td>
                    <td>
                      <Link to={`/students/${s.id}`} className="icon-btn" title="View">
                        <LuArrowRight />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
