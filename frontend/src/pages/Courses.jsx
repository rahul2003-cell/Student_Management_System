import React, { useEffect, useState } from 'react';
import { LuPlus, LuTrash2 } from 'react-icons/lu';
import Topbar from '../components/Topbar';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';
import courseService from '../services/courseService';

const EMPTY = { courseName: '', durationMonths: '', feeAmount: '', description: '' };

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [toast, setToast] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.courseName.trim()) return;
    try {
      const payload = {
        courseName: form.courseName,
        durationMonths: form.durationMonths ? Number(form.durationMonths) : null,
        feeAmount: form.feeAmount ? Number(form.feeAmount) : null,
        description: form.description,
      };
      const created = await courseService.create(payload);
      setCourses((prev) => [...prev, created]);
      setForm(EMPTY);
      setToast({ type: 'success', message: `Course "${created.courseName}" added.` });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  const handleDelete = async () => {
    try {
      await courseService.remove(pendingDelete.id);
      setCourses((prev) => prev.filter((c) => c.id !== pendingDelete.id));
      setToast({ type: 'success', message: `Course "${pendingDelete.courseName}" removed.` });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <>
      <Topbar title="Course Catalog" />
      <div className="page-content">
        {error && (
          <div className="card" style={{ padding: 16, marginBottom: 20, color: '#9a2b32', borderColor: '#f0cfce' }}>
            Couldn't reach the API: {error}
          </div>
        )}

        <div className="form-card" style={{ marginBottom: 28, maxWidth: '100%' }}>
          <div className="section-title" style={{ marginBottom: 18 }}>Add a Course</div>
          <form className="form-grid" onSubmit={handleAdd}>
            <div className="form-group">
              <label className="form-label">Course Name<span className="required">*</span></label>
              <input className="form-input" value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} placeholder="B.Tech" />
            </div>
            <div className="form-group">
              <label className="form-label">Duration (months)</label>
              <input className="form-input" type="number" value={form.durationMonths} onChange={(e) => setForm({ ...form, durationMonths: e.target.value })} placeholder="48" />
            </div>
            <div className="form-group">
              <label className="form-label">Fee Amount (₹)</label>
              <input className="form-input" type="number" value={form.feeAmount} onChange={(e) => setForm({ ...form, feeAmount: e.target.value })} placeholder="400000" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Bachelor of Technology" />
            </div>
            <div className="form-group full">
              <button type="submit" className="btn btn-accent" style={{ width: 'fit-content' }}>
                <LuPlus /> Add Course
              </button>
            </div>
          </form>
        </div>

        <div className="ledger-table-wrap">
          {loading ? (
            <div className="loading-wrap"><div className="spinner" /> Loading courses&hellip;</div>
          ) : courses.length === 0 ? (
            <div className="empty-state"><h3>No courses yet</h3><p>Add your first course above.</p></div>
          ) : (
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Duration</th>
                  <th>Fee</th>
                  <th>Description</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id}>
                    <td className="cell-name">{c.courseName}</td>
                    <td className="cell-sub" style={{ marginTop: 0 }}>{c.durationMonths ? `${c.durationMonths} months` : '—'}</td>
                    <td className="cell-sub" style={{ marginTop: 0 }}>{c.feeAmount ? `₹${Number(c.feeAmount).toLocaleString('en-IN')}` : '—'}</td>
                    <td className="cell-sub" style={{ marginTop: 0 }}>{c.description || '—'}</td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn danger" onClick={() => setPendingDelete(c)}><LuTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Remove course?"
        message={`This will remove "${pendingDelete?.courseName}" from the catalog.`}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
