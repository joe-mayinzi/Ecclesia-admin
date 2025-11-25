"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Card,
  CardBody,
} from "@nextui-org/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
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

  // Couleurs modernes pour le graphique
  const chartColors = [
    "#10B981", // Green
    "#3B82F6", // Blue
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#06B6D4", // Cyan
    "#F97316", // Orange
  ];

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

  // Styles pour la table - Inspiré du design TailAdmin
  const tableClassNames = useMemo(
    () => ({
      wrapper: "min-h-[222px] shadow-sm rounded-lg border border-gray-200 bg-white dark:bg-gray-800 overflow-hidden",
      th: [
        "bg-gray-50",
        "text-gray-700",
        "font-semibold",
        "text-xs",
        "uppercase",
        "tracking-wider",
        "border-b",
        "border-gray-200",
        "py-4",
        "px-6",
        "first:rounded-tl-lg",
        "last:rounded-tr-lg",
      ],
      td: [
        "py-4",
        "px-6",
        "text-sm",
        "text-gray-800",
        "border-b",
        "border-gray-100",
        "group-data-[hover=true]:bg-gray-50/50",
        "transition-colors",
        "duration-200",
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
      ],
      tr: [
        "hover:bg-gray-50/30",
        "transition-all",
        "duration-200",
        "group",
        "border-b",
        "border-gray-100",
        "last:border-b-0",
      ],
    }),
    []
  );

  // Calculer le total des streams
  const totalStreams = useMemo(() => {
    return audios.reduce((sum, audio) => sum + audio.streams, 0);
  }, [audios]);

  return (
    <div className="w-full space-y-6">
      {/* En-tête avec statistiques */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Statistiques des Audios</h1>
          <p className="text-sm text-gray-600">Analyse des performances et des streams</p>
        </div>
        <div className="flex gap-4">
          <Card className="border border-gray-200 shadow-sm">
            <CardBody className="px-4 py-3">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Audios</p>
                <p className="text-2xl font-bold text-gray-800">{audios.length}</p>
              </div>
            </CardBody>
          </Card>
          <Card className="border border-gray-200 shadow-sm">
            <CardBody className="px-4 py-3">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Streams</p>
                <p className="text-2xl font-bold text-green-600">{totalStreams.toLocaleString()}</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Table des audios */}
      <Card className="border border-gray-200 shadow-sm">
        <CardBody className="p-0">
          <Table 
            aria-label="Liste des audios" 
            isStriped
            removeWrapper
            classNames={tableClassNames}
          >
            <TableHeader>
              <TableColumn className="w-16 text-xs font-semibold uppercase tracking-wider text-gray-700">N°</TableColumn>
              <TableColumn className="text-xs font-semibold uppercase tracking-wider text-gray-700">Titre Audio</TableColumn>
              <TableColumn className="text-xs font-semibold uppercase tracking-wider text-gray-700">Auteur</TableColumn>
              <TableColumn className="text-xs font-semibold uppercase tracking-wider text-gray-700">Église</TableColumn>
              <TableColumn className="text-xs font-semibold uppercase tracking-wider text-gray-700">Streams</TableColumn>
            </TableHeader>
            <TableBody 
              emptyContent={
                <div className="flex flex-col items-center justify-center py-16">
                  <p className="text-gray-500 text-sm font-medium">Aucun audio trouvé</p>
                </div>
              }
            >
              {audios.map((item, index) => (
                <TableRow 
                  key={item.id}
                  className="group hover:bg-gray-50/50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                >
                  <TableCell className="py-4 px-6">
                    <span className="text-gray-500 font-medium text-sm">#{index + 1}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="text-gray-800 font-medium text-sm">{item.titre}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="text-gray-600 text-sm">{item.auteur || "Non renseigné"}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="text-gray-600 text-sm">{item.eglises || "-"}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Chip
                        size="sm"
                        variant="flat"
                        className="font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      >
                        {item.streams.toLocaleString()}
                      </Chip>
                      {item.streams !== item.vieuxCount && (
                        <Chip
                          size="sm"
                          variant="flat"
                          className={`font-medium ${
                            item.streams > item.vieuxCount
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                          }`}
                        >
                          {item.streams > item.vieuxCount ? "↑" : "↓"}
                        </Chip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Graphique en barres amélioré */}
      <Card className="border border-gray-200 shadow-sm">
        <CardBody className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Évolution des Streams par Date</h3>
            <p className="text-sm text-gray-600">Visualisation des statistiques de streams au fil du temps</p>
          </div>
          
          <div style={{ width: "100%", height: 450 }} className="mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                margin={{ top: 20, right: 30, bottom: 60, left: 20 }}
                barCategoryGap="20%"
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  label={{ value: "Nombre de streams", angle: -90, position: "insideLeft", style: { fill: "#6b7280" } }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  labelStyle={{ color: "#374151", fontWeight: 600 }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                />
                {audioTitles.map((title, index) => (
                  <Bar
                    key={index}
                    dataKey={title}
                    radius={[8, 8, 0, 0]}
                    name={title.length > 30 ? `${title.substring(0, 30)}...` : title}
                  >
                    {chartData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Légende des couleurs */}
          {audioTitles.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Légende</p>
              <div className="flex flex-wrap gap-3">
                {audioTitles.map((title, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: chartColors[index % chartColors.length] }}
                    />
                    <span className="text-xs text-gray-600">
                      {title.length > 40 ? `${title.substring(0, 40)}...` : title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
