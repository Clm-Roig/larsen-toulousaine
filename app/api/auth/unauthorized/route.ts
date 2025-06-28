const getDefaultResponse = (action: string) => {
  return Response.json(
    {
      message: `Vous devez être authentifié pour ${action}.`,
    },
    { status: 401 },
  );
};

export function DELETE() {
  return getDefaultResponse("supprimer cette ressource");
}
export function POST() {
  return getDefaultResponse("créer cette ressource");
}
export function PUT() {
  return getDefaultResponse("modifier cette ressource");
}
export function GET() {
  return getDefaultResponse("accéder à cette ressource");
}
