import { LandlordInterface } from 'interfaces/landlord';
import { PropertyInterface } from 'interfaces/property';
import { GetQueryInterface } from 'interfaces';

export interface LeaseInterface {
  id?: string;
  name: string;
  description?: string;
  landlord_id?: string;
  property_id?: string;
  created_at?: any;
  updated_at?: any;

  landlord?: LandlordInterface;
  property?: PropertyInterface;
  _count?: {};
}

export interface LeaseGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  description?: string;
  landlord_id?: string;
  property_id?: string;
}
