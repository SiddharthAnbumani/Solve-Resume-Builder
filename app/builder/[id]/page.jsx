import Builder from "../../components/Builder";

export const metadata = { title: "Editor · Solve Resumé" };

export default async function BuilderPage({ params }) {
  const { id } = await params;
  return <Builder id={id} />;
}
