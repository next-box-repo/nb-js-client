export enum RestrictionSharing {
    NONE = 'none',
    SOFT = 'soft',
    HARD = 'hard',
}

export interface Restriction {
    sharing: RestrictionSharing;
    divide: RestrictionSharing;
}
