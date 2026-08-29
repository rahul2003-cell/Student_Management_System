import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LuSave, LuX } from 'react-icons/lu';
import Topbar from '../components/Topbar';
import Toast from '../components/Toast';
import studentService from '../services/studentService';

const COURSE_OPTIONS = ['B.Tech', 'BCA', 'B.Sc', 'MCA', 'MBA', 'M.Sc'];

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  address: '',
  course: '',
  enrollmentDate: '',
  status: 'ACTIVE',
};

export default function StudentForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const student = await studentService.getById(id);
        setForm({
          firstName: student.firstName || '',
          lastName: student.lastName || '',
          email: student.email || '',
          phone: student.phone || '',
          dateOfBirth: student.dateOfBirth || '',
          address: student.address || '',
          course: student.course || '',
          enrollmentDate: student.enrollmentDate || '',
          status: student.status || 'ACTIVE',
        });
      } catch (err) {
        setToast({ type: 'error', message: err.message });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = 'First name is required';
    if (!form.lastName.trim()) next.lastName = 'Last name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) next.phone = 'Phone must be exactly 10 digits';
    if (!form.course) next.course = 'Select a course';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      const payload = { ...form };
      if (!payload.enrollmentDate) delete payload.enrollmentDate;
      if (!payload.dateOfBirth) delete payload.dateOfBirth;

      if (isEdit) {
        await studentService.update(id, payload);
        setToast({ type: 'success', message: 'Student record updated.' });
      } else {
        await studentService.create(payload);
        setToast({ type: 'success', message: 'Student registered successfully.' });
      }
      setTimeout(() => navigate('/students'), 500);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Topbar title={isEdit ? 'Edit Student Record' : 'Register New Student'} />
      <div className="page-content">
        {loading ? (
          <div className="loading-wrap"><div className="spinner" /> Loading record&hellip;</div>
        ) : (
          <form className="form-card" onSubmit={handleSubmit} noValidate>
            <div className="section-head" style={{ marginBottom: 24 }}>
              <div>
                <span className="section-eyebrow">{isEdit ? `Entry #${id}` : 'New Entry'}</span>
                <div className="section-title">Student Particulars</div>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">First Name<span className="required">*</span></label>
                <input className="form-input" value={form.firstName} onChange={handleChange('firstName')} placeholder="Rahul" />
                {errors.firstName && <span className="form-error">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Last Name<span className="required">*</span></label>
                <input className="form-input" value={form.lastName} onChange={handleChange('lastName')} placeholder="Sharma" />
                {errors.lastName && <span className="form-error">{errors.lastName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Email<span className="required">*</span></label>
                <input className="form-input" type="email" value={form.email} onChange={handleChange('email')} placeholder="rahul.sharma@example.com" />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone} onChange={handleChange('phone')} placeholder="9876543210" />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input className="form-input" type="date" value={form.dateOfBirth} onChange={handleChange('dateOfBirth')} />
              </div>

              <div className="form-group">
                <label className="form-label">Enrollment Date</label>
                <input className="form-input" type="date" value={form.enrollmentDate} onChange={handleChange('enrollmentDate')} />
              </div>

              <div className="form-group">
                <label className="form-label">Course<span className="required">*</span></label>
                <select className="form-select" value={form.course} onChange={handleChange('course')}>
                  <option value="">Select a course</option>
                  {COURSE_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.course && <span className="form-error">{errors.course}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={handleChange('status')}>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="form-group full">
                <label className="form-label">Address</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={form.address}
                  onChange={handleChange('address')}
                  placeholder="123 MG Road, Hyderabad, Telangana"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-accent" disabled={saving}>
                <LuSave /> {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Register Student'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/students')}>
                <LuX /> Cancel
              </button>
            </div>
          </form>
        )}
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
