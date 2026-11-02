import { useEffect, useRef, useState } from 'react'

export default function BackgroundVideo({ src, poster }) {
  const videoRef = useRef(null)
  const [motionAllowed, setMotionAllowed] = useState(false)
  const [hasFailed, setHasFailed] = useState(false)

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => {
      setMotionAllowed(!motionPreference.matches)
      if (motionPreference.matches) {
        videoRef.current?.pause()
      }
    }

    updateMotionPreference()
    motionPreference.addEventListener('change', updateMotionPreference)
    return () => motionPreference.removeEventListener('change', updateMotionPreference)
  }, [])

  const handleVideoError = () => {
    videoRef.current?.pause()
    setHasFailed(true)
  }

  return (
    <>
      <div
        className="background-video-fallback"
        style={{ backgroundImage: `url("${poster}")` }}
        aria-hidden="true"
      />
      {!hasFailed && (
        <video
          ref={videoRef}
          className="background-video"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          aria-hidden="true"
          tabIndex={-1}
          onError={handleVideoError}
        >
          {motionAllowed && <source src={src} type="video/mp4" />}
        </video>
      )}
      <div className="background-video-scrim" aria-hidden="true" />
    </>
  )
}
