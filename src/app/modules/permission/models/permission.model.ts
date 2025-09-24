export interface Permission {
    _id?: string;
    url?: string;
    method?: string;
    model?: string
    selected?: boolean;
    has_permission?: boolean; // Este campo es para el frontend en la vista de asignación de roles

}
