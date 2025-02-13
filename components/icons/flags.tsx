export function IndonesiaFlag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3 2"
      width="16"
      height="12"
      {...props}
    >
      <path fill="#ce1126" d="M0 0h3v1H0z" />
      <path fill="#fff" d="M0 1h3v1H0z" />
    </svg>
  )
}

export function RussiaFlag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3 2"
      width="16"
      height="12"
      {...props}
    >
      <path fill="#fff" d="M0 0h3v1H0z" />
      <path fill="#0039A6" d="M0 1h3v1H0z" />
      <path fill="#D52B1E" d="M0 1.33h3v.67H0z" />
    </svg>
  )
}

export function UnionJackFlag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="16" height="12" {...props}>
      <clipPath id="s">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#s)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  )
}

export function IndiaFlag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="16" height="12" {...props}>
      <path fill="#ff9933" d="M0 0h900v200H0z"/>
      <path fill="#fff" d="M0 200h900v200H0z"/>
      <path fill="#128807" d="M0 400h900v200H0z"/>
      <g transform="translate(450,300)">
        <circle r="92.5" fill="#008"/>
        <circle r="80" fill="#fff"/>
        <circle r="16" fill="#008"/>
        <g id="d">
          <g id="c">
            <g id="b">
              <g id="a">
                <circle r="4" fill="#008" transform="rotate(7.5) translate(80)"/>
                <path stroke="#008" d="M0,80 0,88"/>
              </g>
              <use href="#a" transform="rotate(15)"/>
            </g>
            <use href="#b" transform="rotate(30)"/>
          </g>
          <use href="#c" transform="rotate(60)"/>
        </g>
        <use href="#d" transform="rotate(120)"/>
        <use href="#d" transform="rotate(-120)"/>
      </g>
    </svg>
  )
}

export function VietnamFlag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" width="16" height="12" {...props}>
      <path fill="#da251d" d="M0 0h30v20H0z"/>
      <path fill="#ff0" d="M15 4l-3.53 10.85 9.24-6.7H9.29l9.24 6.7z"/>
    </svg>
  )
}

// Add more flag components as needed...