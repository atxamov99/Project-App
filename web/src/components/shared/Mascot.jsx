import logo from '../../assets/LingvaUz_Logo_Shaffof.png'

export default function Mascot({ size = 40, className = '' }) {
  return (
    <img
      src={logo}
      alt="LingvaUZ logo"
      width={size}
      height={size}
      className={`object-contain select-none ${className}`}
      style={{ width: size, height: size }}
      draggable={false}
    />
  )
}
