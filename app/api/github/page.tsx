// app/github/page.tsx
import styled from "styled-components";
import RepoList from "@/components/github/repoList";

export const dynamic = "force-dynamic";

const Main = styled.main`
  min-height: 100vh;
  background: #000;
  color: #fff;
`;

export default function GithubDefaultListPage() {
  return (
    <Main>
      <RepoList user="choidy180" linkTo="github" />
    </Main>
  );
}
