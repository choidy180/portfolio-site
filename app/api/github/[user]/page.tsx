// app/github/[user]/page.tsx
import styled from "styled-components";
import RepoList from "@/components/github/repoList";

export const dynamic = "force-dynamic";

const Main = styled.main`
  min-height: 100vh;
  background: #000;
  color: #fff;
`;

export default function GithubUserListPage({ params }: { params: { user: string } }) {
  return (
    <Main>
      <RepoList user={params.user} linkTo="internal" />
    </Main>
  );
}
