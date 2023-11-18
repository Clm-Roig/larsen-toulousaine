export enum CREATE_BAND_ERROR_NAMES {
  CONFLICTING_BAND_NAME = "CONFLICTING_BAND_NAME",
}

export const getConflictingBandNameError = (bandName: string) => ({
  name: CREATE_BAND_ERROR_NAMES.CONFLICTING_BAND_NAME,
  message: `A band with the name "${bandName}" already exists`,
  frMessage: `Un groupe avec le nom "${bandName}" existe déjà.`,
  status: 409,
});
