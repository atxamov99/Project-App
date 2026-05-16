import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import {
  useAdminUserDetailQuery,
  useAdminChangeRoleMutation,
  useAdminSuspendUserMutation,
  useAdminUnsuspendUserMutation,
  useAdminRemoveUserMutation,
} from '../../store/apiSlice'
import StatCard from '../../components/admin/StatCard'
import RoleBadge from '../../components/admin/RoleBadge'
import Modal, { ModalActions } from '../../components/admin/Modal'
import { FormInput, FormSelect } from '../../components/admin/FormField'
import Icon from '../../components/shared/Icon'

export default function AdminUserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const me = useAppSelector((state) => state.auth.user)

  const { data, isLoading: loading, error } = useAdminUserDetailQuery(id)
  const [changeRole] = useAdminChangeRoleMutation()
  const [suspendUser] = useAdminSuspendUserMutation()
  const [unsuspendUser] = useAdminUnsuspendUserMutation()
  const [removeUser] = useAdminRemoveUserMutation()

  const [roleModal, setRoleModal] = useState(false)
  const [newRole, setNewRole] = useState('')
  const [suspendModal, setSuspendModal] = useState(false)
  const [suspendReason, setSuspendReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')

  async function applyRole() {
    setActionError('')
    setBusy(true)
    try {
      await changeRole({ id, role: newRole }).unwrap()
      setRoleModal(false)
    } catch (e) {
      setActionError(e.data?.error || e.message)
    } finally {
      setBusy(false)
    }
  }

  async function applySuspend() {
    setActionError('')
    setBusy(true)
    try {
      await suspendUser({ id, reason: suspendReason }).unwrap()
      setSuspendModal(false)
      setSuspendReason('')
    } catch (e) {
      setActionError(e.data?.error || e.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleUnsuspend() {
    setBusy(true)
    try {
      await unsuspendUser(id).unwrap()
    } catch (e) {
      setActionError(e.data?.error || e.message)
    } finally {
      setBusy(false)
    }
  }

  async function deleteUser() {
    if (!confirm("Foydalanuvchini o'chirishni tasdiqlaysizmi? Bu amalni bekor qila olmaysiz.")) return
    setBusy(true)
    try {
      await removeUser(id).unwrap()
      navigate('/admin/users')
    } catch (e) {
      setActionError(e.data?.error || e.message)
      setBusy(false)
    }
  }

  if (loading) return <div className="text-on-surface-variant">Yuklanmoqda…</div>
  if (error) return <div className="text-error bg-error-container px-4 py-3 rounded-xl">{error.data?.error || 'Xatolik'}</div>
  if (!data) return null

  const user = data.user
  const isMe = me?.id === user.id

  return (
    <div className="space-y-6">
      <Link to="/admin/users" className="text-sm text-on-surface-variant hover:text-secondary">
        ← Foydalanuvchilar
      </Link>

      <div className="flex items-start gap-5">
        <div className="w-20 h-20 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-3xl font-extrabold flex items-center justify-center">
          {(user.displayName || user.username).slice(0, 1).toUpperCase()}
        </div>
        <div className="grow">
          <h1 className="text-2xl font-extrabold text-on-surface">{user.displayName}</h1>
          <p className="text-on-surface-variant">{user.email} · @{user.username}</p>
          <div className="flex items-center gap-2 mt-2">
            <RoleBadge role={user.role} />
            {user.isPremium && <span className="text-[10px] font-bold uppercase tracking-widest bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded">Premium</span>}
            {user.suspendedAt && <span className="text-[10px] font-bold uppercase tracking-widest bg-error-container text-on-error-container px-2 py-0.5 rounded">Suspended</span>}
            {isMe && <span className="text-[10px] font-bold uppercase tracking-widest bg-primary text-on-primary px-2 py-0.5 rounded">Siz</span>}
          </div>
        </div>
      </div>

      {actionError && <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl">{actionError}</div>}

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-3">Statistika</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon="bolt"                    label="Total XP"    value={user.totalXP} />
          <StatCard icon="local_fire_department"   label="Streak"      value={user.streak} />
          <StatCard icon="task_alt"                label="Lessons"     value={user._count?.lessonResults ?? 0} />
          <StatCard icon="emoji_events"            label="Achievements" value={user._count?.achievements ?? 0} />
        </div>
      </section>

      {user.suspendReason && (
        <div className="bg-error-container border border-error rounded-xl p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-on-error-container mb-1">Suspend sababi</p>
          <p className="text-on-error-container">{user.suspendReason}</p>
        </div>
      )}

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-3">Amallar</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setNewRole(user.role); setRoleModal(true); setActionError('') }}
            disabled={isMe || busy}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
          >
            Rol o'zgartirish
          </button>

          {!user.suspendedAt && (
            <button
              onClick={() => { setSuspendModal(true); setActionError('') }}
              disabled={isMe || busy}
              className="bg-surface-container-high text-tertiary border-2 border-outline-variant px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
            >
              Suspend
            </button>
          )}

          {user.suspendedAt && (
            <button
              onClick={handleUnsuspend}
              disabled={busy}
              className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
            >
              Unsuspend
            </button>
          )}

          <button
            onClick={deleteUser}
            disabled={isMe || busy}
            className="bg-error-container text-on-error-container px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 ml-auto"
          >
            <Icon name="delete" style={{ fontSize: 16 }} className="mr-1" />
            O'chirish
          </button>
        </div>
        {isMe && <p className="text-xs text-on-surface-variant mt-2">O'z hisobingiz ustidan amal bajara olmaysiz.</p>}
      </section>

      <Modal isOpen={roleModal} onClose={() => setRoleModal(false)} title="Rolni o'zgartirish">
        <FormSelect
          value={newRole}
          onChange={setNewRole}
          options={[
            { value: 'STUDENT', label: 'STUDENT' },
            { value: 'CONTENT_EDITOR', label: 'CONTENT_EDITOR' },
            { value: 'ADMIN', label: 'ADMIN' },
          ]}
        />
        <ModalActions>
          <button onClick={() => setRoleModal(false)} className="px-4 py-2 text-sm font-bold text-on-surface-variant">Bekor</button>
          <button
            onClick={applyRole}
            disabled={busy || newRole === user.role}
            className="bg-secondary text-white px-5 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
          >
            {busy ? '...' : 'Tasdiqlash'}
          </button>
        </ModalActions>
      </Modal>

      <Modal isOpen={suspendModal} onClose={() => setSuspendModal(false)} title="Foydalanuvchini suspend qilish">
        <p className="text-sm text-on-surface-variant mb-3">Sababini yozing — audit log'ga saqlanadi.</p>
        <FormInput
          value={suspendReason}
          onChange={setSuspendReason}
          placeholder="Spam yuborish, qoidalarni buzish, ..."
        />
        <ModalActions>
          <button onClick={() => setSuspendModal(false)} className="px-4 py-2 text-sm font-bold text-on-surface-variant">Bekor</button>
          <button
            onClick={applySuspend}
            disabled={busy || !suspendReason.trim()}
            className="bg-error text-on-error px-5 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
          >
            {busy ? '...' : 'Suspend'}
          </button>
        </ModalActions>
      </Modal>
    </div>
  )
}
