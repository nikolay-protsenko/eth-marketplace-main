
const SIZE = {
  sm: "p-2 text-base xs:px-4",
  md: "p-3 text-base xs:px-8",
  lg: "p-3 text-lg xs:px-8"
}



export default function Button({
  children,
  className,
  size = "md",
  hoverable = true,
  variant = "purple",
  ...rest
}) {

  const sizeClass = SIZE[size]
  const variants = {
    white: `text-black bg-white`,
    green: `text-white bg-green-600 ${hoverable && "hover:bg-green-700"}`,
    purple: `text-white bg-blue-600 ${hoverable && "hover:bg-blue-700"}`,
    red: `text-white bg-red-600 ${hoverable && "hover:bg-red-700"}`,
    lightPurple: `text-blue-700 bg-blue-100 ${hoverable && "hover:bg-blue-200"}`,
  }

  return (
    <button
      {...rest}
      className={`${sizeClass} disabled:opacity-50 disabled:cursor-not-allowed border rounded-md font-medium ${className} ${variants[variant]}`}>
      {children}
    </button>
  )
}
