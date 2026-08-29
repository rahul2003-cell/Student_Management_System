import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LuPencil, LuTrash2, LuArrowLeft } from 'react-icons/lu';
import Topbar from '../components/Topbar';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import studentService from '../services/studentService';

function Field({ label, value }) {
  return (
    <div>
      <div className="stat-label" style={{ marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14.5, color: 'var(--ink-text)' }}>{value || '—'}</div>
    </div>
  );
}

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await studentService.getById(id);
        setStudent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    try {
      await studentService.remove(id);
      navigate('/students');
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Topbar title="Student Record" />
      <div className="page-content">
        <Link to="/students" className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }}>
          <LuArrowLeft /> Back to Records
        </Link>

        {loading ? (
          <div className="loading-wrap"><div className="spinner" /> Loading record&hellip;</div>
        ) : error ? (
          <div className="card" style={{ padding: 24, color: '#9a2b32' }}>{error}</div>
        ) : student ? (
          <div className="card" style={{ padding: 32 }}>
            <div className="section-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="avatar-initial" style={{ width: 52, height: 52, fontSize: 18 }}>
                  {student.firstName?.[0]}{student.lastName?.[0]}
                </div>
                <div>
                  <span className="section-eyebrow">Ledger Entry #{String(student.id).padStart(4, '0')}</span>
                  <div className="section-title">{student.fullName}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Link to={`/students/${id}/edit`} className="btn btn-ghost btn-sm"><LuPencil /> Edit</Link>
                <button className="btn btn-danger btn-sm" onClick={() => setConfirmOpen(true)}>
                  <LuTrash2 /> Delete
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 28 }}>
              <Field label="Email" value={student.email} />
              <Field label="Phone" value={student.phone} />
              <Field label="Status" value={<StatusBadge status={student.status} />} />
              <Field label="Course" value={<span className="course-pill">{student.course}</span>} />
              <Field label="Date of Birth" value={student.dateOfBirth} />
              <Field label="Enrollment Date" value={student.enrollmentDate} />
              <Field label="Address" value={student.address} />
              <Field label="Record Created" value={student.createdAt?.split('T')[0]} />
              <Field label="Last Updated" value={student.updatedAt?.split('T')[0]} />
            </div>
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Remove student record?"
        message={`This will permanently remove ${student?.fullName ?? 'this student'} from the ledger.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
