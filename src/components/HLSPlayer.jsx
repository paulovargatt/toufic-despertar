import { useEffect, useRef, useState, useCallback } from 'react'
import Hls from 'hls.js'
import { Play, Pause } from 'lucide-react'

export default function HLSPlayer({ 
  src, 
  onTimeUpdate, 
  autoplay = false,
  fakeBar = true,
  className = '',
  onLoadedData,
  onEnded 
}) {
  const isPrerender = typeof window !== 'undefined' && window.location.search.includes('prerender=1')

  // Autoplay Loop Constants
  const MUTED_VIDEO_START_SECONDS_INIT = 8
  const MUTED_VIDEO_START_SECONDS_END = 20

  const videoRef = useRef(null)
  const hlsRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMutedAutoplay, setIsMutedAutoplay] = useState(false)
  const isMutedAutoplayRef = useRef(false)
  const [watchedTime, setWatchedTime] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [resumeTime, setResumeTime] = useState(0)
  const [showResumePrompt, setShowResumePrompt] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const timeUpdateIntervalRef = useRef(null)
  const lastReportedSecond = useRef(-1)
  const lastSavedSecond = useRef(-1)
  const controlsTimeoutRef = useRef(null)
  const storageKey = `hls-player-time` // Chave única baseada na URL
  const endedStorageKey = `hls-player-ended`
  const [videoEnded, setVideoEnded] = useState(false)
  const [fakeProgress, setFakeProgress] = useState(0)

  useEffect(() => {
    isMutedAutoplayRef.current = isMutedAutoplay
  }, [isMutedAutoplay])

  // Curva não-linear para fake progress bar (retenção psicológica)
  const calculateFakeProgress = useCallback((currentTime, duration) => {
    if (!duration || duration <= 0) return 0
    const real = Math.min(Math.max(currentTime / duration, 0), 1)

    if (real <= 0.20) {
      // 0→20% real → 0→75% fake (muito rápido)
      return (real / 0.20) * 0.75
    } else if (real <= 0.60) {
      // 20→60% real → 75→90% fake (lento)
      return 0.75 + ((real - 0.20) / 0.40) * 0.15
    } else if (real <= 0.95) {
      // 60→95% real → 90→98% fake (muito lento)
      return 0.90 + ((real - 0.60) / 0.35) * 0.08
    } else {
      // 95→100% real → 98→100% fake (só no final absoluto)
      return 0.98 + ((real - 0.95) / 0.05) * 0.02
    }
  }, [])

  // Restaurar estado de vídeo finalizado do localStorage
  useEffect(() => {
    if (isPrerender) return

    try {
      const ended = localStorage.getItem(endedStorageKey) === '1'
      if (ended) {
        setVideoEnded(true)
        setShowControls(true)
      }
    } catch (error) {
      console.warn('Erro ao ler flag de vídeo finalizado:', error)
    }
  }, [endedStorageKey, isPrerender])

  // Carregar tempo salvo do localStorage
  const loadSavedTime = useCallback(() => {
    if (isPrerender) return 0

    try {
      const savedTime = localStorage.getItem(storageKey)
      return savedTime ? parseFloat(savedTime) : 0
    } catch (error) {
      console.warn('Erro ao carregar tempo do localStorage:', error)
      return 0
    }
  }, [storageKey, isPrerender])

  // Salvar tempo no localStorage
  const saveTimeToStorage = useCallback((time) => {
    if (isPrerender) return

    try {
      localStorage.setItem(storageKey, time.toString())
    } catch (error) {
      console.warn('Erro ao salvar tempo no localStorage:', error)
    }
  }, [storageKey, isPrerender])

  // Limpar tempo salvo do localStorage
  const clearSavedTime = useCallback(() => {
    if (isPrerender) return

    try {
      localStorage.removeItem(storageKey)
    } catch (error) {
      console.warn('Erro ao limpar tempo do localStorage:', error)
    }
  }, [storageKey, isPrerender])

  // Detectar dispositivo móvel
  useEffect(() => {
    if (isPrerender) return

    const checkIsMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setIsMobile(isMobileDevice || isTouchDevice)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => window.removeEventListener('resize', checkIsMobile)
  }, [isPrerender])

  // Gerenciar timeout dos controles
  const hideControlsAfterDelay = useCallback(() => {
    if (videoEnded || isMutedAutoplay) {
      // Se o vídeo terminou ou está em muted autoplay, mantenha os controles/overlay visíveis
      setShowControls(true)
      return
    }
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, isMobile ? 1000 : 1000) // Mobile: 4s, Desktop: 3s
  }, [isMobile, videoEnded, isMutedAutoplay])

  // Mostrar controles
  const showControlsHandler = useCallback(() => {
    setShowControls(true)
    if (!videoEnded && !isMutedAutoplay) hideControlsAfterDelay()
  }, [hideControlsAfterDelay, videoEnded, isMutedAutoplay])

  // Mecanismo de retry
  const retryLoad = useCallback(() => {
    if (retryCount >= 3) {
      setLoadError('Não foi possível carregar o vídeo após 3 tentativas.')
      return
    }

    setLoadError(null)
    setIsLoaded(false)
    setRetryCount(prev => prev + 1)
  }, [retryCount])

  const startTimeTracking = useCallback(() => {
    if (timeUpdateIntervalRef.current) return

    const updateTracking = () => {
      if (videoRef.current && !videoRef.current.paused) {
        const currentTime = videoRef.current.currentTime
        const currentSecond = Math.floor(currentTime)

        if (fakeBar) {
          const duration = videoRef.current.duration
          if (duration && duration > 0) {
            setFakeProgress(calculateFakeProgress(currentTime, duration))
          }
        }

        // Só atualiza se mudou de segundo para reduzir chamadas
        if (currentSecond > lastReportedSecond.current) {
          lastReportedSecond.current = currentSecond

          // Loop do preview mudo — reinicia no ponto inicial
          if (isMutedAutoplayRef.current && videoRef.current && currentTime >= MUTED_VIDEO_START_SECONDS_END) {
            videoRef.current.currentTime = MUTED_VIDEO_START_SECONDS_INIT
            return
          }

          setWatchedTime(prev => {
            const newTime = Math.max(prev, currentTime)

            // Salva no localStorage a cada 4 segundos — somente se o usuário realmente assistiu (não preview mudo)
            if (!isMutedAutoplayRef.current && currentSecond % 4 === 0 && currentSecond > lastSavedSecond.current) {
              lastSavedSecond.current = currentSecond
              saveTimeToStorage(newTime)
            }

            // Só chama onTimeUpdate a cada segundo novo
            if (onTimeUpdate) {
              onTimeUpdate(newTime, videoRef.current.duration || 0)
            }

            return newTime
          })
        }
      }
    }

    updateTracking()
    timeUpdateIntervalRef.current = setInterval(updateTracking, 200)
  }, [onTimeUpdate, saveTimeToStorage, isMutedAutoplayRef, calculateFakeProgress, fakeBar])

  const stopTimeTracking = useCallback(() => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current)
      timeUpdateIntervalRef.current = null
    }
  }, [])

  const handleResumeFromSaved = async (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    const video = videoRef.current
    if (!video || !isLoaded || resumeTime <= 0) return
    setShowResumePrompt(false)
    video.currentTime = resumeTime
    video.muted = false
    try {
      await video.play()
      setIsPlaying(true)
      startTimeTracking()
    } catch (err) {
      console.error('Erro ao retomar reprodução:', err)
    }
  }

  const handleStartFromZero = async (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    const video = videoRef.current
    if (!video || !isLoaded) return
    setShowResumePrompt(false)
    video.currentTime = 0
    setWatchedTime(0)
    setFakeProgress(0)
    lastReportedSecond.current = -1
    lastSavedSecond.current = -1
    clearSavedTime()
    video.muted = false
    try {
      await video.play()
      setIsPlaying(true)
      startTimeTracking()
    } catch (err) {
      console.error('Erro ao iniciar do zero:', err)
    }
  }

  // Inicializar HLS - CORRIGIDO
  useEffect(() => {
    if (isPrerender) return

    const video = videoRef.current
    if (!video || !src) return

    let isMounted = true
    let hlsInstance = null

    const initializePlayer = async () => {
      try {
        if (Hls.isSupported()) {
          hlsInstance = new Hls({
            enableWorker: false,
            lowLatencyMode: true,
            backBufferLength: 90,
            maxBufferLength: 600,
            maxMaxBufferLength: 1200,
            maxBufferSize: 60 * 1000 * 1000,
            maxBufferHole: 0.5,
          })

          hlsRef.current = hlsInstance
          hlsInstance.loadSource(src)
          hlsInstance.attachMedia(video)

          hlsInstance.on(Hls.Events.MANIFEST_PARSED, async () => {
            if (!isMounted) return

            setIsLoaded(true)
            if (onLoadedData) onLoadedData()

            // Aguardar um pouco para o vídeo estar pronto
            await new Promise(resolve => setTimeout(resolve, 100))

            if (!isMounted) return

            // Restaurar tempo salvo
            const savedTime = loadSavedTime()
            if (savedTime > 10) {
              // Não iniciar autoplay. Mostrar prompt para continuar ou recomeçar.
              setResumeTime(savedTime)
              setWatchedTime(savedTime)
              setShowResumePrompt(true)
              return
            } else if (savedTime > 0) {
              video.currentTime = savedTime
              setWatchedTime(savedTime)
            }

            if (autoplay && isMounted) {
              try {
                await video.play()
                if (isMounted) {
                  setIsPlaying(true)
                  startTimeTracking()
                }
              } catch (playError) {
                // Fallback para muted autoplay loop
                console.warn('Autoplay falhou, iniciando preview mudo em loop:', playError.message)
                if (isMounted) {
                  video.muted = true
                  video.currentTime = MUTED_VIDEO_START_SECONDS_INIT
                  setIsMutedAutoplay(true)
                  try {
                    await video.play()
                    setIsPlaying(true)
                    startTimeTracking()
                  } catch (mutedError) {
                    console.error('Falha também no autoplay mudo:', mutedError)
                  }
                }
              }
            }
          })

          hlsInstance.on(Hls.Events.ERROR, (event, data) => {
            console.error('Erro HLS:', data)
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  setLoadError('Erro de rede. Verifique sua conexão e tente novamente.')
                  break
                case Hls.ErrorTypes.MEDIA_ERROR:
                  try {
                    hlsInstance.recoverMediaError()
                  } catch (err) {
                    setLoadError('Erro de mídia ao carregar o vídeo.')
                  }
                  break
                default:
                  setLoadError('Erro ao carregar o vídeo.')
                  break
              }
            }
          })

        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Safari nativo HLS
          const handleLoadedData = async () => {
            if (!isMounted) return

            setIsLoaded(true)
            if (onLoadedData) onLoadedData()

            // Aguardar um pouco para o vídeo estar pronto
            await new Promise(resolve => setTimeout(resolve, 100))

            if (!isMounted) return

            // Restaurar tempo salvo
            const savedTime = loadSavedTime()
            if (savedTime > 10) {
              // Não iniciar autoplay. Mostrar prompt para continuar ou recomeçar.
              setResumeTime(savedTime)
              setWatchedTime(savedTime)
              setShowResumePrompt(true)
              return
            } else if (savedTime > 0) {
              video.currentTime = savedTime
              setWatchedTime(savedTime)
            }

            if (autoplay && isMounted) {
              try {
                await video.play()
                if (isMounted) {
                  setIsPlaying(true)
                  startTimeTracking()
                }
              } catch (playError) {
                 // Fallback para preview mudo em loop (Safari/Mobile)
                console.warn('Autoplay falhou, iniciando preview mudo em loop:', playError.message)
                if (isMounted) {
                  video.muted = true
                  video.currentTime = MUTED_VIDEO_START_SECONDS_INIT
                  setIsMutedAutoplay(true)
                  try {
                    await video.play()
                    setIsPlaying(true)
                    startTimeTracking()
                  } catch (mutedError) {
                    console.error('Falha também no autoplay muted:', mutedError)
                  }
                }
              }
            }
          }

          const handleError = () => {
            console.error('Erro ao carregar vídeo (HLS nativo)')
            setLoadError('Erro ao carregar o vídeo.')
          }

          video.src = src
          video.addEventListener('loadeddata', handleLoadedData, { once: true })
          video.addEventListener('error', handleError, { once: true })
        } else {
          setLoadError('Seu navegador não suporta a reprodução deste tipo de vídeo.')
        }
      } catch (error) {
        console.error('Erro ao inicializar player:', error)
        setLoadError('Erro ao inicializar o player de vídeo.')
      }
    }

    initializePlayer()

    return () => {
      isMounted = false
      stopTimeTracking()

      // Salvar tempo final antes de destruir
      if (video && watchedTime > 0) {
        saveTimeToStorage(watchedTime)
      }

      if (hlsInstance) {
        hlsInstance.destroy()
        hlsInstance = null
      }
      hlsRef.current = null
    }
  }, [src, isPrerender])

  // Event listeners do vídeo
  useEffect(() => {
    if (isPrerender) return

    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      setIsPlaying(true)
      startTimeTracking()
      // Esconder controles automaticamente ao dar play
      if (!isMutedAutoplay) hideControlsAfterDelay()
    }

    const handlePause = () => {
      setIsPlaying(false)
      stopTimeTracking()
    }

    const handleEnded = () => {
      setIsPlaying(false)
      stopTimeTracking()
      // Limpar localStorage quando o vídeo terminar
      clearSavedTime()
      // Marcar como finalizado e manter controles visíveis
      try { localStorage.setItem(endedStorageKey, '1') } catch {}
      setVideoEnded(true)
      setFakeProgress(1)
      setShowControls(true)
      if (onEnded) onEnded()
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [startTimeTracking, stopTimeTracking, onEnded, clearSavedTime, isPrerender])

  const togglePlayPause = (e) => {
    // Prevenir propagação para evitar duplo clique
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    const video = videoRef.current
    if (!video || !isLoaded) return

    // Se estiver em modo muted autoplay, o clique inicia o vídeo real
    if (isMutedAutoplay) {
      video.muted = false
      video.currentTime = 0
      setFakeProgress(0)
      setIsMutedAutoplay(false)
      video.play().catch(console.error)
      setIsPlaying(true)
      return
    }

    // Se o vídeo terminou (está no final), resetar para o início
    if (video.ended) {
      video.currentTime = 0
      setWatchedTime(0)
      setFakeProgress(0)
      clearSavedTime()
      lastReportedSecond.current = -1
      lastSavedSecond.current = -1
      // Remover flag de finalizado ao reiniciar
      setVideoEnded(false)
      try { localStorage.removeItem(endedStorageKey) } catch {}
    }

    // Usar o estado atual do vídeo, não o estado React para decisão
    if (video.paused || video.ended) {
      video.play().catch(console.error)
    } else {
      video.pause()
    }
  }

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={!isMobile ? showControlsHandler : undefined}
      onMouseMove={!isMobile ? showControlsHandler : undefined}
      onMouseLeave={!isMobile ? () => setShowControls(false) : undefined}
      onTouchStart={isMobile ? showControlsHandler : undefined}>

      {/* Overlay de retomada */}
      {showResumePrompt && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center bg-transparent"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <div className="bg-black/80 border  pulse pulse-border border-zinc-700 mt-2 rounded-2xl px-4 py-5 max-w-sm w-full mx-4 text-center shadow-2xl">
            <p className="text-xs sm:text-base text-white mb-2 font-medium">
              Você já começou a assistir este vídeo.
            </p>
            <p className="text-[xs] sm:text-sm text-zinc-300 mb-2">
              Deseja continuar de onde parou ou começar do início?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStartFromZero}
                className="flex-1 rounded-full border border-zinc-600 bg-zinc-800/90 text-white text-[10px] font-semibold py-1.5 hover:bg-zinc-700 transition-colors"
              >
                Começar do início
              </button>
              <button
                onClick={handleResumeFromSaved}
                className="flex-1 rounded-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-800 text-white text-xs sm:text-sm font-semibold py-1.5 hover:from-amber-400 hover:via-orange-400 hover:to-yellow-400 transition-all duration-300 shadow-lg shadow-orange-500/30"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Vídeo */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg"
        style={{ pointerEvents: 'none' }}
        playsInline
        muted={false}
        preload="metadata"
        controls={!fakeBar}
      />

      {/* Overlay Muted Autoplay */}
      {isMutedAutoplay && (
        <div 
          className="absolute inset-0 z-20 flex items-end mb-10 justify-center bg-black/40 cursor-pointer backdrop-blur-[2px]"
          onClick={togglePlayPause} 
        >
          <div className="flex flex-col mt-5 items-center max-w-[250px] gap-4 bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 border border-gold/30 text-white w-full px-6 py-6 rounded-2xl shadow-2xl shadow-black/50 transform transition-all duration-300 hover:scale-105 hover:border-gold/50">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-800 blur-md opacity-60 animate-ping" />
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-800 flex items-center justify-center shadow-xl shadow-orange-500/50 animate-pulse ring-2 ring-gold/40 ring-offset-2 ring-offset-zinc-900">
                <Play className="w-7 h-7 text-white fill-white ml-1 drop-shadow-lg" />
              </div>
            </div>
            <p className="text-center font-semibold text-sm sm:text-base text-white/90">
              Seu vídeo já começou
              <br />
              <span className="text-gold/80 text-xs sm:text-sm font-normal">Clique para ouvir</span>
            </p>
          </div>
        </div>
      )}
      
      {/* Overlay com controles customizados (modo fakeBar) */}
      {fakeBar && (
        <div 
          className={`absolute inset-0 transition-all duration-300 rounded-lg flex items-center justify-center cursor-pointer ${
            showControls || !isLoaded || loadError || isMutedAutoplay ? 'bg-transparent' : 'bg-transparent'
          }`}
          onClick={togglePlayPause}
        >
          {/* Botão Play/Pause centralizado */}
          {!isMutedAutoplay && (!isMobile || !isPlaying) && (
            <div
              className={`
                bg-transparent text-white rounded-full p-4 
                transition-all duration-200 transform active:scale-95 pointer-events-none
                ${!isLoaded ? 'opacity-50' : ''}
                ${loadError ? 'hidden' : ''}
                ${showControls ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
              `}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Indicador de carregamento */}
      {!isLoaded && !loadError && (
        <div className="absolute inset-0 bg-transparent rounded-lg flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            {retryCount > 0 && (
              <p className="text-white text-sm">Tentativa {retryCount}/3...</p>
            )}
          </div>
        </div>
      )}

      {/* Tela de erro */}
      {loadError && (
        <div className="absolute inset-0 bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center text-white p-6">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar vídeo</h3>
            <p className="text-sm text-gray-300 mb-4">{loadError}</p>
            {retryCount < 3 && (
              <button 
                onClick={retryLoad}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Tentar novamente
              </button>
            )}
          </div>
        </div>
      )}

      {/* Fake Progress Bar - Retenção psicológica VSL */}
      {fakeBar && isLoaded && !loadError && !isMutedAutoplay && (isPlaying || fakeProgress > 0) && (
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <div className="w-full h-3 bg-black/40 rounded-sm overflow-hidden">
            <div
              className="h-full rounded-sm"
              style={{
                width: `${Math.min(fakeProgress * 100, 100)}%`,
                background: '#8f40f7',
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}