import React from 'react';

export interface DressIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

/**
 * DressIcon: Biểu tượng váy thời trang/dạ hội/váy cưới
 * Chuẩn Lucide SVG stroke-based, rõ nét ở mọi kích cỡ (14px - 40px)
 */
export const DressIcon: React.FC<DressIconProps> = ({
  className = 'w-5 h-5',
  size,
  strokeWidth = 2,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
      {...props}
    >
      {/* Thân trên váy (cúp ngực / hai dây) */}
      <path d="M8 3h8l-1.5 7h-5z" />
      {/* Quai áo hai bên */}
      <path d="M9 3v2" />
      <path d="M15 3v2" />
      {/* Vòng eo thắt */}
      <path d="M9.5 10h5" />
      {/* Tùng váy bồng xòe chữ A */}
      <path d="M9.5 10L4 21h16l-5.5-11" />
      {/* Đường nếp gấp váy thanh lịch */}
      <path d="M12 10v11" />
    </svg>
  );
};

export default DressIcon;
