
interface ReportsHeaderProps {
  title: string;
  children?: React.ReactNode;
}

const ReportsHeader: React.FC<ReportsHeaderProps> = ({ title, children }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
    <Typography variant="h4" sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

export default ReportsHeader;
