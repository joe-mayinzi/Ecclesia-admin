import React from "react";

export function getRandomInt(n: number) {
  return Math.floor(Math.random() * n);
}

export function shuffle(s: string) {
  var arr = s.split("");
  var n = arr.length;

  for (var i = 0; i < n - 1; ++i) {
    var j = getRandomInt(n);

    var temp = arr[i];

    arr[i] = arr[j];
    arr[j] = temp;
  }

  s = arr.join("");

  return s;
}

export function randomArray(array: any[]) {
  if (array.length > 0) {
    for (let i = 0; i < array.length - 1; i++) {
      const j = Math.floor(Math.random() * (array.length - i));

      const temp = array[i];

      array[i] = array[j];
      array[j] = temp;
    }
  }

  return array;
}

export function Duration({
  className,
  seconds,
}: {
  className?: string | undefined;
  seconds: number;
}) {
  return (
    <time className={className} dateTime={`P${Math.round(seconds)}S`}>
      {format(seconds)}
    </time>
  );
}

export function format(seconds: number) {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());

  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`;
  }

  return `${pad(mm)}:${ss}`;
}

export function pad(string: any) {
  return ("0" + string).slice(-2);
}

export function capitalize(str: any) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function base64DataToFile(base64Data: string) {
  const toBase64 = base64Data.substring(22);
  const binaryData = Buffer.from(toBase64, "base64");

  return new File([binaryData], "image.jpg", { type: "image/jpeg" });
}

export function getFileExtension(filename: string) {
  return filename.split(".").pop();
}

export function timerToDateTime(timerString: string) {
  // Séparer les heures, minutes et secondes
  const [hours, minutes, seconds] = timerString.split(":").map(Number);

  // Créer une nouvelle date en utilisant un objet Date
  const now = new Date(); // On prend la date actuelle comme point de départ
  const newDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    seconds,
  );

  return newDate;
}

export function timeToSeconds(timeString: string) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);

  return hours * 3600 + minutes * 60 + seconds;
}

export function secondsToTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // Formate les heures, minutes et secondes avec des zéros initiaux si nécessaire
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export const optCategoies: string[] = [
  "Louange",
  "Adoration",
  "Prière",
  "Culte",
  "Prophétie",
  "Témoignage",
  "Délivrances",
  "Fois",
  "Pardon",
  "Bénédiction",
];

export function getRandomNumberBetween(x: number, y: number) {
  // Vérifie que x est inférieur à y
  if (x >= y) {
    throw new Error("La valeur de x doit être inférieure à celle de y.");
  }

  return Math.floor(Math.random() * (y - x + 1)) + x;
}
