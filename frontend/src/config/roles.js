import { Building2, HardHat, Pickaxe, ShieldCheck, UsersRound } from 'lucide-react';

export const roles = [
  { id: 'worker', title: 'Mine Worker', portal: 'Mine Worker Portal', icon: HardHat, accent: 'purple', description: 'Work safely, manage your shift, and report field hazards.', responsibilities: ['Shift & attendance', 'Safety reporting', 'Personal safety map'] },
  { id: 'supervisor', title: 'Field Supervisor', portal: 'Field Supervisor Portal', icon: Pickaxe, accent: 'amber', description: 'Coordinate people, inspections, and urgent safety action.', responsibilities: ['Attendance approval', 'Hazard verification', 'Shift operations'] },
  { id: 'manager', title: 'Mine Manager', portal: 'Mine Manager Portal', icon: Building2, accent: 'blue', description: 'Monitor production, compliance, and mine-wide performance.', responsibilities: ['Mine performance', 'Compliance oversight', 'Operational approvals'] },
  { id: 'regulator', title: 'Government Safety Inspector', portal: 'Safety Inspector Portal', icon: ShieldCheck, accent: 'emerald', description: 'Check safety work across mines.', responsibilities: ['Safety checks', 'Problem follow-up', 'Mine reports'] },
  { id: 'admin', title: 'System Administrator', portal: 'System Administration', icon: UsersRound, accent: 'slate', description: 'Maintain access controls, system health, and governance records.', responsibilities: ['User governance', 'Audit monitoring', 'Platform configuration'] }
];

export const roleById = roleId => roles.find(role => role.id === roleId) || roles[0];
