// types/project.ts
export interface Project {
  id: number;
  name: string;
  description: string ;
  start_date: string ;
  end_date: string ;
  status: string;
  location: string ;
  foreman_id: number;
  engineer_id: number ;
  project_manager_id: number ;
}