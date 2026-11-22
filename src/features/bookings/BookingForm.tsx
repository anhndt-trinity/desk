import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ApiError, createBooking } from '../../lib/api'
import type { Room } from '../../types'
import { useAuth } from '../auth/AuthContext'
import { validateBooking, type BookingFormValues } from './validateBooking'

type BookingFormProps = {
  room: Room
}

const initialValues: BookingFormValues = {
  date: '',
  hours: '1',
  guests: '1',
}

export function BookingForm({ room }: BookingFormProps) {
  const [values, setValues] = useState<BookingFormValues>(initialValues)
  const [fieldErrors, setFieldErrors] = useState<ReturnType<typeof validateBooking>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitInfo, setSubmitInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useAuth()

  function updateField<K extends keyof BookingFormValues>(key: K, value: BookingFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)
    setSubmitInfo(null)

    const errors = validateBooking(values, room.capacity)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      await createBooking({
        roomId: room.id,
        date: values.date,
        hours: Number(values.hours),
        guests: Number(values.guests),
      })
      setSubmitInfo('Booking created.')
      setValues(initialValues)
    } catch (error) {
      if (error instanceof ApiError && error.status === 400 && error.fields) {
        const apiFieldErrors: ReturnType<typeof validateBooking> = {}
        for (const key of ['date', 'hours', 'guests'] as const) {
          if (error.fields[key]) apiFieldErrors[key] = error.fields[key]
        }
        setFieldErrors(apiFieldErrors)
        setSubmitError(error.message)
        return
      }
      if (error instanceof ApiError && error.status === 401) {
        signOut()
        navigate(`/login?from=${encodeURIComponent(location.pathname)}`, { replace: true })
        return
      }
      setSubmitError(error instanceof Error ? error.message : 'Booking failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit} noValidate>
      <h2>Book {room.name}</h2>
      <p className="muted">
        Lab 5 ends with an honest <span className="mono">401</span> until you sign in
        tonight.
      </p>

      {submitError ? <div className="banner error">{submitError}</div> : null}
      {submitInfo ? <div className="banner ok">{submitInfo}</div> : null}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={values.date}
            onChange={(event) => updateField('date', event.target.value)}
          />
          {fieldErrors.date ? <span className="field-error">{fieldErrors.date}</span> : null}
        </div>

        <div className="field">
          <label htmlFor="hours">Hours</label>
          <input
            id="hours"
            type="number"
            min={1}
            max={8}
            value={values.hours}
            onChange={(event) => updateField('hours', event.target.value)}
          />
          {fieldErrors.hours ? <span className="field-error">{fieldErrors.hours}</span> : null}
        </div>

        <div className="field">
          <label htmlFor="guests">Guests</label>
          <input
            id="guests"
            type="number"
            min={1}
            max={room.capacity}
            value={values.guests}
            onChange={(event) => updateField('guests', event.target.value)}
          />
          {fieldErrors.guests ? (
            <span className="field-error">{fieldErrors.guests}</span>
          ) : null}
        </div>
      </div>

      <div className="form-actions">
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? 'Booking…' : 'Request booking'}
        </button>
      </div>
    </form>
  )
}
