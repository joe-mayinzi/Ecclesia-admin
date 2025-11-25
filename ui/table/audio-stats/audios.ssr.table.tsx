"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { columns } from "../data";
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

// Typage audio
type AudioStream = {
  id: number;
  createdAt: string;
  streams: number;
  audio?: {
    id: number;
    titre: string;
  };
};

type AudioStat = {
  id: number;
  titre: string;
  auteur: string;
  streams: number;
  vieuxCount: number;
  streamsData: AudioStream[];
  eglises?: string;
};

type Props = { data: any[] };

export default function AudioStatsTableUI({ data }: Props) {
  const [audios, setAudios] = useState<AudioStat[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const formattedAudios = data.map(audio => {
      const firstView = audio.views?.[0]; // sécurité

      return {
        id: audio.audioId,
        titre: firstView?.audio?.titre || `Audio ${audio.audioId}`,
        auteur: firstView ? `${firstView.user?.prenom} ${firstView.user?.nom}` : "Inconnu",
        streams: parseInt(audio.viewsCount),
        vieuxCount: parseInt(audio.viewsCount),
        streamsData: (audio.views || []).map((v: any) => ({
          id: v.id,
          createdAt: v.createdAt,
          streams: 1,
          audio: v.audio,
        })),
        eglises: firstView?.eglise?.nom_eglise || "-",
      };
    });

    setAudios(formattedAudios);
  }, [data]);

  // Envoyer avertissement
  const handleWarn = async (item: AudioStat) => {
    try {
      const userID = null;
      const idContent = item.id;
      const res = await fetch(
        `${api_url}/notificationByAdmin/${userID}/${idContent}?typeContent=audios`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Erreur lors de l'envoi de l'avertissement");
      toast.success(`Avertissement envoyé pour l’audio #${item.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Impossible d'envoyer l'avertissement");
    }
  };

  // Préparer les données pour le graphique
  useEffect(() => {
    const formattedData: any[] = audios.map(audio => {
      const points = audio.streamsData.map(s => ({
        date: new Date(s.createdAt).toLocaleDateString(),
        streams: s.streams,
      }));

      const cumulated: Record<string, number> = {};
      points.forEach(p => {
        if (!cumulated[p.date]) cumulated[p.date] = 0;
        cumulated[p.date] += p.streams;
      });

      return Object.keys(cumulated).map(date => ({
        date,
        [audio.titre]: cumulated[date],
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
  }, [audios]);

  const audioTitles = audios.map(a => a.titre);

  return (
    <>
      {/* Table des audios */}
      <Table aria-label="Liste des audios" className="mb-8" isStriped>
        <TableHeader>
                  <TableColumn>N°</TableColumn>
                  <TableColumn>Titre Vidéo</TableColumn>
                  <TableColumn>Auteur</TableColumn>
                  <TableColumn>Église</TableColumn>
                  <TableColumn>Vues</TableColumn>
                  <TableColumn>Actions</TableColumn>
                </TableHeader>
        <TableBody>
          {audios.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.titre}</TableCell>
              <TableCell>{item.auteur}</TableCell>
              <TableCell>{item.eglises}</TableCell>
              <TableCell>
                {item.streams}
                <Chip
                  size="sm"
                  className="ml-2"
                  color={item.streams > item.vieuxCount ? "success" : "warning"}
                >
                  {item.streams > item.vieuxCount ? "↑" : "↓"}
                </Chip>
              </TableCell>
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
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Statistiques des streams (par date)</h3>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {audioTitles.map((title, index) => (
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
