import { Fira_Code as FontMono, Inter as FontSans, Chivo_Mono } from "next/font/google"

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const chivoMono = Chivo_Mono({
  subsets: ['latin'],
  variable: "--font-chivo"
})



{/* <div className="card-audio-img-blur" style={{ background: `url(${file_url}${audio.photo}), lightgray 50% / cover no-repeat` }}>
  <Image
    alt={`${audio.auteur}`}
    height={107}
    src={`${file_url}${audio.photo}`}
    width={107}
  />
</div> */}
