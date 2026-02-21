export function useAppVersion() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
  const commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA || '';
  const shortSha = commitSha.slice(0, 7);
  
  const displayVersion = shortSha ? `v${version} (${shortSha})` : `v${version}`;

  return {
    version,
    commitSha,
    shortSha,
    displayVersion,
  };
}
