"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play } from "lucide-react"
import Image from "next/image"

// All videos in a single flat list
const videos = [
  {
    id: "vypFEVpwvHs",
    title: "Интервью с основателем лагеря 'Маранафа'",
    description: "Основатель лагеря рассказывает о истории создания и развития лагеря Маранафа.",
  },
  {
    id: "Vh1EPMsrzLo",
    title: "Интервью с директором лагеря. Лагерь как процесс",
    description: "Директор лагеря делится своим видением организации лагеря и его влиянии на детей.",
  },
  {
    id: "ul5mvWWx7YM",
    title: "Приглашение в лагерь Маранафа 7G - 2022",
    description: "Официальное приглашение в лагерь Маранафа на сезон 2022 года с темой '7G - Миссия Выполнима'.",
    year: 2022,
  },
  {
    id: "VP0myINBQ1Q",
    title: "Маранафа 2021 'Королевство Л'",
    description: "Обзор летнего лагеря 2021 года с тематикой 'Королевство Л'.",
    year: 2021,
  },
  {
    id: "T61BzlNEcrM",
    title: "Маранафа 'Мечты и реальность' сотрудников",
    description: "Сотрудники лагеря рассказывают о своих мечтах и как они воплощаются в реальность в лагере.",
  },
  {
    id: "s2OtiHSSt9A",
    title: "Маранафа 2013",
    description: "Видеоотчет о летнем лагере Маранафа 2013 года.",
    year: 2013,
  },
  {
    id: "AlEGCdt1x2E",
    title: "Маранафа 2012",
    description: "Видеоотчет о летнем лагере Маранафа 2012 года.",
    year: 2012,
  },
  {
    id: "t3g4cEh7AW4",
    title: "Маранафа 2008",
    description: "Видеоотчет о летнем лагере Маранафа 2008 года.",
    year: 2008,
  },
  {
    id: "XI0xS11-tBM",
    title: "Маранафа 2007",
    description: "Видеоотчет о летнем лагере Маранафа 2007 года.",
    year: 2007,
  },
  {
    id: "55BTQfrCVr0",
    title: "Маранафа 2005",
    description: "Видеоотчет о летнем лагере Маранафа 2005 года.",
    year: 2005,
  },
  {
    id: "IVgp8q-vCZE",
    title: "Маранафа 2002",
    description: "Видеоотчет о летнем лагере Маранафа 2002 года.",
    year: 2002,
  },
  {
    id: "_qKYfgUNiIs",
    title: "Маранафа 2000",
    description: "Видеоотчет о летнем лагере Маранафа 2000 года.",
    year: 2000,
  },
]

export default function VideoArchivePage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId)
  }

  const closeVideo = () => {
    setSelectedVideo(null)
  }

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Видео архив</h1>
          <div className="mt-2 h-1 w-20 bg-[#FFD700] mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Коллекция видео с предыдущих сезонов лагеря, интервью и особых моментов.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} onVideoClick={handleVideoClick} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-[#B22234] hover:bg-[#8e1c29] text-white">
            <a
              href="https://www.youtube.com/channel/UC2AinnhmASBIXLfNu4DzjFA"
              target="_blank"
              rel="noopener noreferrer"
            >
              Посетить YouTube канал
            </a>
          </Button>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeVideo}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button className="absolute -top-10 right-0 text-white hover:text-gray-300" onClick={closeVideo}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface VideoProps {
  video: {
    id: string
    title: string
    description: string
    year?: number
  }
  onVideoClick: (id: string) => void
}

function VideoCard({ video, onVideoClick }: VideoProps) {
  // Use actual YouTube thumbnails
  const thumbnailUrl = `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`
  // Fallback to medium quality if high quality isn't available
  const fallbackThumbnailUrl = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-video cursor-pointer group" onClick={() => onVideoClick(video.id)}>
        <Image
          src={thumbnailUrl || "/placeholder.svg"}
          alt={video.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          onError={(e) => {
            // If high quality thumbnail fails, use medium quality
            const target = e.target as HTMLImageElement
            target.src = fallbackThumbnailUrl
          }}
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 rounded-full bg-[#B22234]/80 flex items-center justify-center">
            <Play className="h-8 w-8 text-white" />
          </div>
        </div>
        {video.year && (
          <div className="absolute top-2 right-2 bg-[#B22234] text-white px-2 py-1 rounded text-sm font-bold">
            {video.year}
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{video.title}</h3>
        <p className="text-gray-700 text-sm line-clamp-3">{video.description}</p>
      </CardContent>
    </Card>
  )
}
