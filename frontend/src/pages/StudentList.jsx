import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuPencil, LuTrash2, LuUserPlus, LuEye } from 'react-icons/lu';
import Topbar from '../components/Topbar';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import studentService from '../services/studentService';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const courses = useMemo(
    () => Array.from(new Set(students.map((s) => s.course))).sort(),
    [students]
  );

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        !searchTerm ||
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = !courseFilter || s.course === courseFilter;
      const matchesStatus = !statusFilter || s.status === statusFilter;
      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [students, searchTerm, courseFilter, statusFilter]);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await studentService.remove(pendingDelete.id);
      setStudents((prev) => prev.filter((s) => s.id !== pendingDelete.id));
      setToast({ type: 'success', message: `Removed ${pendingDelete.fullName} from the ledger.` });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <>
      <Topbar title="Student Records" showSearch onSearch={setSearchTerm} />
      <div className="page-content">
        <div className="toolbar">
          <div className="filter-group">
            <select className="select-field" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
              <option value="">All Courses</option>
              {courses.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="select-field" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <Link to="/students/new" className="btn btn-accent">
            <LuUserPlus /> New Student
          </Link>
        </div>

        {error && (
          <div className="card" style={{ padding: 16, marginBottom: 20, color: '#9a2b32', borderColor: '#f0cfce' }}>
            Couldn't reach the API: {error}. Make sure the Spring Boot backend is running on port 8080.
          </div>
        )}

        <div className="ledger-table-wrap">
          {loading ? (
            <div className="loading-wrap"><div className="spinner" /> Loading records&hellip;</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <h3>No matching students</h3>
              <p>Try adjusting your filters, or register a new student.</p>
            </div>
          ) : (
            <>
              <table className="ledger-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>#</th>
                    <th>Student</th>
                    <th>Contact</th>
                    <th>Course</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr key={s.id}>
                      <td className="row-index">{String(i + 1).padStart(2, '0')}</td>
                      <td>
                        <div className="student-name-cell">
                          <div className="avatar-initial">{s.firstName?.[0]}{s.lastName?.[0]}</div>
                          <div>
                            <div className="cell-name">{s.fullName}</div>
                            <div className="cell-sub">Enrolled {s.enrollmentDate}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="cell-sub" style={{ marginTop: 0 }}>{s.email}</div>
                        <div className="cell-sub">{s.phone || '—'}</div>
                      </td>
                      <td><span className="course-pill">{s.course}</span></td>
                      <td><StatusBadge status={s.status} /></td>
                      <td>
                        <div className="row-actions">
                          <Link to={`/students/${s.id}`} className="icon-btn" title="View">
                            <LuEye />
                          </Link>
                          <Link to={`/students/${s.id}/edit`} className="icon-btn" title="Edit">
                            <LuPencil />
                          </Link>
                          <button
                            className="icon-btn danger"
                            title="Delete"
                            onClick={() => setPendingDelete(s)}
                          >
                            <LuTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="ledger-foot">
                <span>{filtered.length} of {students.length} records shown</span>
                <span>Ledger ID range #{students[0]?.id ?? '—'}–{students[students.length - 1]?.id ?? '—'}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Remove student record?"
        message={`This will permanently remove ${pendingDelete?.fullName ?? 'this student'} from the ledger. This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
