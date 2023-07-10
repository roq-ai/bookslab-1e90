import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface BookInterface {
  id?: string;
  title: string;
  author: string;
  publication_year?: number;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;

  organization?: OrganizationInterface;
  _count?: {};
}

export interface BookGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  author?: string;
  organization_id?: string;
}
