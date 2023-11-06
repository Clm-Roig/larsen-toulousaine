export function GET() {
  return Response.json(
    {
      message: "Vous devez être authentifié pour accéder à cette  ressource.",
    },
    { status: 401 },
  );
}
