export enum CREATE_BAND_ERROR_NAMES {
  CANT_DELETE_BAND_BECAUSE_IN_GIG = "CANT_DELETE_BAND_BECAUSE_IN_GIG",
}

export const cantDeleteBandBecauseInGigError = () => ({
  name: CREATE_BAND_ERROR_NAMES.CANT_DELETE_BAND_BECAUSE_IN_GIG,
  message: "This band can't be deleted because it appears in at least one gig.",
  frMessage:
    "Ce groupe ne peut pas être supprimé car il apparaît dans au moins un concert.",
  status: 409,
});
