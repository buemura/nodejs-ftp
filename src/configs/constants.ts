export const PATHS = {
  LOCAL: "./temp",
  REMOTE_CURRENT: "/home/ftp_server/YourFolder/Current",

  QUERY: {
    TRUNCATE: "./scripts/truncate_tables.sql",
  },
} as const;

export const DOWNLOAD_WHITELIST = ["DDL", "UPD"];
