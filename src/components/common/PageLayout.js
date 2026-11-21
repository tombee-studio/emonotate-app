import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

// Consistent page frame: max width, generous padding, optional title.
export const PageContainer = ({ title, subtitle, actions, maxWidth = 'xl', children }) => (
  <Container maxWidth={maxWidth} sx={{ py: { xs: 2, md: 4 } }}>
    {(title || actions) && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          {title && <Typography variant="h4" component="h2">{title}</Typography>}
          {subtitle && <Typography color="text.secondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>}
        </Box>
        {actions}
      </Box>
    )}
    <Stack spacing={3}>{children}</Stack>
  </Container>
);

// Card with comfortable padding; use for every content block.
export const Section = ({ title, children, sx }) => (
  <Card sx={{ p: { xs: 2, md: 3 }, ...sx }}>
    {title && <Typography variant="h6" component="h3" sx={{ mb: 2 }}>{title}</Typography>}
    {children}
  </Card>
);

export const EmptyState = ({ message = 'データがありません', hint, icon }) => (
  <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
    {icon || <InboxOutlinedIcon sx={{ fontSize: 48, opacity: 0.6 }} />}
    <Typography sx={{ mt: 1 }} fontWeight={600}>{message}</Typography>
    {hint && <Typography variant="body2">{hint}</Typography>}
  </Box>
);

export const ListSkeleton = ({ rows = 4 }) => (
  <Stack spacing={1.5} role="status" aria-label="読み込み中">
    {Array.from({ length: rows }).map((_, i) => (
      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box sx={{ flexGrow: 1 }}>
          <Skeleton width="50%" />
          <Skeleton width="30%" />
        </Box>
      </Box>
    ))}
  </Stack>
);
