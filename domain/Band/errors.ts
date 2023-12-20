export enum CREATE_BAND_ERROR_NAMES {
  CONFLICTING_BAND_NAME = "CONFLICTING_BAND_NAME",
  CANT_DELETE_BAND_BECAUSE_IN_GIG = "CANT_DELETE_BAND_BECAUSE_IN_GIG",
}

export const getConflictingBandNameError = (bandName: string) => ({
  name: CREATE_BAND_ERROR_NAMES.CONFLICTING_BAND_NAME,
  message: `A band with the name "${bandName}" already exists`,
  frMessage: `Un groupe avec le nom "${bandName}" existe déjà.`,
  status: 409,
});

export const cantDeleteBandBecauseInGigError = () => ({
  name: CREATE_BAND_ERROR_NAMES.CANT_DELETE_BAND_BECAUSE_IN_GIG,
  message: "This band can't be deleted because it appears in at least one gig.",
  frMessage:
    "Ce groupe ne peut pas être supprimé car il apparaît dans au moins un concert.",
  status: 409,
});
