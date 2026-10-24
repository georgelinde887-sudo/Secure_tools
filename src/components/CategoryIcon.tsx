import React from 'react';
import {
  ShieldCheck,
  Building,
  ArrowUpRight,
  Server,
  Terminal,
  Users,
  Lock,
  Cloud,
  HardDrive,
  FolderArchive,
  FileEdit,
  Workflow,
  Key,
  CheckSquare,
  FileText,
  ShieldAlert,
  Archive,
  PenTool,
  Briefcase,
  LockKeyhole,
  Shield,
  Eye,
  Cpu,
  ScanText,
  LucideProps
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name: string;
}

export function CategoryIcon({ name, ...props }: CategoryIconProps) {
  switch (name) {
    case 'ShieldCheck': return <ShieldCheck {...props} />;
    case 'Building': return <Building {...props} />;
    case 'ArrowUpRight': return <ArrowUpRight {...props} />;
    case 'Server': return <Server {...props} />;
    case 'Terminal': return <Terminal {...props} />;
    case 'Users': return <Users {...props} />;
    case 'Lock': return <Lock {...props} />;
    case 'Cloud': return <Cloud {...props} />;
    case 'HardDrive': return <HardDrive {...props} />;
    case 'FolderArchive': return <FolderArchive {...props} />;
    case 'FileEdit': return <FileEdit {...props} />;
    case 'Workflow': return <Workflow {...props} />;
    case 'Key': return <Key {...props} />;
    case 'CheckSquare': return <CheckSquare {...props} />;
    case 'FileText': return <FileText {...props} />;
    case 'ShieldAlert': return <ShieldAlert {...props} />;
    case 'Archive': return <Archive {...props} />;
    case 'PenTool': return <PenTool {...props} />;
    case 'Briefcase': return <Briefcase {...props} />;
    case 'LockKeyhole': return <LockKeyhole {...props} />;
    case 'Shield': return <Shield {...props} />;
    case 'Eye': return <Eye {...props} />;
    case 'Cpu': return <Cpu {...props} />;
    case 'ScanText': return <ScanText {...props} />;
    default: return <FileText {...props} />;
  }
}
