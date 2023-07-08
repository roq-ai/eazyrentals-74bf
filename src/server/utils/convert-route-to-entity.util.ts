const mapping: Record<string, string> = {
  landlords: 'landlord',
  leases: 'lease',
  properties: 'property',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
