// Outline icons specific to the admin section

const make = (path) => (props) => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24" {...props}>
    {path}
  </svg>
);

export const DashboardIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13l9-9 9 9M5 12v7a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1v-7" />
);

export const BoxIcon = make(
  <>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8l-9-5-9 5 9 5 9-5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8v8l9 5 9-5V8M12 13v8" />
  </>
);

export const InventoryIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
);

export const OrderIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
);

export const UsersIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.36-1.86M17 20H7m10 0v-2a4 4 0 00-3-3.87M7 20H2v-2a3 3 0 015.36-1.86M7 20v-2a4 4 0 013-3.87m4-1.13a4 4 0 11-8 0 4 4 0 018 0zm6-3a3 3 0 11-6 0 3 3 0 016 0z" />
);

export const TagIcon = make(
  <>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5l9 9-9 9-9-9V3z" />
  </>
);

export const FolderIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
);

export const StarOutlineIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.7 5.236a1 1 0 00.95.69h5.504c.969 0 1.371 1.24.588 1.81l-4.45 3.234a1 1 0 00-.364 1.118l1.7 5.236c.3.921-.755 1.688-1.54 1.118L12.587 17.21a1 1 0 00-1.176 0l-4.45 3.234c-.785.57-1.838-.197-1.539-1.118l1.7-5.236a1 1 0 00-.364-1.118L2.31 9.738c-.783-.57-.38-1.81.588-1.81h5.504a1 1 0 00.95-.69l1.7-5.236z" />
);

export const ChartIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 14l4-4 4 4 5-5" />
);

export const DocIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M9 13h6M9 17h6" />
);

export const SettingsIcon = make(
  <>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317a1.724 1.724 0 013.35 0c.158.65.736 1.105 1.402 1.105.625 0 1.166.476 1.165 1.117 0 .67.456 1.247 1.105 1.405a1.724 1.724 0 010 3.35c-.65.158-1.105.736-1.105 1.402 0 .625.476 1.166 1.117 1.165.67 0 1.247.456 1.405 1.105a1.724 1.724 0 010 3.35c-.658.158-1.405-.075-1.756-.659" />
    <circle cx="12" cy="12" r="3" />
  </>
);

export const LogoutIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
);

export const SearchAdminIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
);

export const BellIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2 2 0 0118 14.158V11a6 6 0 10-12 0v3.159a2 2 0 01-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
);

export const PlusAdminIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
);

export const TrashAdminIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
);

export const EditIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
);

export const EyeIcon = make(
  <>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </>
);

export const ChevronDownIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
);

export const ChevronRightAdminIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
);

export const CloseAdminIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
);

export const CheckAdminIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
);

export const ImageIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
);

export const TrendUpIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
);

export const TrendDownIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
);

export const RevenueIcon = make(
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
);
