export function ZeroSvg({ className = '', width = '16', height = '16', fill = 'currentColor' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={width} height={height}>
      <rect width="100" height="100" rx="20" fill="#000" />
      <path d="M30 30 v40" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <path d="M70 30 v40" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <rect className="blinking-rect" x="47" y="33" width="6" height="35" fill="#fff" />
    </svg>
  );
}
export function LoaderSvg({ className = '', width = '16', height = '16', fill = 'currentColor' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={width} height={height} fill={fill}>
      <path d="M18.364 5.63604L16.9497 7.05025C15.683 5.7835 13.933 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12H21C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.4853 3 16.7353 4.00736 18.364 5.63604Z"></path>
    </svg>
  );
}
export function ErrorSvg({ className = '', width = '16', height = '16', fill = 'currentColor' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={width} height={height} fill={fill}>
      <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z"></path>
    </svg>
  );
}
export function OpenEyeSvg({ className = '', width = '16', height = '16', fill = 'currentColor' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={width} height={height} fill={fill}>
      <path d="M1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12ZM12.0003 17C14.7617 17 17.0003 14.7614 17.0003 12C17.0003 9.23858 14.7617 7 12.0003 7C9.23884 7 7.00026 9.23858 7.00026 12C7.00026 14.7614 9.23884 17 12.0003 17ZM12.0003 15C10.3434 15 9.00026 13.6569 9.00026 12C9.00026 10.3431 10.3434 9 12.0003 9C13.6571 9 15.0003 10.3431 15.0003 12C15.0003 13.6569 13.6571 15 12.0003 15Z"></path>
    </svg>
  );
}
export function CloseEyeSvg({ className = '', width = '16', height = '16', fill = 'currentColor' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={width} height={height} fill={fill}>
      <path d="M4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457ZM14.7577 16.1718L13.2937 14.7078C12.902 14.8952 12.4634 15.0002 12.0003 15.0002C10.3434 15.0002 9.00026 13.657 9.00026 12.0002C9.00026 11.537 9.10522 11.0984 9.29263 10.7067L7.82866 9.24277C7.30514 10.0332 7.00026 10.9811 7.00026 12.0002C7.00026 14.7616 9.23884 17.0002 12.0003 17.0002C13.0193 17.0002 13.9672 16.6953 14.7577 16.1718ZM7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925L16.947 12.7327C16.9821 12.4936 17.0003 12.249 17.0003 12.0002C17.0003 9.23873 14.7617 7.00016 12.0003 7.00016C11.7514 7.00016 11.5068 7.01833 11.2677 7.05343L7.97446 3.76015Z"></path>
    </svg>
  );
}
export function GoogleIconSvg({ className = '', width = '16', height = '16', fill = 'currentColor' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={width} height={height} fill={fill}>
      <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z"></path>
    </svg>
  );
}
export function CheckedSvg({ className = '', width = '16', height = '16', fill = 'currentColor' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={width} height={height} fill={fill}>
      <path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM17.4571 9.45711L16.0429 8.04289L11 13.0858L8.20711 10.2929L6.79289 11.7071L11 15.9142L17.4571 9.45711Z"></path>
    </svg>
  );
}
export function NoteSvg({ className = '', width = '16', height = '16', fill = 'currentColor' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width={width} height={height} fill={fill}>
      <path d="M288-168v-432q0-30.08 21-51.04T360-672h432q29.7 0 50.85 21.15Q864-629.7 864-600v312L672-96H360q-29.7 0-50.85-21.15Q288-138.3 288-168ZM98-703q-5-29 12.5-54t46.5-30l425-76q29-5 53.5 12.5T665-804l11 60h-73l-9-48-425 76 47 263v228q-16-7-27.5-21.08Q177-260.16 174-278L98-703Zm262 103v432h264v-168h168v-264H360Zm216 216Z" />
    </svg>
  );
}
export function TrashSvg({ className = '', width = '16', height = '16', fill = 'currentColor' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width={width} height={height} fill={fill}>
      <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
    </svg>
  );
}
export function CloudDoneSvg({ className = '', width = '16', height = '16', fill = 'currentColor' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width={width} height={height} fill={fill}>
      <path d="m429-314 204-204-51-51-153 153-68-68-51 51 119 119ZM240-192q-80 0-136-56T48-384q0-76 52-131.5T227-576q23-85 92.5-138.5T480-768q103 0 179 69.5T744-528q70 0 119 49t49 119q0 70-49 119t-119 49H240Zm0-72h504q40 0 68-28t28-68q0-40-28-68t-68-28h-66l-6-65q-7-74-62-124.5T480-696q-64 0-114.5 38.5T297-556l-14 49-51 3q-48 3-80 37.5T120-384q0 50 35 85t85 35Zm240-216Z" />
    </svg>
  );
}
export function MoreHorizontalSvg({ className = '', width = '16', height = '16', fill = 'currentColor' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" width={width} height={height} fill={fill}>
      <path d="M263.79-408Q234-408 213-429.21t-21-51Q192-510 213.21-531t51-21Q294-552 315-530.79t21 51Q336-450 314.79-429t-51 21Zm216 0Q450-408 429-429.21t-21-51Q408-510 429.21-531t51-21Q510-552 531-530.79t21 51Q552-450 530.79-429t-51 21Zm216 0Q666-408 645-429.21t-21-51Q624-510 645.21-531t51-21Q726-552 747-530.79t21 51Q768-450 746.79-429t-51 21Z" />
    </svg>
  );
}
export function DeleteForeverSvg({ className = '', width = '16', height = '16', fill = 'currentColor' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width={width} height={height} fill={fill}>
      <path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/>
    </svg>
  );
}
export function RestoreFromTrashSvg({ className = '', width = '16', height = '16', fill = 'currentColor' }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width={width} height={height} fill={fill}>
      <path d="M440-320h80v-166l64 62 56-56-160-160-160 160 56 56 64-62v166ZM280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/>
    </svg>
  );
}
// export function Svg({ className = '', width = '16', height = '16', fill = 'currentColor' }) {
//   return (
//     <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={width} height={height} fill={fill}>

//     </svg>
//   );
// }
