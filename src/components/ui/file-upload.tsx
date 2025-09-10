import React, { useCallback, useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import clsx from 'clsx'

export type FileUploadProps = {
  value?: File | null
  onChange?: (file: File | null) => void
  accept?: string
  maxSizeMB?: number
  className?: string
  labelText?: string
  helperText?: string
  disabled?: boolean
}

export function FileUpload({
  value,
  onChange,
  accept = 'image/*,application/pdf',
  maxSizeMB = 2,
  className,
  labelText = 'Mahsulot suratini yuklash',
  helperText = '.jpg, .png, .pdf fayllarni yuklash mumkin (limit: 2 mb)',
  disabled,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openPicker = () => {
    if (disabled) return
    inputRef.current?.click()
  }

  const validate = useCallback(
    (file: File) => {
      setError(null)
      const sizeOk = file.size <= maxSizeMB * 1024 * 1024
      if (!sizeOk) {
        setError(`Fayl hajmi ${maxSizeMB} MB dan oshmasin`)
        return false
      }
      if (accept && accept !== '*/*') {
        const patterns = accept.split(',').map((s) => s.trim())
        const ok = patterns.some((p) => {
          if (p.endsWith('/*')) {
            return file.type.startsWith(p.slice(0, -1))
          }
          if (p.startsWith('.')) {
            return file.name.toLowerCase().endsWith(p.toLowerCase())
          }
          return file.type === p
        })
        if (!ok) {
          setError("Bu turdagi faylni yuklab bo'lmaydi")
          return false
        }
      }
      return true
    },
    [accept, maxSizeMB]
  )

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return
      const file = files[0]
      if (!validate(file)) return
      onChange?.(file)
    },
    [onChange, validate]
  )

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    if (disabled) return
    handleFiles(e.dataTransfer.files)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    setDragOver(true)
  }
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }

  return (
    <div className={clsx('w-full', className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') openPicker()
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={clsx(
          'flex flex-col items-center justify-center text-center rounded-2xl border px-4 py-8 cursor-pointer select-none',
          'transition-colors',
          dragOver
            ? 'border-[#71717A] bg-[#FAFAFA]'
            : 'border-[#E4E4E7] bg-white',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
      >
        <div className="text-[#71717A] text-lg sm:text-xl font-medium">
          {labelText}
        </div>
        <Upload className="mt-2 text-[#A1A1AA]" />
        <div className="mt-4 text-xs text-[#A1A1AA]">{helperText}</div>
        {value && (
          <div className="mt-3 text-xs text-[#71717A]">
            Tanlangan: <span className="font-medium">{value.name}</span>
          </div>
        )}
        {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled}
      />
    </div>
  )
}
