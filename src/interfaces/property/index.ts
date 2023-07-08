import { LeaseInterface } from 'interfaces/lease';
import { LandlordInterface } from 'interfaces/landlord';
import { GetQueryInterface } from 'interfaces';

export interface PropertyInterface {
  id?: string;
  name: string;
  description?: string;
  image?: string;
  landlord_id?: string;
  created_at?: any;
  updated_at?: any;
  lease?: LeaseInterface[];
  landlord?: LandlordInterface;
  _count?: {
    lease?: number;
  };
}

export interface PropertyGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  description?: string;
  image?: string;
  landlord_id?: string;
}
