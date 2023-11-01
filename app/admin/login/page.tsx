const LoginPage = ({ searchParams }: { searchParams: { error?: string } }) => {
  const csrfToken = "token";

  return (
    <>
      <form
        method="POST"
        action={`${process.env.serverURL}/api/auth/callback/credentials`}
      >
        <input required placeholder="email" name="v" />

        <input
          required
          placeholder="password"
          name="password"
          type="password"
        />

        <input hidden value={csrfToken} name="csrfToken" readOnly />

        <button>Envoyer</button>
      </form>

      {searchParams.error && <p>Authentification échouée</p>}
    </>
  );
};

export default LoginPage;
