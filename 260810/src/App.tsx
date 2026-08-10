import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import './App.css'

function App() {
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [report, setReport] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
    }
  }, [photoPreview])

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setPhotoFile(file)
    setPhotoPreview(file ? URL.createObjectURL(file) : null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!photoFile) return

    setIsLoading(true)
    setError(null)
    setReport(null)

    try {
      const body = new FormData()
      body.append('photo', photoFile)
      body.append('height', height)
      body.append('weight', weight)

      const res = await fetch('/api/consult', { method: 'POST', body })
      const data = (await res.json()) as { report?: string; error?: string }

      if (!res.ok || !data.report) {
        throw new Error(data.error ?? '보고서를 받아오지 못했습니다.')
      }

      setReport(data.report)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const isValid = photoFile !== null && height !== '' && weight !== ''

  return (
    <main className="page">
      <header className="page-header">
        <h1>퍼스널 스타일리스트</h1>
        <p className="subtitle">
          사진과 신체 정보를 입력하면 나에게 어울리는 스타일을 추천해드려요.
        </p>
      </header>

      <form className="stylist-form" onSubmit={handleSubmit}>
        <label className="photo-upload" htmlFor="photo">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="업로드한 사진 미리보기"
              className="photo-preview"
            />
          ) : (
            <div className="photo-placeholder">
              <span className="upload-icon" aria-hidden="true">
                +
              </span>
              <span>사진 업로드</span>
            </div>
          )}
          <input
            id="photo"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            hidden
          />
        </label>

        <div className="field-row">
          <div className="field">
            <label htmlFor="height">키 (cm)</label>
            <input
              id="height"
              type="number"
              inputMode="decimal"
              min={0}
              placeholder="예: 170"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="weight">몸무게 (kg)</label>
            <input
              id="weight"
              type="number"
              inputMode="decimal"
              min={0}
              placeholder="예: 60"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={!isValid || isLoading}>
          {isLoading ? '분석 중...' : '스타일 추천받기'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {report && (
        <section className="report">
          <h2>스타일 컨설팅 보고서</h2>
          <p className="report-body">{report}</p>
        </section>
      )}
    </main>
  )
}

export default App
