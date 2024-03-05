import SideBar from "../../components/sidebar";

export default async function Name({
  params,
  children,
}: {
  params: {
    key: string;
  };
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <SideBar keyVal={params.key} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
