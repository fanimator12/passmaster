import { Link, Typography } from "@mui/material";

export interface LinkLabelProps {
  label: string;
  link: string;
  title: string;
  extraLabel?: string;
  extraLink?: string;
  extraTitle?: string;
}

const LinkLabel = ({
  label,
  link,
  title,
  extraLabel,
  extraLink,
  extraTitle,
}: LinkLabelProps) => {
  return (
    <Typography color="#fff" sx={{ textTransform: "none" }}>
      {label}{" "}
      <Link sx={{ color: "#fff" }} href={link}>
        <strong>{title}</strong>
      </Link>
      {extraLabel}{" "}
      <Link sx={{ color: "#fff" }} href={extraLink}>
        <strong>{extraTitle}</strong>
      </Link>
    </Typography>
  );
};

export default LinkLabel;
