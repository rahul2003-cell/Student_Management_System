import React, { useEffect, useState } from 'react';
import Topbar from '../components/Topbar';
import studentService from '../services/studentService';

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await studentService.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const byCourse = stats?.studentsByCourse ? Object.entries(stats.studentsByCourse) : [];
  const maxCount = byCourse.length ? Math.max(...byCourse.map(([, v]) => v)) : 1;

  return (
    <>
      <Topbar title="Enrollment Reports" />
      <div className="page-content">
        {error && (
          <div className="card" style={{ padding: 16, marginBottom: 20, color: '#9a2b32' }}>
            Couldn't reach the API: {error}
          </div>
        )}

        <div className="card" style={{ padding: 32 }}>
          <div className="section-eyebrow">Distribution</div>
          <div className="section-title" style={{ marginBottom: 24 }}>Students by Course</div>

          {loading ? (
            <div className="loading-wrap"><div className="spinner" /> Crunching numbers&hellip;</div>
          ) : byCourse.length === 0 ? (
            <div className="empty-state"><h3>No data yet</h3><p>Register students to see enrollment breakdowns.</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {byCourse
                .sort((a, b) => b[1] - a[1])
                .map(([course, count]) => (
                  <div key={course}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13.5 }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{course}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted-text)' }}>{count} student{count === 1 ? '' : 's'}</span>
                    </div>
                    <div style={{ height: 10, background: 'var(--parchment-300)', borderRadius: 6, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${(count / maxCount) * 100}%`,
                          background: 'linear-gradient(90deg, var(--brass-500), var(--brass-600))',
                          borderRadius: 6,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
