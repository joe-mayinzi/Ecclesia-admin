"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { api_url } from "@/app/lib/request/request";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Typage vidéo
type VideoView = {
  id: number;
  createdAt: string;
  vues: number;
  video?: {
    id: number;
    titre: string;
  };
};

type VideoStat = {
  id: number;
  titre: string;
  auteur: string;
  vues: number;
  views: VideoView[];
  eglises?: string;
};

type Props = { data: any[] };

export default function VideoStatsTableUI({ data }: Props) {
  const [videos, setVideos] = useState<VideoStat[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  // Formater les vidéos
  useEffect(() => {
    const formattedVideos = data.map(video => ({
      id: video.videoId,
      titre: video.views[0]?.video?.titre || `Vidéo ${video.videoId}`,
      auteur: `${video.views[0]?.user?.prenom || ""} ${video.views[0]?.user?.nom || ""}`.trim(),
      vues: parseInt(video.viewsCount),
      views: video.views.map((v: any) => ({
        id: v.id,
        createdAt: v.createdAt,
        vues: 1,
        video: v.video,
      })),
      eglises: video.views[0]?.eglise?.nom_eglise || "-",
    }));
    setVideos(formattedVideos);
  }, [data]);

  // Envoyer avertissement
  const handleWarn = async (item: VideoStat) => {
    try {
      const userID = null;
      const idContent = item.id;
      const res = await fetch(
        `${api_url}/notificationByAdmin/${userID}/${idContent}?typeContent=videos`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Erreur lors de l'envoi de l'avertissement");
      toast.success(`Avertissement envoyé pour la vidéo #${item.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Impossible d'envoyer l'avertissement");
    }
  };

  // Préparer les données pour le graphique
  useEffect(() => {
    const formattedData: any[] = videos.map(video => {
      const points = video.views.map(v => ({
        date: new Date(v.createdAt).toLocaleDateString(),
        vues: v.vues,
      }));

      const cumulated: Record<string, number> = {};
      points.forEach(p => {
        if (!cumulated[p.date]) cumulated[p.date] = 0;
        cumulated[p.date] += p.vues;
      });

      return Object.keys(cumulated).map(date => ({
        date,
        [video.titre]: cumulated[date],
      }));
    });

    const mergedData: Record<string, any> = {};
    formattedData.flat().forEach(point => {
      if (!mergedData[point.date]) mergedData[point.date] = { date: point.date };
      Object.keys(point).forEach(key => {
        if (key !== "date") mergedData[point.date][key] = point[key];
      });
    });

    setChartData(Object.values(mergedData));
  }, [videos]);

  const videoTitles = videos.map(v => v.titre);

  return (
    <>
      {/* Table des vidéos */}
      <Table aria-label="Liste des vidéos" className="pb-8" isStriped>
        <TableHeader>
          <TableColumn>N°</TableColumn>
          <TableColumn>Titre Vidéo</TableColumn>
          <TableColumn>Auteur</TableColumn>
          <TableColumn>Église</TableColumn>
          <TableColumn>Vues</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {videos.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.titre}</TableCell>
              <TableCell>{item.auteur}</TableCell>
              <TableCell>{item.eglises}</TableCell>
              <TableCell>{item.vues}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  color="warning"
                  onPress={() => handleWarn(item)}
                >
                  Avertir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Graphique en barres */}
      <div className="pt-8">
        <h3 className="text-xl font-semibold mb-4">Statistiques des vues (par date)</h3>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {videoTitles.map((title, index) => (
                <Bar
                  key={index}
                  dataKey={title}
                  fill={`hsl(${(index * 60) % 360}, 70%, 50%)`}
                  radius={[6, 6, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
