// app/foreman/projects/page.tsx

'use client';

import ProjectsPage from '@/components/project/ProjectsPage';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Page() {
  return <ProtectedRoute>
    <ProjectsPage />
  </ProtectedRoute>;
}