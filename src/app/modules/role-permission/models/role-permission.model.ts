export interface RolePermission {
    _id?: string;
    role?: { _id: string } ;
    permission?: { _id: string };
    has_permission?: boolean; // Este campo es para el frontend en la vista de asignación de permisos a roles
}
